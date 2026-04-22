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

    // Future-proof prioritized model list
    const modelsToTry = [
        { name: "gemini-flash-latest", version: "v1" },      // Evergreen Flash
        { name: "gemini-3-flash-preview", version: "v1beta" }, // Custom 3 Preview
        { name: "gemini-2.5-flash", version: "v1" },        // Modern Standard
        { name: "gemini-2.0-flash", version: "v1" },        // Modern Standard
        { name: "gemini-pro-latest", version: "v1" }         // Evergreen Pro fallback
    ];

    let lastError: any = null;

    for (const modelInfo of modelsToTry) {
        try {
            const model = client.getGenerativeModel({ model: modelInfo.name }, { apiVersion: modelInfo.version });
            const result = await model.generateContent(prompt);
            return await processResponse(result);
        } catch (error: any) {
            console.warn(`Model ${modelInfo.name} unavailable, trying next...`);
            lastError = error;
            continue;
        }
    }

    throw new Error(`AI Engine exhaustion: ${lastError?.message || 'Unknown error'}`);
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
