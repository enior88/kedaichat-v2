import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
if (!apiKey) {
    console.warn("⚠️ GEMINI_API_KEY is missing from environment variables!");
}
const genAI = new GoogleGenerativeAI(apiKey);
// Using -latest suffix which can help with endpoint mapping
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

export interface MarketingContent {
    headline: string;
    caption: string;
    hashtags: string[];
    seoTitle: string;
    seoDescription: string;
}

export async function generateMarketingContent(storeName: string, products: string[], category: string): Promise<MarketingContent> {
    const prompt = `
        You are a highly creative AI Marketing Agent for an e-commerce platform called KedaiChat.online.
        Your goal is to write viral marketing content for a shop.
        
        Shop Name: ${storeName}
        Category: ${category}
        Top Products: ${products.join(", ")}

        Provide the following in JSON format:
        {
          "headline": "A catchy, bold headline (max 50 chars)",
          "caption": "A high-converting, emotional social media caption in 'Manglish' (Malaysian English) style, suitable for WhatsApp Status or Instagram. Use emojis.",
          "hashtags": ["list", "of", "relevant", "hashtags"],
          "seoTitle": "SEO-optimized title tag",
          "seoDescription": "SEO-optimized meta description"
        }
    `;

    try {
        // Try Flash 1.5 first (Fast & Cheap)
        const primaryModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await primaryModel.generateContent(prompt);
        return await processResponse(result);
    } catch (error) {
        console.warn("Primary model failed, falling back to gemini-1.5-pro-latest:", error);
        try {
            // Fallback to Pro 1.5 (More Powerful)
            const fallbackModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
            const result = await fallbackModel.generateContent(prompt);
            return await processResponse(result);
        } catch (fallbackError: any) {
            console.error("Gemini Generation Error:", fallbackError);
            throw new Error(`Gemini SDK Error: ${fallbackError.message || 'Unknown error'}`);
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
