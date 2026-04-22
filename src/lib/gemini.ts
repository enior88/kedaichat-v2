import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export interface MarketingContent {
    headline: string;
    caption: string;
    hashtags: string[];
    seoTitle: string;
    seoDescription: string;
}

export async function generateMarketingContent(storeName: string, products: string[], category: string): Promise<MarketingContent> {
    const apiKey = process.env.GEMINI_API_KEY || "";
    const client = new GoogleGenerativeAI(apiKey);

    const prompt = `
        You are a highly creative AI Marketing Agent for KedaiChat.online.
        Shop: ${storeName} (${category})
        Products: ${products.join(", ")}

        Provide JSON:
        {
          "headline": "catchy headline",
          "caption": "emotional Manglish caption with emojis",
          "hashtags": ["#tag1", "#tag2"],
          "seoTitle": "seo title",
          "seoDescription": "seo description"
        }
    `;

    // RAW DEBUG PROBE
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: "Hi" }] }] })
        });

        const data = await resp.json();
        if (!resp.ok) {
            console.error("RAW DEBUG ERROR:", data);
            throw new Error(`Google Raw Error: ${JSON.stringify(data)}`);
        }

        // If it actually works, we can try to parse the prompt
        // but for now let's just use it to debug the 404
        const client = new GoogleGenerativeAI(apiKey);
        const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        return await processResponse(result);

    } catch (e: any) {
        throw new Error(`AI Agent Diagnostic: ${e.message}`);
    }
}
}

async function processResponse(result: any): Promise<MarketingContent> {
    const response = await result.response;
    let text = response.text();

    // Clean up potential markdown code blocks
    if (text.includes('```')) {
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    }

    try {
        return JSON.parse(text);
    } catch (e) {
        console.error("Failed to parse Gemini JSON:", text);
        throw new Error("Invalid AI response format");
    }
}
