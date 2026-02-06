import { useSession } from '../hooks/useSession'
import { useNavigate, useParams } from 'react-router-dom'

export default function Header() {
  const { refCode } = useSession()
  const navigate = useNavigate()
  const { eventSlug } = useParams()

  if (!refCode) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: '#6366f1',
      color: 'white',
      padding: '0.75rem 1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      zIndex: 1000
    }}>
      <div style={{ fontSize: '0.875rem' }}>
        <span style={{ opacity: 0.8 }}>Your Code:</span>
        <strong style={{ 
          marginLeft: '0.5rem', 
          fontFamily: 'monospace',
          fontSize: '1rem',
          cursor: 'pointer'
        }} onClick={() => navigate(`/e/${eventSlug || 'sample-event'}/me`)}>
          {refCode}
        </strong>
      </div>
      <button 
        onClick={() => navigate(`/e/${eventSlug || 'sample-event'}/me`)}
        style={{
          background: 'rgba(255,255,255,0.2)',
          border: 'none',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          fontSize: '0.875rem'
        }}
      >
        My Pass
      </button>
    </div>
  )
}
