import { useState, useEffect } from 'react';
import { getRefCode, getSessionToken, getAttendeeInfo } from '../services/supabase';
export function useSession() {
    const [refCode, setRefCode] = useState(null);
    const [sessionToken, setSessionTokenState] = useState(null);
    const [attendeeInfo, setAttendeeInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const code = getRefCode();
        const token = getSessionToken();
        const info = getAttendeeInfo();
        setRefCode(code);
        setSessionTokenState(token);
        setAttendeeInfo(info);
        setIsLoading(false);
    }, []);
    return {
        refCode,
        sessionToken,
        attendeeInfo,
        isLoading,
        hasSession: !!refCode && !!sessionToken,
    };
}
