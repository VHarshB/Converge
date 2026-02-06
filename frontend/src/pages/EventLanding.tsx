import { useParams, Link } from 'react-router-dom'

export default function EventLanding() {
  const { eventSlug } = useParams()
  const defaultSlug = eventSlug || 'sample-event'

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome to Converge</h1>
        <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>Networking made easy</p>
      </div>

      <div style={{ 
        backgroundColor: '#f3f4f6',
        padding: '2rem',
        borderRadius: '0.75rem',
        marginBottom: '2rem'
      }}>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>This is your event check-in and networking platform</p>
        <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>Event: <strong>{defaultSlug}</strong></p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Link to={`/e/${defaultSlug}/checkin`} style={{ 
          padding: '1rem 2rem', 
          backgroundColor: '#6366f1', 
          color: 'white',
          textDecoration: 'none',
          borderRadius: '0.5rem',
          fontWeight: '500',
          transition: 'opacity 0.2s',
          border: 'none',
          cursor: 'pointer',
          display: 'inline-block'
        }}>
          Check In
        </Link>
        <Link to={`/e/${defaultSlug}/log`} style={{ 
          padding: '1rem 2rem', 
          backgroundColor: '#ec4899', 
          color: 'white',
          textDecoration: 'none',
          borderRadius: '0.5rem',
          fontWeight: '500',
          transition: 'opacity 0.2s',
          border: 'none',
          cursor: 'pointer',
          display: 'inline-block'
        }}>
          Log Conversation
        </Link>
        <Link to={`/e/${defaultSlug}/leaderboard`} style={{ 
          padding: '1rem 2rem', 
          backgroundColor: '#8b5cf6', 
          color: 'white',
          textDecoration: 'none',
          borderRadius: '0.5rem',
          fontWeight: '500',
          transition: 'opacity 0.2s',
          border: 'none',
          cursor: 'pointer',
          display: 'inline-block'
        }}>
          View Leaderboard
        </Link>
      </div>
    </div>
  )
}
