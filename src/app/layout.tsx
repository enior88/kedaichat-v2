import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";
import LayoutWrapper from "@/components/LayoutWrapper";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
    themeColor: "#25D366",
    width: "device-width",
    initialScale: 1,
};

export const metadata: Metadata = {
    title: "KedaiChat - WhatsApp Business Shop & Order Management Malaysia",
    description: "KedaiChat membantu peniaga Malaysia urus order WhatsApp dengan mudah. Launch your WhatsApp Shop in minutes — manage orders, resellers, and group orders. Cara urus order WhatsApp terbaik untuk PKS Malaysia.",
    manifest: "/manifest.webmanifest",
    keywords: [
        "WhatsApp Business Malaysia",
        "WhatsApp Shop Malaysia",
        "cara urus order WhatsApp",
        "sistem order WhatsApp Malaysia",
        "buat kedai online WhatsApp",
        "WhatsApp order management Malaysia",
        "kedai online WhatsApp percuma",
        "WhatsApp Catalog",
        "Social Commerce Malaysia",
        "Order Management",
        "Reseller System Malaysia",
        "PKS Malaysia",
        "SME Malaysia online shop",
    ],
    alternates: {
        canonical: "https://kedaichat.online",
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "KedaiChat",
    },
    formatDetection: {
        telephone: false,
    },
    icons: {
        icon: [
            { url: "/favicon.ico" },
            { url: "/logo.png", sizes: "192x192", type: "image/png" },
            { url: "/logo.png", sizes: "512x512", type: "image/png" },
        ],
        apple: [
            { url: "/logo.png", sizes: "180x180", type: "image/png" },
        ],
    },
    openGraph: {
        title: "KedaiChat — Urus Order WhatsApp Dengan Mudah",
        description: "2,000+ peniaga Malaysia guna KedaiChat untuk urus order, ejen, dan group order WhatsApp. Cuba percuma hari ini!",
        url: "https://kedaichat.online",
        siteName: "KedaiChat",
        images: [
            {
                url: "/logo.png",
                width: 800,
                height: 600,
                alt: "KedaiChat — WhatsApp Order Management Malaysia",
            },
        ],
        locale: "ms_MY",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ms">
            <body className={inter.className}>
                <LanguageProvider>
                    <LayoutWrapper>
                        {children}
                    </LayoutWrapper>
                </LanguageProvider>
            </body>
        </html>
    );
}
