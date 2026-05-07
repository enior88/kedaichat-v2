import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                whatsapp: {
                    light: "var(--whatsapp-light)",
                    dark: "var(--whatsapp-dark)",
                    teal: "var(--whatsapp-teal)",
                },
                "soft-grey": "var(--soft-grey)",
                "navy-dark": "var(--navy-dark)",
                "slate-text": "var(--slate-text)",
            },
            boxShadow: {
                premium: "0 8px 30px rgba(0, 0, 0, 0.04)",
                "glass-pill": "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
            },
        },
    },
    plugins: [],
};
export default config;
// Triggering rebuild - v2 force CSS regeneration
