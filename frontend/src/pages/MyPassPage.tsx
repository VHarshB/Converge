import { useNavigate } from 'react-router-dom'
import { useSession } from '../hooks/useSession'
import { clearSession } from '../services/supabase'

export default function MyPassPage() {
  const { refCode } = useSession()
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
    navigate('/')
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
      <button 
        style={{ width: '100%', marginTop: '2rem', backgroundColor: '#6366f1', color: 'white' }}
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  )
}
