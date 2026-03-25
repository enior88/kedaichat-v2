const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function test() {
    try {
        console.log('Testing Cloudinary with Name:', process.env.CLOUDINARY_CLOUD_NAME);
        const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'kedaichat_test' },
                (error, result) => {
                    if (error) {
                        console.error('Upload Error:', error);
                        return reject(error);
                    }
                    console.log('Upload Success! URL:', result.secure_url);
                    resolve(result);
                }
            );
            uploadStream.end(buffer);
        });
    } catch (e) {
        console.error('Fatal Error:', e);
    }
}

test();
