import { config } from 'dotenv';
import fs from 'fs';
config({ path: '.env.local' });

async function autoFixToken() {
    const userToken = process.env.META_PAGE_ACCESS_TOKEN;
    const pageId = process.env.META_PAGE_ID;

    try {
        console.log("Attempting to get Page Access Token using User Token...");
        const url = `https://graph.facebook.com/v19.0/${pageId}?fields=access_token&access_token=${userToken}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.access_token) {
            console.log("SUCCESS! Got PAGE token.");
            fs.writeFileSync('page_token_extracted.json', JSON.stringify(data, null, 2));
        } else {
            console.log("FAILED to get Page Token. Response:", data);
        }

    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

autoFixToken();
