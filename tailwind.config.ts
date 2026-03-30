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
                    light: "#25D366",
                    dark: "#075E54",
                    teal: "#128C7E",
                },
                "soft-grey": "#F0F2F5",
            },
        },
    },
    plugins: [],
};
export default config;
// Triggering rebuild
