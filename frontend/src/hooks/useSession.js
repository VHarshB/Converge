import { useState, useEffect } from 'react';
import { getRefCode, getSessionToken } from '../services/supabase';
export function useSession() {
    const [refCode, setRefCode] = useState(null);
    const [sessionToken, setSessionTokenState] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const code = getRefCode();
        const token = getSessionToken();
        setRefCode(code);
        setSessionTokenState(token);
        setIsLoading(false);
    }, []);
    return {
        refCode,
        sessionToken,
        isLoading,
        hasSession: !!refCode && !!sessionToken,
    };
}
