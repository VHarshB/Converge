import { SpamIndicator, SuspiciousLog } from '../types'

export interface AntiCheatConfig {
  pairWindowMinutes: number
  enablePartnerVerification: boolean
  enableSpamDetection: boolean
  maxLogsPerWindow: number
}

const DEFAULT_CONFIG: AntiCheatConfig = {
  pairWindowMinutes: 30,
  enablePartnerVerification: true,
  enableSpamDetection: true,
  maxLogsPerWindow: 15
}

/**
 * Check if a log should be flagged as suspicious
 */
export function detectSpamIndicators(
  fromAttendeeId: string,
  toRefCode: string,
  note: string | undefined,
  recentLogs: any[],
  config: Partial<AntiCheatConfig> = {}
): SpamIndicator[] {
  const cfg = { ...DEFAULT_CONFIG, ...config }
  const indicators: SpamIndicator[] = []

  // Rule 1: High-velocity logging
  if (cfg.enableSpamDetection) {
    const recentCount = recentLogs.filter(
      log => new Date().getTime() - new Date(log.created_at).getTime() < 5 * 60 * 1000 // 5 min
    ).length

    if (recentCount > cfg.maxLogsPerWindow) {
      indicators.push({
        type: 'high_velocity',
        severity: 'high',
        description: `${recentCount} logs in last 5 minutes`
      })
    }
  }

  // Rule 2: Duplicate notes
  if (note && recentLogs.some(log => log.note === note)) {
    indicators.push({
      type: 'duplicate_note',
      severity: 'medium',
      description: 'Identical note to recent log'
    })
  }

  // Rule 3: Partner verification (handled at DB constraint level)
  if (cfg.enablePartnerVerification && !toRefCode) {
    indicators.push({
      type: 'invalid_partner',
      severity: 'high',
      description: 'Partner reference code not found'
    })
  }

  return indicators
}

/**
 * Check if log should be excluded from scoring
 */
export function shouldExcludeFromScoring(
  indicators: SpamIndicator[]
): boolean {
  return indicators.some(ind => ind.severity === 'high')
}
