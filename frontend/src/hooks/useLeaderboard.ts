import { useEffect, useState } from 'react'
import { apiClient } from '../services/api'

export function useLeaderboard(eventSlug: string | undefined) {
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [isLocked, setIsLocked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!eventSlug) return

    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        const data = await apiClient.getLeaderboard(eventSlug)
        setLeaderboard(data.leaderboard || [])
        setIsLocked(data.isLocked || false)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard')
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()

    // Poll every 5 seconds
    const interval = setInterval(fetchLeaderboard, 5000)
    return () => clearInterval(interval)
  }, [eventSlug])

  return { leaderboard, isLocked, loading, error }
}
