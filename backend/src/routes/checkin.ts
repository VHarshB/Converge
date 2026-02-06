import { Router, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { supabase } from '../index'
import { CheckinRequest, CheckinResponse } from '../types'

const router = Router()

// Helper: Generate unique reference code
function generateRefCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = 'CVG-'
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// POST /api/checkin
router.post('/', async (req: Request, res: Response) => {
  try {
    const { eventSlug, name, email, role }: CheckinRequest = req.body

    // Validate input
    if (!eventSlug || !name) {
      return res.status(400).json({ error: 'Missing required fields: eventSlug, name' })
    }

    // Get event
    const { data: events, error: eventError } = await supabase
      .from('events')
      .select('id')
      .eq('slug', eventSlug)
      .single()

    if (eventError || !events) {
      return res.status(404).json({ error: 'Event not found' })
    }

    const eventId = events.id

    // Generate unique ref code
    let refCode = generateRefCode()
    let attempts = 0
    while (attempts < 10) {
      const { data: existing } = await supabase
        .from('attendees')
        .select('ref_code')
        .eq('event_id', eventId)
        .eq('ref_code', refCode)
        .single()

      if (!existing) break
      refCode = generateRefCode()
      attempts++
    }

    // Create attendee record
    const { data: attendee, error: insertError } = await supabase
      .from('attendees')
      .insert({
        id: uuidv4(),
        event_id: eventId,
        ref_code: refCode,
        name,
        email: email || null,
        role: role || null,
        checked_in_at: new Date().toISOString(),
        is_active: true,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Checkin error:', insertError)
      return res.status(500).json({ error: 'Failed to check in' })
    }

    // Generate session token
    const sessionToken = uuidv4()

    const response: CheckinResponse = {
      refCode: attendee.ref_code,
      attendeeId: attendee.id,
      sessionToken,
      name: attendee.name,
    }

    return res.status(201).json(response)
  } catch (error) {
    console.error('Checkin error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
