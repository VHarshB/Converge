import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { useLeaderboard } from '../hooks/useLeaderboard'
import { ConversationDetail } from '../../../shared/types'

export default function LeaderboardPage() {
  const { eventSlug } = useParams()
  const [selectedCategory, setSelectedCategory] = useState<'overall' | 'relevance' | 'weird' | 'offtrack' | 'quality'>('overall')
  const { leaderboard, isLocked, loading, error } = useLeaderboard(eventSlug, selectedCategory)
  const [expandedRank, setExpandedRank] = useState<number | null>(null)

  const toggleExpand = (rank: number) => {
    setExpandedRank(expandedRank === rank ? null : rank)
  }

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
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Leaderboard</h2>
        {isLocked && <span style={{ backgroundColor: '#fed7aa', padding: '0.5rem 1rem', borderRadius: '0.375rem' }}>🔒 Locked</span>}
      </div>

      {/* Category Selector */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {(['overall', 'relevance', 'weird', 'offtrack', 'quality'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => { setSelectedCategory(cat); setExpandedRank(null) }}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
              fontWeight: selectedCategory === cat ? '600' : '400',
              backgroundColor: selectedCategory === cat ? '#6366f1' : '#e5e7eb',
              color: selectedCategory === cat ? 'white' : '#374151',
              textTransform: 'capitalize'
            }}
          >
            {cat}
          </button>
        ))}
      </div>
      {leaderboard.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#6b7280' }}>No one on the leaderboard yet</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {leaderboard.map(entry => (
            <div key={entry.rank} style={{ 
              border: '1px solid #e5e7eb', 
              borderRadius: '0.5rem',
              overflow: 'hidden',
              backgroundColor: 'white'
            }}>
              {/* Main Row */}
              <div 
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem',
                  cursor: entry.conversations && entry.conversations.length > 0 ? 'pointer' : 'default',
                  backgroundColor: expandedRank === entry.rank ? '#f9fafb' : 'white'
                }}
                onClick={() => entry.conversations && entry.conversations.length > 0 && toggleExpand(entry.rank)}
              >
                <div style={{ width: '60px', fontWeight: 'bold', fontSize: '1.25rem' }}>
                  {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600' }}>{entry.displayName}</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {entry.uniquePartners} partners • {entry.logCount} logs
                  </div>
                </div>
                <div style={{ 
                  fontWeight: 'bold', 
                  fontSize: '1.5rem',
                  color: '#6366f1',
                  marginRight: '0.5rem'
                }}>
                  {entry.score}
                </div>
                {entry.conversations && entry.conversations.length > 0 && (
                  <div style={{ fontSize: '1.25rem', color: '#9ca3af' }}>
                    {expandedRank === entry.rank ? '▼' : '▶'}
                  </div>
                )}
              </div>

              {/* Dropdown Content */}
              {expandedRank === entry.rank && entry.conversations && entry.conversations.length > 0 && (
                <div style={{ 
                  padding: '1rem',
                  backgroundColor: '#f9fafb',
                  borderTop: '1px solid #e5e7eb'
                }}>
                  <div style={{ 
                    fontWeight: '600', 
                    marginBottom: '0.75rem',
                    color: '#374151',
                    fontSize: '0.875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Conversations ({entry.conversations.length})
                  </div>
                  {entry.conversations.map((conv: ConversationDetail, idx: number) => (
                    <div 
                      key={idx}
                      style={{ 
                        backgroundColor: 'white',
                        padding: '0.75rem',
                        borderRadius: '0.375rem',
                        marginBottom: idx < entry.conversations!.length - 1 ? '0.75rem' : '0',
                        border: '1px solid #e5e7eb'
                      }}
                    >
                      <div style={{ marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: '600', color: '#374151' }}>Partner: </span>
                        <span style={{ 
                          fontFamily: 'monospace', 
                          backgroundColor: '#e0e7ff', 
                          padding: '0.125rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem'
                        }}>
                          {conv.partnerRefCode}
                        </span>
                        {conv.partnerName && (
                          <span style={{ marginLeft: '0.5rem', color: '#6b7280' }}>
                            ({conv.partnerName})
                          </span>
                        )}
                      </div>
                      {conv.topics && (conv.topics.length > 0 || typeof conv.topics === 'string') && (
                        <div style={{ marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: '600', color: '#374151' }}>Topics: </span>
                          {typeof conv.topics === 'string' ? (
                            <span 
                              style={{ 
                                backgroundColor: '#dbeafe',
                                padding: '0.125rem 0.5rem',
                                borderRadius: '0.25rem',
                                marginRight: '0.25rem',
                                fontSize: '0.875rem'
                              }}
                            >
                              {conv.topics}
                            </span>
                          ) : (
                            conv.topics.map((topic: string, topicIdx: number) => (
                              <span 
                                key={topicIdx}
                                style={{ 
                                  backgroundColor: '#dbeafe',
                                  padding: '0.125rem 0.5rem',
                                  borderRadius: '0.25rem',
                                  marginRight: '0.25rem',
                                  fontSize: '0.875rem'
                                }}
                              >
                                {topic}
                              </span>
                            ))
                          )}
                        </div>
                      )}
                      {conv.note && (
                        <div>
                          <span style={{ fontWeight: '600', color: '#374151' }}>Note: </span>
                          <span style={{ color: '#4b5563', fontStyle: 'italic' }}>"{conv.note}"</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
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
