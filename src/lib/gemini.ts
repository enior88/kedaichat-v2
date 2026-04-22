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

    try {
        // Use Gemini 3 Flash Preview (Identified via Diagnostic)
        const model = client.getGenerativeModel({ model: "gemini-3-flash-preview" }, { apiVersion: "v1beta" });
        const result = await model.generateContent(prompt);
        return await processResponse(result);
    } catch (error) {
        console.warn("Gemini 3 Flash failed, falling back to Pro:", error);
        try {
            // Fallback to Gemini 3 Pro Preview
            const fallbackModel = client.getGenerativeModel({ model: "gemini-3-pro-preview" }, { apiVersion: "v1beta" });
            const result = await fallbackModel.generateContent(prompt);
            return await processResponse(result);
        } catch (fallbackError: any) {
            console.error("Gemini 3 Generation Error:", fallbackError);
            throw new Error(`Gemini 3 Error: ${fallbackError.message || 'Unknown error'}`);
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
