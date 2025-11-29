'use client'

import { useAnalytics } from "@/firebase";
import { logEvent } from "firebase/analytics";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function Analytics() {
    const analytics = useAnalytics();
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        if (analytics) {
            const url = pathname + searchParams.toString()
            logEvent(analytics, 'page_view', {
                page_path: url,
            });
        }
    }, [pathname, searchParams, analytics]);

    return null
}
