const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: "dtdij5lem",
    api_key: "543621574562398",
    api_secret: "xG4Wen7Twl4OfbRNNLexJ7s2DYM",
});

async function test() {
    try {
        console.log('Testing Cloudinary with Hardcoded Keys...');
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
