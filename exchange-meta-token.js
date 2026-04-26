const appId = process.env.META_APP_ID || '';
const appSecret = process.env.META_APP_SECRET || '';
const shortLivedToken = ''; // PASTE SHORT-LIVED USER TOKEN HERE

async function exchangeToken() {
    try {
        console.log("Step 1: Exchanging short-lived token for long-lived USER token...");
        const url = `https://graph.facebook.com/v20.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortLivedToken}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("❌ Error in Step 1:", data.error);
            return;
        }

        const longLivedUserToken = data.access_token;
        console.log("✅ Long-lived USER token received.");

        const meUrl = `https://graph.facebook.com/v20.0/me?access_token=${longLivedUserToken}`;
        const meRes = await fetch(meUrl);
        const meData = await meRes.json();
        console.log("Token User:", JSON.stringify(meData, null, 2));

        const permissionsUrl = `https://graph.facebook.com/v20.0/me/permissions?access_token=${longLivedUserToken}`;
        const permissionsRes = await fetch(permissionsUrl);
        const permissionsData = await permissionsRes.json();
        console.log("Token Permissions:", JSON.stringify(permissionsData.data, null, 2));

        const accountsUrl = `https://graph.facebook.com/v20.0/me/accounts?access_token=${longLivedUserToken}`;
        const accountsResponse = await fetch(accountsUrl);
        const accountsData = await accountsResponse.json();
        console.log("Full Accounts Response:", JSON.stringify(accountsData, null, 2));

        if (accountsData.error) {
            console.error("❌ Error in Step 2:", accountsData.error);
            return;
        }

        const pageIdFromEnv = '1120893591101206';
        console.log(`Step 3: Trying direct lookup for Page ID: ${pageIdFromEnv}...`);
        const directPageUrl = `https://graph.facebook.com/v20.0/${pageIdFromEnv}?fields=name,access_token&access_token=${longLivedUserToken}`;
        const directPageRes = await fetch(directPageUrl);
        const directPageData = await directPageRes.json();

        if (directPageData.name) {
            console.log(`✅ Direct Lookup Success: ${directPageData.name}`);
            console.log(`🚀 PERMANENT PAGE TOKEN: ${directPageData.access_token}`);
            console.log(`📝 PAGE ID: ${pageIdFromEnv}`);
            return;
        } else {
            console.error("❌ Direct Lookup Failed:", directPageData.error);
        }

        const pages = accountsData.data || [];

    } catch (error) {
        console.error("❌ Unexpected Error:", error.message);
    }
}

exchangeToken();
