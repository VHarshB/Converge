import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials in .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Helper: Get user session token from localStorage
export function getSessionToken(): string | null {
  return localStorage.getItem('session_token')
}

// Helper: Store session token
export function setSessionToken(token: string): void {
  localStorage.setItem('session_token', token)
}

// Helper: Clear session
export function clearSession(): void {
  localStorage.removeItem('session_token')
  localStorage.removeItem('ref_code')
  localStorage.removeItem('attendee_id')
}

// Helper: Get ref code from localStorage
export function getRefCode(): string | null {
  return localStorage.getItem('ref_code')
}

// Helper: Store ref code
export function setRefCode(refCode: string): void {
  localStorage.setItem('ref_code', refCode)
}
