import { getSdks } from '@/firebase/admin-init';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Create session endpoint
export async function POST(request: NextRequest) {
    const { idToken } = await request.json();

    if (!idToken) {
        return NextResponse.json({ success: false, error: "ID token is required." }, { status: 400 });
    }

    const { auth } = getSdks();
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds

    try {
        const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
        
        const options = {
            name: 'session',
            value: sessionCookie,
            maxAge: expiresIn,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/', // Set path to root
        };

        // Set cookie in the browser
        (await cookies()).set(options);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error creating session cookie:", error);
        return NextResponse.json({ success: false, error: "Failed to create session cookie." }, { status: 401 });
    }
}


// Delete session endpoint
export async function DELETE() {
    const { auth } = getSdks();
    const sessionCookie = (await cookies()).get('session')?.value;

    if (!sessionCookie) {
        return NextResponse.json({ success: true });
    }

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie);
        await auth.revokeRefreshTokens(decodedClaims.sub);
        
        // Clear the cookie
        (await cookies()).set('session', '', { maxAge: 0, path: '/' });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error revoking session cookie:", error);
        return NextResponse.json({ success: false, error: 'Failed to revoke session.' }, { status: 500 });
    }
}
