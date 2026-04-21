import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export interface MarketingContent {
    headline: string;
    caption: string;
    hashtags: string[];
    seoTitle: string;
    seoDescription: string;
}

export async function generateMarketingContent(storeName: string, products: string[], category: string): Promise<MarketingContent> {
    const prompt = `
        You are an expert AI Marketing Agent for KedaiChat.online, a WhatsApp-first commerce platform in Malaysia.
        Target Audience: Malaysian shoppers and small business owners.
        Language: Dynamic "BM-English" mix (Manglish/Santai) - natural, friendly, and catchy.
        
        Store: ${storeName}
        Category: ${category}
        Top Products: ${products.join(", ")}
        
        Generate the following marketing content in JSON format:
        1. headline: A catchy 1-liner to feature the shop.
        2. caption: A persuasive social media caption (FB/IG style) highlighting why people should buy. Include relevant emojis.
        3. hashtags: 5 trending Malaysian hashtags (e.g., #KedaiChat, #SapotLokal).
        4. seoTitle: A perfect SEO title (max 60 chars).
        5. seoDescription: A perfect SEO meta-description (max 160 chars).
        
        Respond ONLY with valid JSON.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean the response in case it contains markdown code blocks
        const jsonString = text.replace(/```json|```/g, "").trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Gemini Generation Error:", error);
        throw new Error("Failed to generate marketing content");
    }
}
