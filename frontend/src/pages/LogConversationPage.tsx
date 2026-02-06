import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { apiClient } from '../services/api'
import { useSession } from '../hooks/useSession'

const TOPICS = ['MVP', 'Funding', 'Technology', 'Marketing', 'Team', 'Customer Acquisition', 'Product', 'Other']

export default function LogConversationPage() {
  const { eventSlug } = useParams()
  const navigate = useNavigate()
  const { refCode } = useSession()
  const [toRefCode, setToRefCode] = useState('')
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!refCode) {
    return (
      <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        <p>Not checked in. <a href="/" style={{ color: '#6366f1' }}>Return to event</a></p>
      </div>
    )
  }

  const handleTopicChange = (topic: string) => {
    setSelectedTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!toRefCode.trim()) {
      setError('Partner reference code is required')
      return
    }

    if (toRefCode.toUpperCase() === refCode.toUpperCase()) {
      setError('You cannot log a conversation with yourself')
      return
    }

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      await apiClient.logConversation({
        eventSlug: eventSlug || '',
        fromRefCode: refCode,
        toRefCode: toRefCode.toUpperCase(),
        topics: selectedTopics,
        note: note || undefined,
      })

      setSuccess(true)
      setToRefCode('')
      setSelectedTopics([])
      setNote('')
      
      setTimeout(() => {
        navigate(`/e/${eventSlug}/leaderboard`)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log conversation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Log Conversation</h2>
      
      {success && (
        <div style={{ 
          backgroundColor: '#d1fae5', 
          color: '#065f46', 
          padding: '1rem', 
          borderRadius: '0.375rem',
          marginBottom: '1rem'
        }}>
          ✓ Conversation logged! Redirecting to leaderboard...
        </div>
      )}
      
      {error && (
        <div style={{ 
          color: '#ef4444', 
          marginBottom: '1rem', 
          padding: '0.5rem', 
          backgroundColor: '#fee2e2', 
          borderRadius: '0.375rem' 
        }}>
          {error}
        </div>
      )}

      <form style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={handleSubmit}>
        <div>
          <label>Your Reference Code</label>
          <input 
            type="text" 
            value={refCode} 
            disabled
            style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
          />
        </div>

        <div>
          <label>Partner Reference Code *</label>
          <input 
            type="text" 
            placeholder="e.g., CVG-7K2P" 
            required
            value={toRefCode}
            onChange={(e) => setToRefCode(e.target.value.toUpperCase())}
          />
        </div>

        <div>
          <label>Topics (Select at least one *)</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {TOPICS.map(topic => (
              <label key={topic} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input 
                  type="checkbox" 
                  checked={selectedTopics.includes(topic)}
                  onChange={() => handleTopicChange(topic)}
                />
                <span>{topic}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label>Notes (Optional, max 180 characters)</label>
          <textarea 
            placeholder="What did you discuss?" 
            maxLength={180}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{ minHeight: '100px' }}
          />
          <small style={{ color: '#6b7280' }}>{note.length}/180</small>
        </div>

        <button 
          type="submit" 
          style={{ backgroundColor: '#6366f1', color: 'white' }}
          disabled={loading || selectedTopics.length === 0}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}
