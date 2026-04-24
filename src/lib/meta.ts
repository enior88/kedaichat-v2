// Meta Graph API Bridge for KedaiChat.online
const PAGE_ID = process.env.META_PAGE_ID;
const PAGE_TOKEN = process.env.META_PAGE_ACCESS_TOKEN;

/**
 * Posts a marketing update to the official KedaiChat Facebook Page.
 * @param message The caption/text of the post.
 * @param imageUrl (Optional) URL of the image to attach.
 */
export async function postToFacebookPage(message: string, imageUrl?: string) {
    if (!PAGE_ID || !PAGE_TOKEN) {
        console.error("Meta credentials missing in environment!");
        return { success: false, error: "Missing config" };
    }

    try {
        const url = `https://graph.facebook.com/v20.0/${PAGE_ID}/feed`;
        const params = new URLSearchParams({
            message: message,
            access_token: PAGE_TOKEN,
        });

        if (imageUrl) {
            params.append('link', imageUrl);
        }

        const response = await fetch(url + '?' + params.toString(), {
            method: 'POST',
        });

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message);
        }

        console.log(`✅ Successfully posted to Facebook: ${data.id}`);
        return { success: true, id: data.id };
    } catch (error: any) {
        console.error("❌ Failed to post to Facebook:", error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Posts a marketing image and caption to the official KedaiChat Instagram Feed.
 * Note: Instagram requires an Image URL.
 */
export async function postToInstagramFeed(caption: string, imageUrl: string) {
    if (!PAGE_ID || !PAGE_TOKEN) {
        return { success: false, error: "Missing config" };
    }

    try {
        // Step 1: Get Instagram Business Account ID
        const igAccountUrl = `https://graph.facebook.com/v20.0/${PAGE_ID}?fields=instagram_business_account&access_token=${PAGE_TOKEN}`;
        const igAccountRes = await fetch(igAccountUrl);
        const igAccountData = await igAccountRes.json();
        const igId = igAccountData.instagram_business_account?.id;

        if (!igId) {
            throw new Error("No Instagram Business account linked to this Facebook Page.");
        }

        // Step 2: Create Media Container
        const containerUrl = `https://graph.facebook.com/v20.0/${igId}/media`;
        const containerParams = new URLSearchParams({
            image_url: imageUrl,
            caption: caption,
            access_token: PAGE_TOKEN,
        });

        const containerRes = await fetch(containerUrl + '?' + containerParams.toString(), { method: 'POST' });
        const containerData = await containerRes.json();
        if (containerData.error) throw new Error(containerData.error.message);
        const creationId = containerData.id;

        // Step 3: Publish Media
        const publishUrl = `https://graph.facebook.com/v20.0/${igId}/media_publish`;
        const publishParams = new URLSearchParams({
            creation_id: creationId,
            access_token: PAGE_TOKEN,
        });

        const publishRes = await fetch(publishUrl + '?' + publishParams.toString(), { method: 'POST' });
        const publishData = await publishRes.json();
        if (publishData.error) throw new Error(publishData.error.message);

        console.log(`✅ Successfully posted to Instagram: ${publishData.id}`);
        return { success: true, id: publishData.id };
    } catch (error: any) {
        console.error("❌ Failed to post to Instagram:", error.message);
        return { success: false, error: error.message };
    }
}
