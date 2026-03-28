import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white font-inter text-gray-900 py-24 px-6">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-[#25D366] font-bold mb-8 hover:opacity-80 transition-opacity">
                    <ArrowLeft size={20} />
                    Back to Home
                </Link>
                <h1 className="text-4xl md:text-5xl font-black mb-8">Terms of Service</h1>
                <div className="prose prose-lg text-gray-600 space-y-6">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
                        <p>By accessing or using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use License</h2>
                        <p>Permission is granted to temporarily download one copy of the materials (information or software) on KedaiChat's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-2">
                            <li>modify or copy the materials;</li>
                            <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                            <li>attempt to decompile or reverse engineer any software contained on KedaiChat's website;</li>
                            <li>remove any copyright or other proprietary notations from the materials; or</li>
                            <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
                        </ul>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Disclaimer</h2>
                        <p>The materials on KedaiChat's website are provided on an 'as is' basis. KedaiChat makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Limitations</h2>
                        <p>In no event shall KedaiChat or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on KedaiChat's website, even if KedaiChat or a KedaiChat authorized representative has been notified orally or in writing of the possibility of such damage.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Contact Us</h2>
                        <p>If you have any questions about these Terms, please contact us at <a href="mailto:enginenior@gmail.com" className="text-[#25D366] hover:underline">enginenior@gmail.com</a>.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
