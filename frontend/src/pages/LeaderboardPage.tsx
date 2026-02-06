import { useParams, Link } from 'react-router-dom'
import { useLeaderboard } from '../hooks/useLeaderboard'

export default function LeaderboardPage() {
  const { eventSlug } = useParams()
  const { leaderboard, isLocked, loading, error } = useLeaderboard(eventSlug)

  if (loading) {
    return (
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <p>Loading leaderboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ color: '#ef4444' }}>Error: {error}</p>
        <Link to={`/e/${eventSlug}`} style={{ color: '#6366f1' }}>Back to event</Link>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Leaderboard</h2>
        {isLocked && <span style={{ backgroundColor: '#fed7aa', padding: '0.5rem 1rem', borderRadius: '0.375rem' }}>🔒 Locked</span>}
      </div>
      
      {leaderboard.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#6b7280' }}>No one on the leaderboard yet</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Rank</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '0.75rem', textAlign: 'right' }}>Partners</th>
              <th style={{ padding: '0.75rem', textAlign: 'right' }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map(entry => (
              <tr key={entry.rank} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}</td>
                <td style={{ padding: '0.75rem' }}>{entry.displayName}</td>
                <td style={{ padding: '0.75rem', textAlign: 'right' }}>{entry.uniquePartners}</td>
                <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 'bold', color: '#6366f1' }}>{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Link to={`/e/${eventSlug}`} style={{ 
        display: 'inline-block',
        marginTop: '2rem',
        color: '#6366f1',
        textDecoration: 'none'
      }}>
        ← Back to event
      </Link>
    </div>
  )
}
