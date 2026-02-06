import { Router, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { supabase } from '../index'
import { LogConversationRequest, LogConversationResponse } from '../types'
import { detectSpamIndicators, shouldExcludeFromScoring } from '../services/antiCheat'
import { scoreConversation } from '../services/aiScoring'

const router = Router()

// POST /api/log
router.post('/', async (req: Request, res: Response) => {
  try {
    const { eventSlug, fromRefCode, toRefCode, topics, note, roundLabel }: LogConversationRequest = req.body

    // Validate input
    if (!eventSlug || !fromRefCode || !toRefCode) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    if (fromRefCode === toRefCode) {
      return res.status(400).json({ error: 'Cannot log conversation with yourself' })
    }

    // Get event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, status')
      .eq('slug', eventSlug)
      .single()

    if (eventError || !event) {
      return res.status(404).json({ error: 'Event not found' })
    }

    if (event.status !== 'live') {
      return res.status(400).json({ error: 'Event is not live' })
    }

    // Get from attendee
    const { data: fromAttendee, error: fromError } = await supabase
      .from('attendees')
      .select('id')
      .eq('event_id', event.id)
      .eq('ref_code', fromRefCode)
      .single()

    if (fromError || !fromAttendee) {
      return res.status(404).json({ error: 'Attendee not found' })
    }

    // Resolve to attendee (optional)
    const { data: toAttendee } = await supabase
      .from('attendees')
      .select('id')
      .eq('event_id', event.id)
      .eq('ref_code', toRefCode)
      .single()

    // Check for spam
    const { data: recentLogs } = await supabase
      .from('conversation_logs')
      .select('*')
      .eq('event_id', event.id)
      .eq('from_attendee_id', fromAttendee.id)
      .gt('created_at', new Date(Date.now() - 5 * 60000).toISOString())

    const spamIndicators = detectSpamIndicators(
      fromAttendee.id,
      toRefCode,
      note,
      recentLogs || [],
      { enableSpamDetection: true }
    )

    const isSpam = shouldExcludeFromScoring(spamIndicators)

    // Score conversation with AI
    const aiScores = await scoreConversation(topics, note)

    // Create log
    const logId = uuidv4()
    const { error: insertError } = await supabase
      .from('conversation_logs')
      .insert({
        id: logId,
        event_id: event.id,
        from_attendee_id: fromAttendee.id,
        to_ref_code: toRefCode,
        to_attendee_id: toAttendee?.id || null,
        topics: Array.isArray(topics) ? topics : [],
        note: note || null,
        round_label: roundLabel || null,
        ai_score_overall: aiScores.overall,
        ai_score_relevance: aiScores.relevance,
        ai_score_weird: aiScores.weird,
        ai_score_offtrack: aiScores.offtrack,
        ai_analysis: aiScores.analysis,
        created_at: new Date().toISOString(),
        is_deleted: false,
      })

    if (insertError) {
      console.error('Log error:', insertError)
      return res.status(500).json({ error: 'Failed to log conversation' })
    }

    const response: LogConversationResponse = {
      success: true,
      logId,
      computedScore: isSpam ? 0 : (topics.length > 0 ? 3 : 2),
    }

    return res.status(201).json(response)
  } catch (error) {
    console.error('Log error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
