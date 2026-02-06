import { Router, Request, Response } from 'express'
import { supabase } from '../index'
import { LeaderboardResponse, LeaderboardEntry, AttendeeScore } from '../types'
import { calculateAttendeeScore, compareTiebreaker, generateLeaderboard } from '../services/scoring'

const router = Router()

// GET /api/leaderboard?eventSlug=...
router.get('/', async (req: Request, res: Response) => {
  try {
    const { eventSlug, limit = 10 } = req.query

    if (!eventSlug) {
      return res.status(400).json({ error: 'eventSlug is required' })
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

    // Calculate scores for each attendee
    const scores: AttendeeScore[] = attendees.map(att => {
      const userLogs = (logs || []).filter(log => log.from_attendee_id === att.id)

      const uniquePartners = new Set(userLogs.map(log => log.to_attendee_id || log.to_ref_code)).size
      const detailBonusCount = userLogs.filter(
        log => (log.note && log.note.length >= 20) || (log.topics && log.topics.length >= 2)
      ).length

      const score = calculateAttendeeScore(uniquePartners, detailBonusCount)
      const lastLogTime = userLogs.length > 0 ? userLogs[userLogs.length - 1].created_at : new Date().toISOString()

      return {
        attendeeId: att.id,
        refCode: att.ref_code,
        name: att.name,
        uniquePartners,
        validLogsCount: userLogs.length,
        detailBonusCount,
        score,
        lastLogTime,
      }
    })

    // Sort with tie-breaker
    scores.sort(compareTiebreaker)

    // Generate leaderboard
    const leaderboard = generateLeaderboard(scores).slice(0, Number(limit) || 10)

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
