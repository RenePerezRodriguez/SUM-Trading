'use client';

import { useEffect } from 'react';
import clarity from '@microsoft/clarity';
import { useUser } from '@/firebase';

export function Clarity() {
    const { user } = useUser();
    const projectId = "txhzx5cayw";

    useEffect(() => {
        if (!projectId) {
            console.error("Microsoft Clarity Project ID is not set.");
            return;
        }

        clarity.init(projectId);

        // Optional: Give consent if your site requires it.
        // By default, Clarity assumes consent unless configured otherwise in the project settings.
        clarity.consent();

        if (user) {
            clarity.identify(user.uid, undefined, undefined, user.displayName || 'Anonymous');
            clarity.setTag('email', user.email || 'No-email');
        }

    }, [user]);

    return null;
}
