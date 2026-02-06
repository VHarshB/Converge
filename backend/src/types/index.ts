// ============ EVENT TYPES ============
export interface Event {
  id: string;
  name: string;
  slug: string;
  location?: string;
  start_time: string;
  end_time: string;
  status: 'draft' | 'live' | 'ended';
  settings: EventSettings;
  created_at: string;
  updated_at: string;
}

export interface EventSettings {
  scoringRules?: {
    pairWindowMinutes?: number;
    perAttendeeCap?: number;
    uniquePartnerWeight?: number;
    detailBonusWeight?: number;
  };
  antiCheatRules?: {
    enablePartnerVerification?: boolean;
    enableSpamDetection?: boolean;
  };
}

// ============ ATTENDEE TYPES ============
export interface Attendee {
  id: string;
  event_id: string;
  ref_code: string;
  name: string;
  email?: string;
  role?: 'student' | 'speaker' | 'organizer' | 'guest';
  checked_in_at: string;
  is_active: boolean;
  created_at: string;
}

// ============ CONVERSATION LOG TYPES ============
export interface ConversationLog {
  id: string;
  event_id: string;
  from_attendee_id: string;
  to_ref_code: string;
  to_attendee_id?: string;
  topics: string[];
  note?: string;
  round_label?: string;
  created_at: string;
  is_deleted: boolean;
  deleted_reason?: string;
}

// ============ LEADERBOARD TYPES ============
export interface ConversationDetail {
  partnerRefCode: string;
  partnerName?: string;
  topics: string[];
  note?: string;
  timestamp: string;
}

export interface LeaderboardEntry {
  rank: number;
  refCode: string;
  displayName: string;
  score: number;
  uniquePartners: number;
  detailBonus: number;
  logCount: number;
  conversations?: ConversationDetail[]; // Only for top 3
}

export interface LeaderboardResponse {
  eventName: string;
  eventSlug: string;
  isLocked: boolean;
  leaderboard: LeaderboardEntry[];
  timestamp: string;
}

// ============ SCORE CALCULATION TYPES ============
export interface AttendeeScore {
  attendeeId: string;
  refCode: string;
  name: string;
  uniquePartners: number;
  validLogsCount: number;
  detailBonusCount: number;
  score: number;
  lastLogTime: string;
  hasCategoryLogs?: boolean; // Track if attendee has logs in the selected category
}

// ============ API REQUEST/RESPONSE TYPES ============
export interface CheckinRequest {
  eventSlug: string;
  name: string;
  email?: string;
  role?: 'student' | 'guest' | 'speaker' | 'organizer';
}

export interface CheckinResponse {
  refCode: string;
  attendeeId: string;
  sessionToken: string;
  name: string;
  qrCode?: string;
}

export interface LogConversationRequest {
  eventSlug: string;
  fromRefCode: string;
  toRefCode: string;
  topics: string[];
  note?: string;
  roundLabel?: string;
}

export interface LogConversationResponse {
  success: boolean;
  logId: string;
  computedScore?: number;
}

// ============ ADMIN TYPES ============
export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
}

export interface AuditAction {
  id: string;
  admin_user_id: string;
  event_id: string;
  action: string;
  payload?: Record<string, any>;
  created_at: string;
}

// ============ ANTI-CHEAT TYPES ============
export interface SpamIndicator {
  type: 'high_velocity' | 'duplicate_note' | 'invalid_partner' | 'outside_window' | 'unknown';
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface SuspiciousLog {
  logId: string;
  fromAttendeeId: string;
  indicators: SpamIndicator[];
  flaggedAt: string;
}

// ============ EXPORT TYPES ============
export interface ExportRequest {
  eventId: string;
  exportType: 'participants' | 'logs' | 'winners' | 'all';
}

export interface ParticipantExport {
  refCode: string;
  name: string;
  email?: string;
  role?: string;
  checkedInAt: string;
  score: number;
  uniquePartners: number;
  logCount: number;
}

export interface LogExport {
  fromRefCode: string;
  toRefCode: string;
  topics: string[];
  note?: string;
  createdAt: string;
  isDeleted: boolean;
  deletedReason?: string;
}
