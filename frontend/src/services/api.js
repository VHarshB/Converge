import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
export const apiClient = {
    // Checkin
    async checkin(data) {
        const response = await api.post('/api/checkin', data);
        return response.data;
    },
    // Log conversation
    async logConversation(data) {
        const response = await api.post('/api/log', data);
        return response.data;
    },
    // Get leaderboard
    async getLeaderboard(eventSlug) {
        const response = await api.get('/api/leaderboard', {
            params: { eventSlug }
        });
        return response.data;
    },
    // Get event details
    async getEvent(eventSlug) {
        const response = await api.get(`/api/events/${eventSlug}`);
        return response.data;
    },
    // Get attendee by ref code
    async getAttendee(eventSlug, refCode) {
        const response = await api.get(`/api/attendees/${eventSlug}/${refCode}`);
        return response.data;
    },
};
export default api;
