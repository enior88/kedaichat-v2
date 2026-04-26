import { generateMarketingContent } from './gemini';
import { prisma } from './prisma';
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Generates a platform-level growth article using AI.
 * Content focuses on growing KedaiChat.online by helping sellers.
 */
export async function generatePlatformArticle() {
    // 1. Fetch real growth stats for social proof
    const storeCount = await prisma.store.count({ where: { archived: false } });
    const orderCount = await prisma.order.count();

    const prompt = `
        You are the Head of Growth & Marketing for KedaiChat.online during our highly-anticipated LAUNCH PHASE!
        Your #1 absolute goal is to push hard to promote the platform, aggressively acquiring new sellers to open shops, and driving massive visitor traffic to use our service.
        
        PLATFORM STATS (Use these for social proof if theme 5 is chosen):
        - Total active shops: ${storeCount}
        - Total orders processed: ${orderCount}

        TOPIC CHOICE:
        Choose ONE of these themes:
        1. "The easiest way to start your online business today with zero cost (Seller Acquisition)"
        2. "Why local Malaysian sellers are shifting to KedaiChat right now (Platform Hype)"
        3. "Stop losing WhatsApp orders! See how KedaiChat solves this instantly (Problem Solving)"
        4. "Turn your followers into paying customers in 5 minutes (Conversion Hook)"
        5. "PLATFORM MILESTONES: Celebrating our community of ${storeCount} shops and ${orderCount} orders! (Social Proof & Momentum)"
        
        STYLE:
        - Language: Professional Manglish (mix of English and friendly local vibes).
        - Format: Scroll-stopping hook, undeniable value proposition, and a heavy, aggressive Call-to-Action to 'Set up your free shop now at kedaichat.online'.
        - Tone: High energy, urgent, hyped, and extremely persuasive. Push hard for growth and customer acquisition!
        - Include: 3-5 relevant high-traffic hashtags.
        
        RETURN FORMAT (JSON):
        {
            "title": "Short catchy title",
            "content": "Full article/post body with emojis",
            "category": "Growth/Tips/News/Milestones",
            "visualIdea": "Detailed description of a visual for this post"
        }
    `;

    try {
        const apiKey = process.env.GEMINI_API_KEY || "";
        const client = new GoogleGenerativeAI(apiKey);
        const model = client.getGenerativeModel({ model: "gemini-3-flash-preview" }, { apiVersion: "v1beta" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();

        // Clean markdown backticks if any
        const cleanedText = responseText.replace(/```json|```/g, '').trim();
        const data = JSON.parse(cleanedText);

        // Save as DRAFT in DB
        const article = await prisma.platformArticle.create({
            data: {
                title: data.title,
                content: data.content,
                category: data.category,
                status: 'DRAFT'
            }
        });

        return { success: true, article, visualIdea: data.visualIdea };
    } catch (error: any) {
        console.error("Platform Agent Error:", error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Generates and posts a 'Grand Opening' welcome message for new KedaiChat sellers.
 * @param storeName Name of the new store
 * @param category Category of the store
 * @param storeSlug URL slug for the store
 */
export async function generateWelcomePost(storeName: string, category: string, storeSlug: string) {
    const prompt = `
        You are the friendly AI Community Manager for KedaiChat.online.
        A brand new seller just joined our WhatsApp commerce platform!
        
        Store Name: ${storeName}
        Category: ${category}
        Link: https://kedaichat.online/shop/${storeSlug}
        
        Task: Write a short, exciting Facebook "Grand Opening" welcome post.
        - Tone: Welcoming, cheerful, enthusiastic Manglish (Malaysian internet style).
        - Format: 
            - Catchy headline with emojis.
            - Briefly welcome them to the KedaiChat family.
            - Tell people to support this local business by checking out their catalog.
            - Include the exact Store Link.
            - 3 relevant hashtags.
        
        Keep it under 3-4 sentences total.
        Return ONLY the raw text for the post, no JSON formatting, no markdown code blocks.
    `;

    try {
        const apiKey = process.env.GEMINI_API_KEY || "";
        const client = new GoogleGenerativeAI(apiKey);
        const model = client.getGenerativeModel({ model: "gemini-3-flash-preview" }, { apiVersion: "v1beta" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const postContent = response.text();

        // Clean markdown backticks if any
        const cleanedPost = postContent.replace(/```markdown|```/g, '').trim();

        // Import dynamically to avoid circular dependencies if any, though meta.ts is a separate util
        const { postToFacebookPage } = await import('./meta');

        // Assuming we use a default welcoming image or KedaiChat default growth visual
        const welcomeImg = "https://kedaichat.online/images/growth-default.jpg";

        console.log(`🤖 Broadcasting Welcome Post for ${storeName}...`);
        await postToFacebookPage(cleanedPost, welcomeImg);

    } catch (error) {
        console.error("Welcome Post Generation Error:", error);
    }
}
