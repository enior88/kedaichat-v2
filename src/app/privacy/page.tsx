import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Mail } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gray-50 font-inter text-gray-900 pb-24">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-[#25D366] to-[#128C7E] pt-32 pb-48 px-6 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
                    <ShieldCheck size={200} fill="currentColor" />
                </div>
                <div className="max-w-3xl mx-auto relative z-10">
                    <div className="flex justify-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-full font-bold transition-all text-sm">
                            <ArrowLeft size={16} />
                            Back to Home
                        </Link>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">Privacy Policy</h1>
                    <p className="text-xl font-medium opacity-90">How we protect and manage your data.</p>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-6 -mt-32 relative z-20">
                <div className="bg-white rounded-[40px] shadow-2xl shadow-green-900/10 p-10 md:p-16 border border-gray-100">
                    <p className="text-sm font-bold text-[#25D366] uppercase tracking-widest mb-12">Last updated: {new Date().toLocaleDateString()}</p>

                    <div className="prose prose-lg text-gray-600 space-y-10 max-w-none">
                        <section className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                            <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-green-100 text-[#25D366] flex items-center justify-center text-sm">1</span>
                                Introduction
                            </h2>
                            <p className="font-medium leading-relaxed">Welcome to KedaiChat. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
                        </section>

                        <section className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                            <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-green-100 text-[#25D366] flex items-center justify-center text-sm">2</span>
                                The Data We Collect About You
                            </h2>
                            <p className="font-medium mb-4">We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-[#25D366] mt-2 flex-shrink-0" />
                                    <span><strong className="text-gray-900">Identity Data</strong> includes first name, last name, username or similar identifier.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-[#25D366] mt-2 flex-shrink-0" />
                                    <span><strong className="text-gray-900">Contact Data</strong> includes email address and telephone numbers.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-[#25D366] mt-2 flex-shrink-0" />
                                    <span><strong className="text-gray-900">Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform.</span>
                                </li>
                            </ul>
                        </section>

                        <section className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                            <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-green-100 text-[#25D366] flex items-center justify-center text-sm">3</span>
                                How We Use Your Personal Data
                            </h2>
                            <p className="font-medium mb-4">We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-[#25D366] mt-2 flex-shrink-0" />
                                    <span>Where we need to perform the contract we are about to enter into or have entered into with you.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-[#25D366] mt-2 flex-shrink-0" />
                                    <span>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-[#25D366] mt-2 flex-shrink-0" />
                                    <span>Where we need to comply with a legal obligation.</span>
                                </li>
                            </ul>
                        </section>

                        <section className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                            <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-green-100 text-[#25D366] flex items-center justify-center text-sm">4</span>
                                Data Security
                            </h2>
                            <p className="font-medium leading-relaxed">We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.</p>
                        </section>

                        <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-10 rounded-3xl border border-gray-800 shadow-xl mt-12 text-center">
                            <Mail size={40} className="mx-auto mb-6 text-[#25D366]" />
                            <h2 className="text-3xl font-black mb-4">Contact Us</h2>
                            <p className="font-medium text-gray-400 mb-8">If you have any questions about this privacy policy, please reach out to us at our dedicated support email.</p>
                            <a href="mailto:enginenior@gmail.com" className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1fb855] text-white px-8 py-4 rounded-xl font-black transition-all shadow-lg shadow-green-900/50 active:scale-95 text-lg">
                                enginenior@gmail.com
                            </a>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
