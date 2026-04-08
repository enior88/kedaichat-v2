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
    maximumScale: 1,
};

export const metadata: Metadata = {
    title: "KedaiChat - WhatsApp Business Shop & Order Management",
    description: "Launch your WhatsApp Shop in minutes. The easiest way to manage orders, resellers, and group orders for your WhatsApp Business. WhatsApp Biz solution for SMEs.",
    manifest: "/manifest.json?v=2",
    keywords: ["WhatsApp Business", "WhatsApp Shop", "Whatapp Biz", "WhatsApp Catalog", "Social Commerce", "Order Management", "Reseller System"],
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
        title: "KedaiChat - WhatsApp-first Business OS",
        description: "Manage orders, resellers, and group orders via WhatsApp.",
        url: "https://kedaichat.online",
        siteName: "KedaiChat",
        images: [
            {
                url: "/logo.png",
                width: 800,
                height: 600,
            },
        ],
        locale: "en_US",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
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
