'use client';

import React from 'react';
import Link from 'next/link';
import {
    MessageSquare,
    ShoppingBag,
    BarChart3,
    Bell,
    Users,
    Zap,
    AlertCircle,
    Clock,
    ClipboardList,
    ChevronRight,
    Check,
    ArrowRight,
    Play,
    Store,
    Package,
    Mail
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import { Metadata } from 'next';

export default function LandingPage() {
    const { t } = useLanguage();

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "KedaiChat",
        "operatingSystem": "Web",
        "applicationCategory": "BusinessApplication",
        "description": "WhatsApp-first Business OS. Manage orders, resellers, and group orders via WhatsApp.",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "MYR"
        }
    };

    return (
        <div className="bg-white font-inter text-gray-900 h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-xl border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-green-200">
                            <img src="/logo.png" alt="KedaiChat Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xl font-black tracking-tighter">KedaiChat</span>
                    </div>

                    <div className="hidden lg:flex items-center gap-8">
                        <a href="#how-it-works" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">{t('how_it_works')}</a>
                        <a href="#problem" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">{t('problem_title')}</a>
                        <a href="#features" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">{t('features')}</a>
                        <a href="#pricing" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">{t('pricing_title')}</a>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <div className="scale-75 md:scale-100">
                            <LanguageToggle />
                        </div>
                        <Link href="/login" className="hidden sm:block text-sm font-bold text-gray-900 hover:text-[#25D366] transition-colors px-2 md:px-4 py-2">
                            {t('login')}
                        </Link>
                        <Link href="/onboarding" className="bg-gray-900 text-white px-4 py-2.5 md:px-6 md:py-3 rounded-full text-xs md:text-sm font-black hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 active:scale-95 whitespace-nowrap">
                            {t('start_free')}
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Floating Mobile CTA */}
            <div className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm">
                <Link href="/onboarding" className="flex items-center justify-center gap-3 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white h-16 rounded-2xl text-lg font-black shadow-2xl shadow-green-200 active:scale-95 transition-all">
                    {t('start_free')}
                    <ArrowRight size={20} />
                </Link>
            </div>

            {/* Main Content Sections with Layered Reveal */}
            <main className="relative">
                {/* Hero Section */}
                <section className="min-h-screen snap-start sticky top-0 bg-white flex flex-col justify-center px-6 pt-20 pb-20 z-10 transition-all duration-700">
                    <div className="max-w-7xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-green-50 text-[#25D366] px-4 py-2 rounded-full mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <Zap size={16} fill="currentColor" />
                            <span className="text-xs font-black uppercase tracking-widest">{t('built_for_smes')}</span>
                        </div>

                        <h1 className="text-4xl md:text-7xl font-black text-gray-900 mb-6 leading-[1.1] tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                            {t('hero_title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#25D366] to-[#128C7E]">{t('hero_shop_highlight')}</span>
                        </h1>

                        <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-3xl mx-auto font-medium animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                            {t('hero_desc')}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                            <Link href="/onboarding" className="w-full sm:w-auto bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white px-10 h-16 flex items-center justify-center rounded-2xl text-lg font-black hover:opacity-90 transition-all shadow-2xl shadow-green-200 active:scale-95 gap-2">
                                {t('start_free')}
                                <ArrowRight size={20} />
                            </Link>
                            <a href="#how-it-works" className="w-full sm:w-auto bg-white border-2 border-gray-100 text-gray-900 px-10 h-16 flex items-center justify-center rounded-2xl text-lg font-black hover:bg-gray-50 transition-all active:scale-95 gap-2">
                                <Play size={20} fill="currentColor" />
                                {t('how_it_works')}
                            </a>
                        </div>

                        {/* Hero Visual */}
                        <div className="mt-12 md:mt-20 relative animate-in fade-in zoom-in duration-1000 delay-500 max-w-4xl mx-auto">
                            <div className="relative rounded-[32px] md:rounded-[40px] overflow-visible group">
                                <div className="absolute inset-0 bg-green-100/50 blur-3xl -z-10 rounded-[100px] scale-90" />
                                <img
                                    src="/hero_illustration.png"
                                    alt="Successful Business Owner using KedaiChat"
                                    className="w-full h-auto drop-shadow-2xl rounded-[24px] md:rounded-[32px] object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* How it Works Section */}
                <section id="how-it-works" className="min-h-screen snap-start sticky top-0 bg-gray-50 flex flex-col justify-center px-6 py-24 z-20 transition-all duration-700 shadow-[-20px_0_40px_rgba(0,0,0,0.05)] border-t border-gray-100">
                    <div className="max-w-7xl mx-auto w-full">
                        <div className="text-center mb-12 md:mb-20">
                            <h2 className="text-[10px] md:text-xs font-black text-[#25D366] uppercase tracking-[0.4em] mb-4">{t('how_it_works')}</h2>
                            <h3 className="text-3xl md:text-5xl font-black leading-tight">{t('three_steps_title')}</h3>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 md:gap-12 relative">
                            {[
                                { title: t('how_step_1_title'), desc: t('how_step_1_desc'), icon: <Store size={32} /> },
                                { title: t('how_step_2_title'), desc: t('how_step_2_desc'), icon: <Package size={32} /> },
                                { title: t('how_step_3_title'), desc: t('how_step_3_desc'), icon: <ArrowRight size={32} /> }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white p-8 md:p-10 rounded-[32px] md:rounded-[40px] border border-gray-100 shadow-xl relative z-10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                                    <div className="w-14 h-14 md:w-16 md:h-16 bg-[#25D366] text-white rounded-2xl flex items-center justify-center mb-6 md:mb-8 shadow-lg shadow-green-200">
                                        {item.icon}
                                    </div>
                                    <h4 className="text-xl md:text-2xl font-black mb-4">{item.title}</h4>
                                    <p className="text-gray-500 font-medium leading-relaxed text-sm md:base">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Problem Section */}
                <section id="problem" className="min-h-screen snap-start sticky top-0 bg-white flex flex-col justify-center px-6 py-24 z-30 transition-all duration-700 shadow-[-20px_0_40px_rgba(0,0,0,0.1)] border-t border-gray-100">
                    <div className="max-w-7xl mx-auto w-full">
                        <div className="text-center mb-12 md:mb-20">
                            <h2 className="text-[10px] md:text-xs font-black text-[#25D366] uppercase tracking-[0.4em] mb-4">{t('problem_title')}</h2>
                            <h3 className="text-3xl md:text-5xl font-black leading-tight">{t('problem_subtitle')}</h3>
                            <p className="text-gray-500 mt-4 text-base md:text-lg font-medium">{t('problem_desc')}</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                            {[
                                {
                                    icon: <AlertCircle size={32} className="text-red-500" />,
                                    title: t('problem_1_title'),
                                    desc: t('problem_1_desc'),
                                    bgColor: "bg-red-50"
                                },
                                {
                                    icon: <Clock size={32} className="text-orange-500" />,
                                    title: t('problem_2_title'),
                                    desc: t('problem_2_desc'),
                                    bgColor: "bg-orange-50"
                                },
                                {
                                    icon: <ClipboardList size={32} className="text-blue-500" />,
                                    title: t('problem_3_title'),
                                    desc: t('problem_3_desc'),
                                    bgColor: "bg-blue-50"
                                }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white p-8 md:p-10 rounded-[32px] md:rounded-[40px] shadow-xl border border-gray-50 hover:translate-y-[-8px] transition-all group duration-500">
                                    <div className={`${item.bgColor} w-16 h-16 md:w-20 md:h-20 rounded-[24px] md:rounded-[28px] flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 transition-transform`}>
                                        {item.icon}
                                    </div>
                                    <h4 className="text-xl md:text-2xl font-black mb-4">{item.title}</h4>
                                    <p className="text-gray-500 leading-relaxed font-medium text-sm md:base">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="min-h-screen snap-start sticky top-0 bg-gray-50 flex flex-col justify-center px-6 py-24 z-40 transition-all duration-700 shadow-[-20px_0_40px_rgba(0,0,0,0.1)] border-t border-gray-100">
                    <div className="max-w-7xl mx-auto w-full">
                        <div className="text-center mb-12 md:mb-20">
                            <h2 className="text-[10px] md:text-xs font-black text-[#25D366] uppercase tracking-[0.4em] mb-4">{t('features')}</h2>
                            <h3 className="text-3xl md:text-5xl font-black leading-tight">{t('human_speed_title')}</h3>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
                            {[
                                { icon: <ShoppingBag />, title: t('feature_1_title'), desc: t('feature_1_desc') },
                                { icon: <ClipboardList />, title: t('feature_2_title'), desc: t('feature_2_desc') },
                                { icon: <BarChart3 />, title: t('analytics'), desc: t('feature_3_desc') },
                                { icon: <Bell />, title: t('feature_4_title'), desc: t('feature_4_desc') },
                                { icon: <Users />, title: t('feature_5_title'), desc: t('feature_5_desc') },
                                { icon: <Zap fill="currentColor" />, title: t('feature_6_title'), desc: t('feature_6_desc') }
                            ].map((feat, idx) => (
                                <div key={idx} className="flex gap-4 md:gap-6 bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-100 hover:shadow-md transition-all duration-500">
                                    <div className="bg-gray-900 text-white w-12 h-12 md:w-14 md:h-14 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg">
                                        {feat.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-lg md:text-xl font-black mb-2">{feat.title}</h4>
                                        <p className="text-gray-500 font-medium leading-relaxed text-xs md:text-sm">{feat.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="min-h-screen snap-start sticky top-0 bg-gray-900 text-white flex flex-col justify-center px-6 py-24 z-50 transition-all duration-700 shadow-[-20px_0_40px_rgba(0,0,0,0.5)]">
                    <div className="max-w-7xl mx-auto w-full">
                        <div className="text-center mb-12 md:mb-20">
                            <h2 className="text-[10px] md:text-xs font-black text-[#25D366] uppercase tracking-[0.4em] mb-4">{t('pricing_title')}</h2>
                            <h3 className="text-3xl md:text-5xl font-black leading-tight">{t('pricing_subtitle')}</h3>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                            {[
                                { name: t('pricing_free_title'), price: "0", features: [t('price_free_feature_1'), t('price_free_feature_2'), t('price_free_feature_3')], cta: t('start_free'), popular: false },
                                { name: t('pricing_basic_title'), price: "29", features: [t('price_basic_feature_1'), t('price_basic_feature_2'), t('price_basic_feature_3'), t('price_basic_feature_4')], cta: t('cta_choose_basic'), popular: true },
                                { name: t('pricing_pro_title'), price: "49", features: [t('price_pro_feature_1'), t('price_pro_feature_2'), t('price_pro_feature_3'), t('price_pro_feature_4')], cta: t('cta_go_pro'), popular: false }
                            ].map((plan, idx) => (
                                <div key={idx} className={`pricing-card p-8 md:p-10 rounded-[32px] md:rounded-[40px] border-2 transition-all duration-500 ${plan.popular ? 'bg-white text-gray-900 border-[#25D366] md:scale-105 shadow-2xl shadow-green-900/40 z-10' : 'bg-gray-800 text-white border-transparent'}`}>
                                    {plan.popular && <span className="inline-block bg-[#25D366] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full mb-6">{t('popular')}</span>}
                                    <h4 className="text-xl md:text-2xl font-black mb-2">{plan.name}</h4>
                                    <div className="flex items-end gap-1 mb-8">
                                        <span className="text-3xl md:text-4xl font-black">RM {plan.price}</span>
                                        <span className={`text-[10px] font-bold uppercase pb-1.5 ${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>{t('pricing_per_month')}</span>
                                    </div>
                                    <ul className="space-y-3 md:space-y-4 mb-8 md:mb-10">
                                        {plan.features.map(f => (
                                            <li key={f} className="flex items-center gap-3 text-xs md:text-sm font-bold">
                                                <Check size={18} className="text-[#25D366]" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <Link
                                        href={plan.name === t('pricing_free_title') ? '/onboarding' : `/checkout?plan=${plan.name.toUpperCase()}`}
                                        className={`block text-center w-full py-4 md:py-5 rounded-2xl font-black transition-all active:scale-95 ${plan.popular ? 'bg-[#25D366] text-white hover:bg-[#1fb855] shadow-xl shadow-green-100' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                                    >
                                        {plan.cta}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA & Footer Layer */}
                <div className="snap-start relative z-[60] bg-white">
                    {/* Final CTA */}
                    <section className="py-24 md:py-32 px-6">
                        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-[40px] md:rounded-[60px] p-10 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-green-900/20">
                            <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
                                <MessageSquare size={200} fill="currentColor" />
                            </div>
                            <h3 className="text-3xl md:text-5xl leading-tight font-black mb-8 relative z-10">{t('ready_to_grow')}</h3>
                            <p className="text-lg md:text-2xl font-bold mb-10 md:mb-12 opacity-90 relative z-10">{t('join_sellers')}</p>
                            <Link href="/onboarding" className="inline-flex items-center justify-center w-full sm:w-auto gap-3 bg-white text-[#25D366] px-8 md:px-12 h-16 md:h-20 rounded-2xl md:rounded-3xl text-lg md:text-xl font-black hover:bg-gray-50 transition-all shadow-2xl active:scale-95 relative z-10">
                                {t('create_store_now')}
                                <ArrowRight size={24} />
                            </Link>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="py-12 border-t border-gray-100 px-6">
                        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg overflow-hidden">
                                    <img src="/logo.png" alt="KedaiChat Logo" className="w-full h-full object-cover" />
                                </div>
                                <span className="text-lg font-black tracking-tighter">KedaiChat</span>
                            </div>

                            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 text-sm font-bold text-gray-400">
                                <Link href="/privacy" className="hover:text-[#25D366] transition-colors">{t('privacy')}</Link>
                                <Link href="/terms" className="hover:text-[#25D366] transition-colors">{t('terms')}</Link>
                                <div className="flex items-center gap-2">
                                    <span>{t('contact')}:</span>
                                    <a href="mailto:enginenior@gmail.com" className="text-gray-900 hover:text-[#25D366] bg-green-50 px-3 py-1.5 rounded-full transition-colors flex items-center gap-2">
                                        <Mail size={14} className="text-[#25D366]" />
                                        enginenior@gmail.com
                                    </a>
                                </div>
                            </div>

                            <p className="text-sm font-bold text-gray-400">© 2026 KedaiChat. {t('all_rights_reserved')}</p>
                        </div>

                        {/* SEO Footer Keywords */}
                        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-50 opacity-40 text-[10px] font-medium text-gray-300 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <h4 className="font-black uppercase mb-2">Solutions</h4>
                                <p>WhatsApp Business Shop</p>
                                <p>WhatsApp Catalog Link</p>
                                <p>Social Commerce Malaysia</p>
                            </div>
                            <div>
                                <h4 className="font-black uppercase mb-2">Features</h4>
                                <p>WhatsApp Order Management</p>
                                <p>Reseller Network Tools</p>
                                <p>Group Order System</p>
                            </div>
                            <div>
                                <h4 className="font-black uppercase mb-2">Comparison</h4>
                                <p>WhatsApp Biz Alternative</p>
                                <p>Best WhatsApp eCommerce</p>
                                <p>Free WhatsApp Store</p>
                            </div>
                            <div>
                                <h4 className="font-black uppercase mb-2">Local</h4>
                                <p>Kedai WhatsApp Malaysia</p>
                                <p>SME Digitalization Grant</p>
                                <p>Jual di WhatsApp</p>
                            </div>
                        </div>
                    </footer>
                </div>
            </main>
        </div>
    );
}
