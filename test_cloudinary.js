const { uploadToCloudinary } = require('./src/lib/cloudinary');
const fs = require('fs');

async function test() {
    try {
        console.log('Starting Cloudinary test...');
        // Create a dummy buffer (1x1 red dot png)
        const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
        const url = await uploadToCloudinary(buffer, 'test_folder');
        console.log('Success! Test Image URL:', url);
    } catch (e) {
        console.error('Test Failed:', e);
    }
}

test();
