import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Scale, Mail } from 'lucide-react';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50 font-inter text-gray-900 pb-24">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 pt-32 pb-48 px-6 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
                    <Scale size={200} fill="currentColor" />
                </div>
                <div className="max-w-3xl mx-auto relative z-10">
                    <div className="flex justify-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full font-bold transition-all text-sm">
                            <ArrowLeft size={16} />
                            Back to Home
                        </Link>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">Terms of Service</h1>
                    <p className="text-xl font-medium text-gray-400">The rules and guidelines for using KedaiChat.</p>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-6 -mt-32 relative z-20">
                <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-900/10 p-10 md:p-16 border border-gray-100">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-12">Last updated: {new Date().toLocaleDateString()}</p>

                    <div className="prose prose-lg text-gray-600 space-y-10 max-w-none">
                        <section className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                            <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-sm">1</span>
                                Agreement to Terms
                            </h2>
                            <p className="font-medium leading-relaxed">By accessing or using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
                        </section>

                        <section className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                            <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-sm">2</span>
                                Use License
                            </h2>
                            <p className="font-medium mb-4">Permission is granted to temporarily download one copy of the materials (information or software) on KedaiChat's website for personal, non-commercial transitory viewing only. Under this license you may not:</p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-gray-800 mt-2 flex-shrink-0" />
                                    <span className="font-medium">Modify or copy the materials.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-gray-800 mt-2 flex-shrink-0" />
                                    <span className="font-medium">Use the materials for any commercial purpose, or for any public display.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-gray-800 mt-2 flex-shrink-0" />
                                    <span className="font-medium">Attempt to decompile or reverse engineer any software contained on KedaiChat's website.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-gray-800 mt-2 flex-shrink-0" />
                                    <span className="font-medium">Remove any copyright or other proprietary notations from the materials.</span>
                                </li>
                            </ul>
                        </section>

                        <section className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                            <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-sm">3</span>
                                Disclaimer
                            </h2>
                            <p className="font-medium leading-relaxed">The materials on KedaiChat's website are provided on an 'as is' basis. KedaiChat makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                        </section>

                        <section className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                            <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-sm">4</span>
                                Limitations
                            </h2>
                            <p className="font-medium leading-relaxed">In no event shall KedaiChat or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on KedaiChat's website, even if KedaiChat or a KedaiChat authorized representative has been notified orally or in writing of the possibility of such damage.</p>
                        </section>

                        <section className="bg-red-50 p-8 rounded-3xl border border-red-100">
                            <h2 className="text-2xl font-black text-red-900 mb-4 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-red-200 text-red-800 flex items-center justify-center text-sm">5</span>
                                Prohibited Items & Activities
                            </h2>
                            <p className="font-medium leading-relaxed text-red-800">Selling prohibited items such as drugs, alcohol and anything that can be harmful is strictly prohibited. KedaiChat will take action to deactivate your shop and legal action will be taken against the perpetrators.</p>
                        </section>

                        <section className="bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white p-10 rounded-3xl border border-green-800 shadow-xl mt-12 text-center">
                            <Mail size={40} className="mx-auto mb-6 text-white" />
                            <h2 className="text-3xl font-black mb-4">Contact Us</h2>
                            <p className="font-medium text-green-100 mb-8">If you have any questions about these Terms, please reach out to us.</p>
                            <a href="mailto:kedaichat@gmail.com" className="inline-flex w-full md:w-auto items-center justify-center gap-2 bg-white text-[#25D366] hover:bg-gray-50 px-4 md:px-8 py-4 rounded-xl font-black transition-all shadow-xl active:scale-95 text-sm md:text-lg overflow-hidden whitespace-nowrap overflow-ellipsis">
                                <Mail size={18} />
                                kedaichat@gmail.com
                            </a>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
