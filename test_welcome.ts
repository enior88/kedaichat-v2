import { config } from 'dotenv';
config({ path: '.env.local' });
import { generateWelcomePost } from './src/lib/platform-agent';

async function test() {
    console.log("Testing Welcome Post generation...");
    try {
        await generateWelcomePost("Nior's Tech Hub Showcase", "Electronics", "niors-tech-showcase");
        console.log("Welcome Post test finished.");
    } catch (e) {
        console.error("Test error:", e);
    }
}
test();
