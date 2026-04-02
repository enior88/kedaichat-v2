import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const jwtSecretValue = process.env.JWT_SECRET;

if (!jwtSecretValue && process.env.NODE_ENV === 'production') {
    throw new Error('FATAL: JWT_SECRET environment variable is not set. The application cannot start securely.');
}

const SECRET = new TextEncoder().encode(jwtSecretValue || 'kedaichat-local-dev-secret');

export async function createSession(userId: string) {
    const token = await new SignJWT({ userId })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(SECRET);

    cookies().set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    });
}

export async function getSession() {
    const token = cookies().get('session')?.value;
    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, SECRET);
        return payload as { userId: string };
    } catch (err) {
        return null;
    }
}

export async function logout() {
    cookies().set('session', '', { maxAge: 0 });
}
