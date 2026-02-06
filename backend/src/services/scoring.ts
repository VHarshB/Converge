import { AttendeeScore } from '../types'

/**
 * Calculate score for a single attendee
 * Score = (unique_partners × 2) + (detail_bonus × 1)
 */
export function calculateAttendeeScore(
  uniquePartners: number,
  detailBonusCount: number
): number {
  return (uniquePartners * 2) + (detailBonusCount * 1)
}

/**
 * Determine tie-breaker order for leaderboard
 */
export function compareTiebreaker(
  a: AttendeeScore,
  b: AttendeeScore
): number {
  // Primary: higher unique_partners
  if (a.uniquePartners !== b.uniquePartners) {
    return b.uniquePartners - a.uniquePartners
  }
  
  // Secondary: higher detail_bonus
  if (a.detailBonusCount !== b.detailBonusCount) {
    return b.detailBonusCount - a.detailBonusCount
  }
  
  // Tertiary: earlier completion time
  return new Date(a.lastLogTime).getTime() - new Date(b.lastLogTime).getTime()
}

/**
 * Generate leaderboard from attendee scores
 */
export function generateLeaderboard(scores: AttendeeScore[]) {
  return scores
    .sort(compareTiebreaker)
    .map((score, index) => ({
      rank: index + 1,
      refCode: score.refCode,
      displayName: score.name.split(' ')[0] + ' ' + score.name.split(' ')[score.name.split(' ').length - 1][0] + '.',
      score: score.score,
      uniquePartners: score.uniquePartners,
      detailBonus: score.detailBonusCount,
      logCount: score.validLogsCount
    }))
}
