import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "KedaiChat - WhatsApp Business Shop & Order Management",
    description: "Launch your WhatsApp Shop in minutes. The easiest way to manage orders, resellers, and group orders for your WhatsApp Business. WhatsApp Biz solution for SMEs.",
    keywords: ["WhatsApp Business", "WhatsApp Shop", "Whatapp Biz", "WhatsApp Catalog", "Social Commerce", "Order Management", "Reseller System"],
    icons: {
        icon: [
            { url: "/favicon.ico" },
            { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
            { url: "/favicon.ico", sizes: "16x16", type: "image/x-icon" },
        ],
        apple: [
            { url: "/favicon.ico", sizes: "180x180", type: "image/x-icon" },
        ],
        shortcut: "/favicon.ico",
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
                    {children}
                </LanguageProvider>
            </body>
        </html>
    );
}
