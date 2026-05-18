import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNudgeEmail(email: string, businessName: string, storeSlug: string) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'KedaiChat <no-reply@resend.dev>', // Update this after verifying domain
            to: [email],
            subject: `Ready to start selling, ${businessName}? 🚀`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h1 style="color: #333;">Hi ${businessName}!</h1>
                    <p style="font-size: 16px; line-height: 1.5; color: #555;">
                        We noticed you created your store on <strong>KedaiChat</strong>, but you haven't added any products yet.
                    </p>
                    <p style="font-size: 16px; line-height: 1.5; color: #555;">
                        The best way to start is to upload your first product and share your link with your customers on WhatsApp!
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://kedaichat.com/dashboard" style="background-color: #000; color: #fff; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-weight: bold;">
                            Upload Your First Product
                        </a>
                    </div>
                    <p style="font-size: 14px; color: #888;">
                        Your store link: <a href="https://kedaichat.com/s/${storeSlug}" style="color: #007bff;">kedaichat.com/s/${storeSlug}</a>
                    </p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #aaa; text-align: center;">
                        © 2026 KedaiChat. All rights reserved.
                    </p>
                </div>
            `,
        });

        if (error) {
            console.error('Resend error:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Fatal email error:', error);
        return { success: false, error };
    }
}
