// Script to exchange short-lived user token for long-lived page token using native fetch
const appId = '4462191147385811';
const appSecret = '303ee8597ecba71be8ad6c794bfae86f';
const shortLivedToken = 'EAAZCaVtZACg9MBRUwxtI4wXCHDZCZAlrTbwG8jjBTIZBjm62KAk2TeQk0U6aUIzqDZCM1ZB476jIZBsuVB2z2wVBAL4DZCGYByCH7iQK5VPFsXZBcqtyGz2pCiAKqU23HMNXtZBaZAlg9lYHPJdyzqNMOC3znlAFnPQC5PXEBG1psKhnk8rDH35kJ8cWhqIVFKysQHoz5SGEHEyKJB4QRzbshl55xUVYJefty2Tu9MiI0iKvQaGDVNVDq5AtmUO0uTDSWXG874EOPA8tW9okK929v5wBEqx3';

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

        console.log("Step 2: Fetching long-lived PAGE access token for 'kedaichat'...");
        const accountsUrl = `https://graph.facebook.com/v20.0/me/accounts?access_token=${longLivedUserToken}`;
        const accountsResponse = await fetch(accountsUrl);
        const accountsData = await accountsResponse.json();

        if (accountsData.error) {
            console.error("❌ Error in Step 2:", accountsData.error);
            return;
        }

        const pages = accountsData.data;
        console.log("Found pages:", JSON.stringify(pages, null, 2));

        const targetPage = pages.find(p => p.name.toLowerCase().includes('kedaichat'));

        if (!targetPage) {
            console.error("❌ Error: Could not find a page named 'kedaichat' for this user.");
            console.log("Available pages:", pages.map(p => p.name).join(", "));
            return;
        }

        console.log(`✅ Found Page: ${targetPage.name} (ID: ${targetPage.id})`);
        console.log(`🚀 PERMANENT PAGE TOKEN: ${targetPage.access_token}`);
        console.log(`📝 PAGE ID: ${targetPage.id}`);

    } catch (error) {
        console.error("❌ Unexpected Error:", error.message);
    }
}

exchangeToken();
