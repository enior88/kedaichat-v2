import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white font-inter text-gray-900 py-24 px-6">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-[#25D366] font-bold mb-8 hover:opacity-80 transition-opacity">
                    <ArrowLeft size={20} />
                    Back to Home
                </Link>
                <h1 className="text-4xl md:text-5xl font-black mb-8">Privacy Policy</h1>
                <div className="prose prose-lg text-gray-600 space-y-6">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                        <p>Welcome to KedaiChat. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. The Data We Collect About You</h2>
                        <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-2">
                            <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                            <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
                            <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                        </ul>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Personal Data</h2>
                        <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-2">
                            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                            <li>Where we need to comply with a legal obligation.</li>
                        </ul>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
                        <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Contact Us</h2>
                        <p>If you have any questions about this privacy policy or our privacy practices, please contact us at <a href="mailto:enginenior@gmail.com" className="text-[#25D366] hover:underline">enginenior@gmail.com</a>.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
