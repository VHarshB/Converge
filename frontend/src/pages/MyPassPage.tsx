import { useNavigate, useParams } from 'react-router-dom'
import { useSession } from '../hooks/useSession'
import { clearSession } from '../services/supabase'

export default function MyPassPage() {
  const { refCode } = useSession()
  const { eventSlug } = useParams()
  const navigate = useNavigate()

  if (!refCode) {
    return (
      <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        <p>Not checked in. <a href="/" style={{ color: '#6366f1' }}>Return to event</a></p>
      </div>
    )
  }

  const handleLogout = () => {
    clearSession()
    navigate(`/e/${eventSlug || 'sample-event'}`)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h2>My Pass</h2>
      <div style={{ 
        marginTop: '2rem', 
        padding: '2rem', 
        border: '2px solid #6366f1',
        borderRadius: '0.75rem',
        textAlign: 'center'
      }}>
        <p style={{ color: '#6b7280' }}>Your Reference Code:</p>
        <h3 style={{ fontSize: '2.5rem', fontFamily: 'monospace', marginTop: '1rem' }}>{refCode}</h3>
        <p style={{ marginTop: '1rem', color: '#6b7280' }}>Share this code with others to log conversations</p>
      </div>
      
      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
        <button 
          style={{ 
            width: '100%', 
            padding: '1rem',
            backgroundColor: '#ec4899', 
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
          onClick={() => navigate(`/e/${eventSlug || 'sample-event'}/log`)}
        >
          Log Conversation
        </button>
        
        <button 
          style={{ 
            width: '100%', 
            padding: '1rem',
            backgroundColor: '#8b5cf6', 
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
          onClick={() => navigate(`/e/${eventSlug || 'sample-event'}/leaderboard`)}
        >
          View Leaderboard
        </button>
        
        <button 
          style={{ 
            width: '100%', 
            padding: '0.75rem',
            backgroundColor: 'transparent',
            color: '#6b7280',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  )
}
