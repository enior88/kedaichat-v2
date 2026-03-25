import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file buffer to Cloudinary and returns the URL.
 * @param buffer - The file buffer to upload.
 * @param folder - Optional folder name in Cloudinary.
 * @returns The secure URL of the uploaded image.
 */
export async function uploadToCloudinary(buffer: Buffer, folder: string = 'kedaichat'): Promise<string> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'auto',
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return reject(error);
                }
                if (!result) {
                    return reject(new Error('Cloudinary upload failed: No result returned'));
                }
                resolve(result.secure_url);
            }
        );

        uploadStream.end(buffer);
    });
}

export default cloudinary;
