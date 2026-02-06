import axios from 'axios'
import type { CheckinRequest, CheckinResponse, LogConversationRequest, LogConversationResponse, LeaderboardResponse } from '../../../shared/types'

const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const apiClient = {
  // Checkin
  async checkin(data: CheckinRequest): Promise<CheckinResponse> {
    const response = await api.post('/api/checkin', data)
    return response.data
  },

  // Log conversation
  async logConversation(data: LogConversationRequest): Promise<LogConversationResponse> {
    const response = await api.post('/api/log', data)
    return response.data
  },

  // Get leaderboard
  async getLeaderboard(eventSlug: string): Promise<LeaderboardResponse> {
    const response = await api.get('/api/leaderboard', {
      params: { eventSlug }
    })
    return response.data
  },

  // Get event details
  async getEvent(eventSlug: string) {
    const response = await api.get(`/api/events/${eventSlug}`)
    return response.data
  },

  // Get attendee by ref code
  async getAttendee(eventSlug: string, refCode: string) {
    const response = await api.get(`/api/attendees/${eventSlug}/${refCode}`)
    return response.data
  },
}

export default api
