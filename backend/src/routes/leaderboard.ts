import { Router, Request, Response } from 'express'
import { supabase } from '../index'
import { LeaderboardResponse, LeaderboardEntry, AttendeeScore, ConversationDetail } from '../types'
import { calculateAttendeeScore, compareTiebreaker, generateLeaderboard } from '../services/scoring'

const router = Router()

// GET /api/leaderboard?eventSlug=...&category=...
router.get('/', async (req: Request, res: Response) => {
  try {
    const { eventSlug, limit = 10, category = 'overall' } = req.query

    if (!eventSlug) {
      return res.status(400).json({ error: 'eventSlug is required' })
    }

    // Validate category
    const validCategories = ['overall', 'relevance', 'weird', 'offtrack', 'quality']
    const selectedCategory = (category as string).toLowerCase()
    if (!validCategories.includes(selectedCategory)) {
      return res.status(400).json({ error: 'Invalid category. Must be: overall, relevance, weird, offtrack, or quality' })
    }

    // Get event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, name, status')
      .eq('slug', eventSlug)
      .single()

    if (eventError || !event) {
      return res.status(404).json({ error: 'Event not found' })
    }

    // Check if leaderboard is locked
    const { data: snapshot } = await supabase
      .from('leaderboard_snapshots')
      .select('snapshot_data, is_locked')
      .eq('event_id', event.id)
      .eq('is_locked', true)
      .order('locked_at', { ascending: false })
      .limit(1)
      .single()

    if (snapshot?.is_locked) {
      return res.json({
        eventName: event.name,
        eventSlug: eventSlug as string,
        isLocked: true,
        leaderboard: snapshot.snapshot_data || [],
        timestamp: new Date().toISOString(),
      })
    }

    // Calculate scores dynamically
    const { data: attendees } = await supabase
      .from('attendees')
      .select('id, ref_code, name')
      .eq('event_id', event.id)
      .eq('is_active', true)

    if (!attendees || attendees.length === 0) {
      return res.json({
        eventName: event.name,
        eventSlug: eventSlug as string,
        isLocked: false,
        leaderboard: [],
        timestamp: new Date().toISOString(),
      })
    }

    // Get all valid logs
    const { data: logs } = await supabase
      .from('conversation_logs')
      .select('*')
      .eq('event_id', event.id)
      .eq('is_deleted', false)

    // Calculate scores for each attendee based on selected category
    const scores: AttendeeScore[] = attendees.map(att => {
      const userLogs = (logs || []).filter(log => log.from_attendee_id === att.id)

      const uniquePartners = new Set(userLogs.map(log => log.to_attendee_id || log.to_ref_code)).size
      const detailBonusCount = userLogs.filter(
        log => (log.note && log.note.length >= 20) || (log.topics && log.topics.length >= 2)
      ).length

      // Calculate category-specific score
      let categoryScore = 0
      let hasCategoryLogs = false
      
      if (selectedCategory === 'overall') {
        // Traditional leaderboard: connections + detail bonus
        categoryScore = calculateAttendeeScore(uniquePartners, detailBonusCount)
        hasCategoryLogs = true // Everyone appears in overall
      } else if (selectedCategory === 'quality') {
        // Average of overall AI scores
        const aiScores = userLogs
          .filter(log => log.ai_score_overall > 0)
          .map(log => log.ai_score_overall)
        categoryScore = aiScores.length > 0
          ? Math.round(aiScores.reduce((sum, s) => sum + s, 0) / aiScores.length)
          : 0
        hasCategoryLogs = aiScores.length > 0
      } else if (selectedCategory === 'relevance') {
        // EXCLUSIVE: Only logs where category IS 'relevance'
        const relevanceScores = userLogs
          .filter(log => log.ai_category === 'relevance' && log.ai_score_relevance > 0)
          .map(log => log.ai_score_relevance)
        categoryScore = relevanceScores.length > 0
          ? Math.round(relevanceScores.reduce((sum, s) => sum + s, 0) / relevanceScores.length)
          : 0
        hasCategoryLogs = relevanceScores.length > 0
      } else if (selectedCategory === 'weird') {
        // EXCLUSIVE: Only logs where category IS 'weird'
        const weirdScores = userLogs
          .filter(log => log.ai_category === 'weird' && log.ai_score_weird > 0)
          .map(log => log.ai_score_weird)
        categoryScore = weirdScores.length > 0
          ? Math.round(weirdScores.reduce((sum, s) => sum + s, 0) / weirdScores.length)
          : 0
        hasCategoryLogs = weirdScores.length > 0
      } else if (selectedCategory === 'offtrack') {
        // EXCLUSIVE: Only logs where category IS 'offtrack'
        const offtrackScores = userLogs
          .filter(log => log.ai_category === 'offtrack' && log.ai_score_offtrack > 0)
          .map(log => log.ai_score_offtrack)
        categoryScore = offtrackScores.length > 0
          ? Math.round(offtrackScores.reduce((sum, s) => sum + s, 0) / offtrackScores.length)
          : 0
        hasCategoryLogs = offtrackScores.length > 0
      }

      const lastLogTime = userLogs.length > 0 ? userLogs[userLogs.length - 1].created_at : new Date().toISOString()

      return {
        attendeeId: att.id,
        refCode: att.ref_code,
        name: att.name,
        uniquePartners,
        validLogsCount: userLogs.length,
        detailBonusCount,
        score: categoryScore,
        lastLogTime,
        hasCategoryLogs, // Track if they belong to this category
      }
    })

    // EXCLUSIVE FILTERING: Remove people who don't belong to this category
    const filteredScores = selectedCategory === 'overall' 
      ? scores // Overall shows everyone
      : scores.filter(s => s.hasCategoryLogs) // Category-specific: only show people with logs in that category

    // Sort with tie-breaker
    filteredScores.sort(compareTiebreaker)

    // Generate leaderboard
    const leaderboard: LeaderboardEntry[] = generateLeaderboard(filteredScores).slice(0, Number(limit) || 10)

    // Add conversation details for top 3
    for (let i = 0; i < Math.min(3, leaderboard.length); i++) {
      const entry = leaderboard[i]
      const attendeeId = filteredScores.find(s => s.refCode === entry.refCode)?.attendeeId
      
      if (attendeeId) {
        // Get all logs for this attendee
        const attendeeLogs = (logs || []).filter(log => log.from_attendee_id === attendeeId)
        
        // Filter by category if not overall
        let relevantLogs = attendeeLogs
        if (selectedCategory === 'relevance') {
          relevantLogs = attendeeLogs.filter(log => log.ai_category === 'relevance')
        } else if (selectedCategory === 'weird') {
          relevantLogs = attendeeLogs.filter(log => log.ai_category === 'weird')
        } else if (selectedCategory === 'offtrack') {
          relevantLogs = attendeeLogs.filter(log => log.ai_category === 'offtrack')
        }
        
        // Get partner names
        const conversationDetails: ConversationDetail[] = await Promise.all(
          relevantLogs.map(async (log) => {
            let partnerName: string | undefined
            
            // Try to get partner name from attendees
            if (log.to_attendee_id) {
              const partner = attendees?.find(a => a.id === log.to_attendee_id)
              partnerName = partner?.name
            }
            
            return {
              partnerRefCode: log.to_ref_code,
              partnerName,
              topics: Array.isArray(log.topics) ? log.topics : (typeof log.topics === 'string' ? [log.topics] : []),
              note: log.note,
              timestamp: log.created_at
            }
          })
        )
        
        entry.conversations = conversationDetails
      }
    }

    const response: LeaderboardResponse = {
      eventName: event.name,
      eventSlug: eventSlug as string,
      isLocked: false,
      leaderboard,
      timestamp: new Date().toISOString(),
    }

    return res.json(response)
  } catch (error) {
    console.error('Leaderboard error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
