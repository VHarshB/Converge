import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { apiClient } from '../services/api'
import { setRefCode, setSessionToken, setEventSlug } from '../services/supabase'

export default function CheckinPage() {
  const { eventSlug } = useParams()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      setError('Name is required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await apiClient.checkin({
        eventSlug: eventSlug || '',
        name,
        email: email || undefined,
        role: (role as any) || undefined,
      })

      // Store session
      setRefCode(response.refCode)
      setSessionToken(response.sessionToken)
      setEventSlug(eventSlug || 'sample-event')

      // Navigate to pass page
      navigate(`/e/${eventSlug}/me`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Check-in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Check In</h2>
      {error && <div style={{ color: '#ef4444', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fee2e2', borderRadius: '0.375rem' }}>{error}</div>}
      <form style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={handleSubmit}>
        <div>
          <label>Name *</label>
          <input 
            type="text" 
            placeholder="Your full name" 
            required 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Email (Optional)</label>
          <input 
            type="email" 
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Role (Optional)</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">Select...</option>
            <option value="student">Student</option>
            <option value="speaker">Speaker</option>
            <option value="organizer">Organizer</option>
            <option value="guest">Guest</option>
          </select>
        </div>
        <button 
          type="submit" 
          style={{ backgroundColor: '#6366f1', color: 'white' }}
          disabled={loading}
        >
          {loading ? 'Checking in...' : 'Check In'}
        </button>
      </form>
    </div>
  )
}
