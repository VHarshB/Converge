import { useEffect, useState } from 'react'
import { apiClient } from '../services/api'

export function useLeaderboard(eventSlug: string | undefined, category: string = 'overall') {
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [isLocked, setIsLocked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!eventSlug) return

    const fetchLeaderboard = async (isInitial: boolean = false) => {
      try {
        if (isInitial) setLoading(true)
        const data = await apiClient.getLeaderboard(eventSlug, category)
        setLeaderboard(data.leaderboard || [])
        setIsLocked(data.isLocked || false)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard')
      } finally {
        if (isInitial) setLoading(false)
      }
    }

    // Initial fetch
    fetchLeaderboard(true)

    // Poll every 10 seconds (less frequent to reduce blinking)
    const interval = setInterval(() => fetchLeaderboard(false), 10000)
    return () => clearInterval(interval)
  }, [eventSlug, category])

  return { leaderboard, isLocked, loading, error }
}
