import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Replace with your App's verify token from the Meta Dashboard
const VERIFY_TOKEN = 'kedaichat_agent_secret_2026';

// Meta Page access token
const PAGE_ACCESS_TOKEN = process.env.META_PAGE_ACCESS_TOKEN || '';

/**
 * GET Handler: Verifies the webhook challenge sent by Meta configuring the App.
 */
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            return new NextResponse(challenge, { status: 200 });
        } else {
            return new NextResponse('Forbidden', { status: 403 });
        }
    }
    return new NextResponse('Bad Request', { status: 400 });
}

/**
 * POST Handler: Processes incoming events from Meta (messages, feeds/comments)
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();

        if (body.object !== 'page') {
            return new NextResponse('Not a page event', { status: 404 });
        }

        for (const entry of body.entry) {
            // Handle Messages (DMs)
            if (entry.messaging) {
                const webhookEvent = entry.messaging[0];
                const senderPsid = webhookEvent.sender.id;

                if (webhookEvent.message && webhookEvent.message.text) {
                    await handleIncomingMessage(senderPsid, webhookEvent.message.text);
                }
            }

            // Handle Feed Events (Comments)
            if (entry.changes) {
                for (const change of entry.changes) {
                    if (change.field === 'feed' && change.value.item === 'comment' && change.value.verb === 'add') {
                        // Prevent infinite loops if the Page itself replies
                        if (change.value.from.id !== process.env.META_PAGE_ID) {
                            const commentId = change.value.comment_id;
                            const message = change.value.message;
                            await handleIncomingComment(commentId, message);
                        }
                    }
                }
            }
        }

        // Return a '200 OK' response to all events to acknowledge receipt
        return new NextResponse('EVENT_RECEIVED', { status: 200 });
    } catch (error) {
        console.error('Webhook Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

/**
 * Analyzes intent using Gemini and sends DM reply via Meta Send API
 */
async function handleIncomingMessage(senderPsid: string, messageText: string) {
    console.log(`Processing DM from ${senderPsid}: ${messageText}`);

    // Analyze intent
    const replyText = await generateLeadCaptureReply(messageText);

    // Send the reply
    const url = \`https://graph.facebook.com/v20.0/me/messages?access_token=\${PAGE_ACCESS_TOKEN}\`;
    const responseBody = {
        recipient: { id: senderPsid },
        message: { text: replyText }
    };

    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(responseBody),
        });
        console.log(\`Successfully replied to DM Psid: \${senderPsid}\`);
    } catch (err) {
        console.error('Failed to send DM reply', err);
    }
}

/**
 * Analyzes intent using Gemini and replies to Facebook Comments via Graph API
 */
async function handleIncomingComment(commentId: string, messageText: string) {
    console.log(\`Processing Comment \${commentId}: \${messageText}\`);
    
    // Check if the comment shows buying/onboarding intent
    const replyText = await generateLeadCaptureReply(messageText);

    // If generative AI says 'IGNORE', we skip reply to save noise.
    if (replyText === 'IGNORE') return;

    const url = \`https://graph.facebook.com/v20.0/\${commentId}/comments?access_token=\${PAGE_ACCESS_TOKEN}\`;
    
    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: replyText }),
        });
        console.log(\`Successfully replied to comment \${commentId}\`);
    } catch (err) {
        console.error('Failed to post comment reply', err);
    }
}

/**
 * Gemini resolver for intelligent automated replies.
 */
async function generateLeadCaptureReply(customerMessage: string): Promise<string> {
    const prompt = \`
        You are the automated assistant for KedaiChat.online on Meta.
        User message: "\${customerMessage}"
        
        Your job is to read their message and decide if they want to know more about registering a store, pricing, or need a "PM".
        If they seem interested in getting a store or asking "PM/How/Interested", reply with:
        "Hi! Welcome to KedaiChat 🙌 You can set up your online store for free in 5 minutes! Register directly here: https://kedaichat.online/register If you have more questions, let us know!"
        
        If they are just leaving a generic comment (e.g. "Nice", "Good job", unrelated spam), return exactly the word: IGNORE
        
        Reply ONLY with "IGNORE" or the friendly onboarding message text.
    \`;

    try {
        const apiKey = process.env.GEMINI_API_KEY || "";
        const client = new GoogleGenerativeAI(apiKey);
        const model = client.getGenerativeModel({ model: "gemini-3-flash-preview" }, { apiVersion: "v1beta" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Gemini Reply Generator Error:", error);
        return 'IGNORE';
    }
}
