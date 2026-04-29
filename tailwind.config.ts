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
            },
        },
    },
    plugins: [],
};
export default config;
// Triggering rebuild - v2 force CSS regeneration
