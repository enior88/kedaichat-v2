import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is not set');
}
const SECRET = new TextEncoder().encode(jwtSecret);

export async function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const hostname = request.headers.get('host') || '';

    const path = url.pathname;
    const pwaAssets = ['manifest.webmanifest', 'manifest.json', 'icon-192.png', 'icon-512.png', 'icon-maskable.png', 'sw.js', 'workbox-'];
    const reservedPaths = ['group', 'admin', 'api', 'billing', 'dashboard', 'login', 'onboarding', 'orders', 'products', 'reseller', 'wallet', 'tools', 'shop', 'analytics', 'settings', 'checkout', 'privacy', 'terms', '_next', 'favicon.ico', 'logo.png', 'favicon.png', 'hero_illustration.png', 'robots.txt', 'sitemap.xml', 'kuih-gula-melaka.jpg', 'motorcycle-coffee.jpg', ...pwaAssets];
    const pathParts = path.split('/').filter(Boolean);

    // Reserved path check
    if (pathParts.length > 0) {
        const firstPart = pathParts[0];
        const isStaticAsset = /\.(jpg|jpeg|png|webp|svg|gif|ico|webmanifest|json|js)$/.test(firstPart);

        if (reservedPaths.includes(firstPart) || isStaticAsset) {
            // Protected Routes Check
            const protectedRoutes = ['/dashboard', '/products', '/settings', '/orders', '/analytics'];
            const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));

            if (isProtectedRoute) {
                const session = request.cookies.get('session')?.value;
                if (!session) {
                    return NextResponse.redirect(new URL('/login', request.url));
                }

                try {
                    await jwtVerify(session, SECRET);
                } catch (err) {
                    // Stale or invalid session - clear it and redirect
                    const response = NextResponse.redirect(new URL('/login', request.url));
                    response.cookies.delete('session');
                    return response;
                }
            }
            return NextResponse.next();
        }
    }

    // Subdomain routing (Tenant)
    const isIP = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}(?::\d+)?$/.test(hostname);
    const isVercelApp = hostname.endsWith('.vercel.app');

    // Improved subdomain detection:
    // 1. Must contain dots
    // 2. Must not be an IP or Vercel preview URL
    // 3. Must not be localhost or www
    // 4. For kedaichat.online, it must have at least 3 parts (e.g. store.kedaichat.online)
    const hostParts = hostname.split('.');
    const isMainDomain = hostname === 'kedaichat.online' || hostname === 'www.kedaichat.online';

    const isSubdomain = hostname.includes('.') &&
        !isIP &&
        !isVercelApp &&
        !hostname.startsWith('localhost') &&
        !hostname.startsWith('127.0.0.1') &&
        !hostname.startsWith('www') &&
        !isMainDomain &&
        hostParts.length >= 3;

    if (isSubdomain) {
        const subdomain = hostParts[0];
        if (subdomain !== 'app' && subdomain !== 'admin') {
            const rewriteUrl = new URL(`/shop/${subdomain}${path}`, request.url);
            return NextResponse.rewrite(rewriteUrl);
        }
    }

    // Path-based tenant routing (e.g. localhost:3000/some-store)
    if (pathParts.length > 0) {
        const firstPart = pathParts[0];
        if (!reservedPaths.includes(firstPart)) {
            const remainingPath = pathParts.slice(1).join('/');
            const rewriteUrl = new URL(`/shop/${firstPart}${remainingPath ? '/' + remainingPath : ''}`, request.url);
            return NextResponse.rewrite(rewriteUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.jpg|.*\\.jpeg|.*\\.png|.*\\.webp|.*\\.svg|.*\\.gif|.*\\.js|.*\\.webmanifest|.*\\.json).*)'],
};
