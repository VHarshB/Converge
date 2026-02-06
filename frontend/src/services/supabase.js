import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials in .env.local');
}
export const supabase = createClient(supabaseUrl, supabaseKey);
// Helper: Get user session token from localStorage
export function getSessionToken() {
    return localStorage.getItem('session_token');
}
// Helper: Store session token
export function setSessionToken(token) {
    localStorage.setItem('session_token', token);
}
// Helper: Clear session
export function clearSession() {
    localStorage.removeItem('session_token');
    localStorage.removeItem('ref_code');
    localStorage.removeItem('attendee_id');
    localStorage.removeItem('attendee_info');
}
// Helper: Get ref code from localStorage
export function getRefCode() {
    return localStorage.getItem('ref_code');
}
// Helper: Store ref code
export function setRefCode(refCode) {
    localStorage.setItem('ref_code', refCode);
}

// Helper: Store attendee info
export function setAttendeeInfo(info) {
    localStorage.setItem('attendee_info', JSON.stringify(info));
}

// Helper: Get attendee info
export function getAttendeeInfo() {
    const info = localStorage.getItem('attendee_info');
    return info ? JSON.parse(info) : null;
}
