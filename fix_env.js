const fs = require('fs');
const content = `DATABASE_URL="postgresql://postgres.umgfakdlzfcgqknppevf:Kedaichat880203@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
JWT_SECRET="Kedaichat_Production_Secret_2026"
CLOUDINARY_CLOUD_NAME="dtdij5lem"
CLOUDINARY_API_KEY="543621574562398"
CLOUDINARY_API_SECRET="xG4Wen7Twl4OfbRNNLexJ7s2DYM"
NODE_ENV="development"`;

try {
    fs.writeFileSync('.env', content, { encoding: 'utf8' });
    console.log('.env rewritten successfully');
} catch (e) {
    console.error('Failed to write .env:', e.message);
}
