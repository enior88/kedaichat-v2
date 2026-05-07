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
    Mail,
    Menu,
    X,
    Facebook,
    Instagram
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import dynamic from 'next/dynamic';

const OnboardingCarousel = dynamic(() => import('@/components/OnboardingCarousel'), {
    loading: () => <div className="min-h-screen bg-[#F9FAFB]" />
});
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function LandingPageClient() {
    const { t } = useLanguage();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [showOnboarding, setShowOnboarding] = React.useState(false);
    const [onboardingChecked, setOnboardingChecked] = React.useState(false);
    const searchParams = useSearchParams();
    const fromPwa = searchParams.get('v') === '2';
    React.useEffect(() => {
        // PWA Detection
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        const fromPwa = searchParams.get('v') === '2';
        const isMobile = window.innerWidth < 768;

        if ((isStandalone || fromPwa) && isMobile) {
            // Check if they've already seen it this session to avoid annoyance
            const seen = sessionStorage.getItem('kd_onboarding_seen');
            if (!seen) {
                setShowOnboarding(true);
                sessionStorage.setItem('kd_onboarding_seen', 'true');
            }
        }
        setOnboardingChecked(true);
    }, [searchParams, fromPwa]);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "KedaiChat",
        "operatingSystem": "Web",
        "applicationCategory": "BusinessApplication",
        "description": "WhatsApp-first Business OS untuk peniaga Malaysia. Urus order, ejen, dan group order terus dari WhatsApp.",
        "url": "https://kedaichat.online",
        "offers": [
            { "@type": "Offer", "name": "Free", "price": "0", "priceCurrency": "MYR", "description": "30 orders/month, basic dashboard" },
            { "@type": "Offer", "name": "Basic", "price": "29", "priceCurrency": "MYR", "description": "Unlimited orders, group order system, reseller links" },
            { "@type": "Offer", "name": "Pro", "price": "49", "priceCurrency": "MYR", "description": "Analytics, broadcast tools, advanced reseller system" }
        ],
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "2000",
            "bestRating": "5"
        },
        "review": [
            {
                "@type": "Review",
                "author": { "@type": "Person", "name": "Kak Ros" },
                "reviewRating": { "@type": "Rating", "ratingValue": "5" },
                "reviewBody": "Dulu order berselerak dalam WhatsApp, sekarang semua tersusun. Jimat lebih 2 jam sehari!"
            },
            {
                "@type": "Review",
                "author": { "@type": "Person", "name": "Hafiz" },
                "reviewRating": { "@type": "Rating", "ratingValue": "5" },
                "reviewBody": "RM29 sebulan tu worth it sangat. Minggu pertama dah recover balik dari jualan extra."
            }
        ]
    };

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        const container = document.getElementById('main-scroll-container');

        if (!element) return;

        // Mobile (window scrolling)
        if (window.innerWidth < 768) {
            const yOffset = -64; // Offset for navbar
            const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
            return;
        }

        // Desktop (container scrolling with snap)
        const containerElem = document.getElementById('main-scroll-container');

        if (containerElem) {
            let targetScroll = 0;
            if (id === 'discover') targetScroll = window.innerHeight * 1;
            else if (id === 'how-it-works') targetScroll = window.innerHeight * 2;
            else if (id === 'problem') targetScroll = window.innerHeight * 3;
            else if (id === 'features') targetScroll = window.innerHeight * 4;
            else if (id === 'testimonials') targetScroll = window.innerHeight * 5;
            else if (id === 'pricing') targetScroll = window.innerHeight * 6;

            const startY = containerElem.scrollTop;
            const distance = targetScroll - startY;
            const startTime = performance.now();

            containerElem.style.scrollSnapType = 'none';

            const duration = 500; // Snappy 500ms glide

            const step = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easing = 1 - Math.pow(1 - progress, 3);
                containerElem.scrollTo(0, startY + (distance * easing));

                if (elapsed < duration) {
                    window.requestAnimationFrame(step);
                } else {
                    containerElem.style.scrollSnapType = 'y mandatory';
                }
            };
            window.requestAnimationFrame(step);
        }
    };

    if (showOnboarding) {
        return <OnboardingCarousel />;
    }

    if (!onboardingChecked && fromPwa) {
        return <div className="min-h-screen bg-[#F9FAFB]" />;
    }

    return (
        <div id="main-scroll-container" className="bg-white font-inter text-gray-900 overflow-x-hidden min-h-screen" style={{ scrollBehavior: 'smooth' }}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Navigation */}
            <div className="fixed top-6 left-0 right-0 z-[100] px-4 flex justify-center pointer-events-none">
                <nav className="glass-pill max-w-5xl w-full mx-auto px-4 md:px-8 h-14 md:h-16 flex items-center justify-between pointer-events-auto">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm flex items-center justify-center p-2 bg-green-500">
                            <div className="text-white font-black text-xl leading-none">K</div>
                        </div>
                        <span className="text-xl font-black tracking-tighter text-navy-dark">KedaiChat</span>
                    </div>

                    <div className="hidden lg:flex items-center gap-10">
                        <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="text-sm font-bold text-slate-text hover:text-navy-dark transition-all duration-300">Cara ia berfungsi</a>
                        <a href="#problem" onClick={(e) => scrollToSection(e, 'problem')} className="text-sm font-bold text-slate-text hover:text-navy-dark transition-all duration-300">Masalah</a>
                        <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="text-sm font-bold text-slate-text hover:text-navy-dark transition-all duration-300">Ciri-ciri</a>
                        <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} className="text-sm font-bold text-slate-text hover:text-navy-dark transition-all duration-300">Harga</a>
                    </div>

                    <div className="flex items-center gap-2 md:gap-6">
                        <div className="hidden md:block">
                            <LanguageToggle />
                        </div>
                        <div className="hidden lg:flex items-center gap-6 border-l-2 border-gray-100 pl-6">
                            <Link href="/login" className="text-sm font-black text-navy-dark hover:text-[#22C55E] transition-all">
                                Login
                            </Link>
                            <Link href="/onboarding" className="bg-navy-dark text-white px-8 py-3.5 rounded-full text-sm font-black hover:bg-gray-800 transition-all shadow-lg active:scale-95 flex items-center gap-2">
                                Mula Percuma
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-all active:scale-90"
                        >
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </nav>

                {/* Mobile Menu */}
                <div className={`lg:hidden fixed inset-x-4 top-24 bg-white/90 backdrop-blur-2xl rounded-[2rem] border border-white/40 shadow-2xl transition-all duration-500 origin-top overflow-hidden z-[90] pointer-events-auto ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="p-8 flex flex-col gap-6">
                        <div className="flex flex-col gap-4">
                            {[
                                { id: 'how-it-works', label: t('how_it_works') },
                                { id: 'problem', label: t('problem_title') },
                                { id: 'features', label: t('features') },
                                { id: 'pricing', label: t('pricing_title') }
                            ].map((item) => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    onClick={(e) => { scrollToSection(e, item.id); setIsMenuOpen(false); }}
                                    className="text-lg font-bold text-navy-dark p-2 hover:text-[#22C55E] transition-colors"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>
                        <div className="flex flex-col gap-3 pt-6 border-t border-navy-dark/5">
                            <Link
                                href="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="w-full py-4 text-center text-lg font-bold text-navy-dark bg-navy-dark/5 rounded-2xl active:scale-95"
                            >
                                {t('login')}
                            </Link>
                            <Link
                                href="/onboarding"
                                onClick={() => setIsMenuOpen(false)}
                                className="w-full py-4 text-center text-lg font-bold text-white bg-gradient-to-r from-[#22C55E] to-[#16A34A] rounded-2xl shadow-xl shadow-green-100 active:scale-95"
                            >
                                {t('start_free')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <main className="relative">

                {/* 1. Hero Section */}
                <div className="relative min-h-screen z-[50] flex items-center justify-center pt-24 pb-20 md:py-0 overflow-hidden bg-white">
                    {/* Background Visuals */}
                    <div className="absolute inset-0 z-0 h-full w-full pointer-events-none overflow-hidden">
                        <div className="absolute top-[20%] right-[10%] w-[40rem] h-[40rem] bg-green-200/30 blur-[120px] rounded-full animate-pulse" />
                        <div className="absolute bottom-[20%] left-[5%] w-[30rem] h-[30rem] bg-emerald-100/40 blur-[100px] rounded-full" />
                        <div className="absolute inset-0 bg-noise opacity-[0.03]" />
                    </div>

                    <section className="max-w-7xl mx-auto px-4 md:px-8 w-full relative z-10">
                        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center lg:text-left text-center">
                            {/* Left Content */}
                            <div className="flex flex-col gap-6 md:gap-10 max-w-2xl mx-auto lg:mx-0">
                                <div className="inline-flex items-center gap-2 bg-green-50 text-[#22C55E] px-4 py-2 rounded-full w-fit mx-auto lg:mx-0 border border-green-100/50 shadow-sm animate-fade-in-up">
                                    <Zap size={14} className="fill-current" />
                                    <span className="text-[10px] font-black tracking-widest uppercase">{t('built_for_smes')}</span>
                                </div>

                                <div className="space-y-6">
                                    <h1 className="text-4xl md:text-6xl lg:text-[5.5rem] font-black text-navy-dark leading-[1.05] tracking-tight">
                                        Ambil Pesanan Lebih Teratur <br />
                                        & <span className="text-[#22C55E]">Jana Lebih Jualan</span> dari WhatsApp
                                    </h1>

                                    <p className="text-lg md:text-xl text-slate-text font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 opacity-80">
                                        KedaiChat membantu anda mengelak terlepas pesanan, mengumpul lebih banyak pesanan, dan menggalakkan pelanggan untuk membuat pesanan ulangan.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                                    <Link href="/onboarding" className="w-full sm:w-auto bg-[#22C55E] text-white px-10 py-5 rounded-2xl text-xl font-black hover:bg-[#1fb855] transition-all shadow-xl shadow-green-100 active:scale-95 flex items-center justify-center gap-3">
                                        Mula Percuma
                                        <ArrowRight size={24} />
                                    </Link>
                                    <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="w-full sm:w-auto bg-white text-navy-dark border-2 border-gray-100 px-10 py-5 rounded-2xl text-xl font-black hover:bg-gray-50 transition-all active:scale-95 flex items-center justify-center gap-3">
                                        <Play size={20} className="fill-navy-dark" />
                                        Cara ia berfungsi
                                    </a>
                                </div>

                                {/* Integration Icons Row */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 pt-4">
                                    {[
                                        { icon: <MessageSquare size={32} />, label: "WhatsApp Integration" },
                                        { icon: <ClipboardList size={32} />, label: "Smart Order Management" },
                                        { icon: <Users size={32} />, label: "Customer Engagement" },
                                        { icon: <BarChart3 size={32} />, label: "Sales Analytics" }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex flex-col items-center lg:items-start gap-2">
                                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group hover:bg-green-50 hover:text-green-500 transition-colors">
                                                {React.cloneElement(item.icon, { className: "transition-transform group-hover:scale-110" })}
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-400 text-center lg:text-left leading-tight uppercase tracking-wider">{item.label}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Social Proof Badge */}
                                <div className="flex items-center gap-4 pt-8 justify-center lg:justify-start">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-sm">
                                                <Image src={`https://i.pravatar.cc/100?u=user${i}`} alt="User" width={48} height={48} />
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1 text-yellow-400 mb-0.5">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <svg key={s} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <p className="text-xs font-bold text-gray-400">
                                            Dipercayai oleh 10,000+ usahawan Malaysia
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Content - Visual Mockup */}
                            <div className="relative lg:scale-105 xl:scale-110">
                                {/* Large Background Circular Element */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-green-50/30 rounded-full blur-3xl -z-10" />

                                <div className="relative w-fit mx-auto">
                                    {/* SVG Connectors (Curved Dashed Lines) */}
                                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible opacity-40" viewBox="0 0 400 600">
                                        <path d="M50,150 Q-50,250 50,450" fill="none" stroke="#22C55E" strokeWidth="2" strokeDasharray="6 6" className="animate-pulse" />
                                        <path d="M350,100 Q450,200 350,400" fill="none" stroke="#22C55E" strokeWidth="2" strokeDasharray="6 6" className="animate-pulse" />
                                    </svg>

                                    {/* iPhone Frame */}
                                    <div className="relative w-[300px] md:w-[340px] z-10 shadow-2xl rounded-[3.5rem] border-[10px] border-navy-dark/95 bg-navy-dark overflow-hidden ring-1 ring-white/20">
                                        <div className="relative bg-[#ece5dd] w-full aspect-[9/19.5] overflow-hidden flex flex-col">
                                            {/* WhatsApp UI Internal */}
                                            <div className="bg-[#075E54] p-4 text-white flex items-center gap-3 shadow-md">
                                                <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center text-navy-dark font-black text-sm">K</div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-bold flex items-center gap-1">
                                                        Kedai Runcit
                                                        <Check size={12} className="bg-[#25D366] text-white rounded-full p-0.5" />
                                                    </div>
                                                    <div className="text-[10px] opacity-70">Online</div>
                                                </div>
                                                <div className="flex gap-4 opacity-80">
                                                    <Play size={14} className="fill-current rotate-90" />
                                                    <Users size={14} />
                                                </div>
                                            </div>

                                            <div className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto">
                                                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] self-start relative">
                                                    <p className="text-[11px] leading-relaxed">Hi! Saya nak buat tempahan barang.</p>
                                                    <span className="text-[8px] opacity-40 float-right mt-1">10:30 AM</span>
                                                </div>

                                                <div className="bg-[#dcf8c6] p-3 rounded-2xl rounded-tr-none shadow-sm max-w-[85%] self-end relative">
                                                    <p className="text-[11px] leading-relaxed">Terima kasih! Senarai produk kami:</p>

                                                    <div className="mt-2 space-y-2">
                                                        {[
                                                            { name: "Beras Super 5kg", price: "26.50", img: "🍚" },
                                                            { name: "Minyak Masak 2kg", price: "10.80", img: "🧴" },
                                                            { name: "Gula Pasir 1kg", price: "2.60", img: "🧊" }
                                                        ].map((p, i) => (
                                                            <div key={i} className="bg-white/80 p-2 rounded-xl flex items-center gap-3 border border-white/50">
                                                                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-lg">{p.img}</div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="text-[9px] font-bold truncate">{p.name}</div>
                                                                    <div className="text-[9px] text-[#075E54] font-black">RM {p.price}</div>
                                                                </div>
                                                                <button className="w-5 h-5 bg-[#25D366] text-white rounded-full flex items-center justify-center">+</button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <button className="w-full bg-[#25D366] text-white py-2 rounded-xl text-[10px] font-black mt-3 shadow-md">Lihat Bakul (3)</button>
                                                    <span className="text-[8px] opacity-40 float-right mt-1">10:32 AM</span>
                                                </div>
                                            </div>

                                            <div className="bg-white p-3 flex items-center gap-3">
                                                <div className="flex-1 bg-gray-50 rounded-full px-4 py-2 text-[10px] text-gray-400">Type a message</div>
                                                <div className="flex gap-3 text-gray-400">
                                                    <Users size={16} />
                                                    <Bell size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Detailed Floating Cards */}

                                    {/* Total Orders Card */}
                                    <div className="absolute top-20 -left-20 md:-left-28 bg-white p-4 rounded-2xl shadow-2xl border border-gray-50 w-40 md:w-48 animate-float z-20">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Total Orders</span>
                                            <span className="text-[9px] font-black text-green-500 bg-green-50 px-1.5 py-0.5 rounded-full">+ 35.6%</span>
                                        </div>
                                        <div className="text-2xl font-black text-navy-dark tracking-tighter">4,782</div>
                                        <div className="mt-3 h-8 flex items-end gap-1">
                                            {[30, 45, 35, 55, 40, 65, 50, 70].map((h, i) => (
                                                <div key={i} className="flex-1 bg-green-100 rounded-sm hover:bg-green-500 transition-all cursor-pointer group" style={{ height: `${h}%` }}>
                                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-navy-dark text-white text-[8px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">{(h * 10).toLocaleString()}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Sales Card */}
                                    <div className="absolute md:top-10 -right-20 md:-right-32 bg-white p-5 rounded-2xl shadow-2xl border border-gray-50 w-44 md:w-52 animate-float-delayed z-20">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-gray-400 uppercase">Sales</span>
                                                <span className="text-xl font-black text-[#22C55E]">+500%</span>
                                            </div>
                                            <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center text-green-500">
                                                <BarChart3 size={18} />
                                            </div>
                                        </div>
                                        <svg className="w-full h-12 overflow-visible" viewBox="0 0 100 40">
                                            <path d="M0,35 Q10,30 20,25 T40,20 T60,10 T80,5 T100,0" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" />
                                            <circle cx="100" cy="0" r="3" fill="#22C55E" />
                                        </svg>
                                    </div>

                                    {/* Features Checkbox List */}
                                    <div className="absolute bottom-24 -right-20 md:-right-24 bg-white p-4 rounded-2xl shadow-2xl border border-gray-50 w-40 md:w-48 animate-float z-20">
                                        <div className="space-y-3">
                                            {[
                                                "Tak terlepas pesanan lagi",
                                                "Proses lebih cepat & teratur",
                                                "Pelanggan kembali lagi"
                                            ].map((txt, i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-green-500 shadow-sm flex-shrink-0">
                                                        <Check size={10} strokeWidth={4} />
                                                    </div>
                                                    <span className="text-[9px] font-bold text-gray-600 tracking-tight leading-tight">{txt}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Repeat Customers Card */}
                                    <div className="absolute -bottom-10 -left-10 md:left-4 bg-white p-4 rounded-3xl shadow-2xl border border-gray-50 w-44 md:w-52 animate-float-delayed z-20">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-14 h-14">
                                                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                                    <circle cx="18" cy="18" r="16" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                                                    <circle cx="18" cy="18" r="16" fill="none" stroke="#22C55E" strokeWidth="4" strokeDasharray="68 100" strokeLinecap="round" />
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black">68%</div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-[10px] font-black opacity-40 uppercase tracking-tighter">Repeat Customers</div>
                                                <div className="text-xl font-black">68%</div>
                                                <div className="text-[9px] font-black text-green-500">+18.2%</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>


                <div id="wrapper-how-it-works" className="relative md:h-[200vh] md:-mt-[100vh] h-auto z-[40] md:snap-start">
                    <section id="how-it-works" className="md:sticky md:top-0 md:h-screen relative h-auto bg-gray-50 flex flex-col justify-center px-6 py-24 md:py-24 overflow-hidden md:shadow-[0_-20px_40px_rgba(0,0,0,0.05)] border-t border-gray-100 md:border-none">
                        <div className="max-w-7xl mx-auto w-full text-center">
                            <div className="mb-12 md:mb-20">
                                <h2 className="text-[10px] md:text-xs font-black text-[#25D366] uppercase tracking-[0.4em] mb-4">{t('how_it_works')}</h2>
                                <h3 className="text-3xl md:text-5xl font-black leading-tight">{t('three_steps_title')}</h3>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4 md:gap-12 relative text-left">
                                {[
                                    { title: t('how_step_1_title'), desc: t('how_step_1_desc'), icon: <Store size={24} className="md:w-8 md:h-8" /> },
                                    { title: t('how_step_2_title'), desc: t('how_step_2_desc'), icon: <Package size={24} className="md:w-8 md:h-8" /> },
                                    { title: t('how_step_3_title'), desc: t('how_step_3_desc'), icon: <ArrowRight size={24} className="md:w-8 md:h-8" /> }
                                ].map((item, idx) => (
                                    <div key={idx} className="bg-white p-6 md:p-10 rounded-[24px] md:rounded-[40px] border border-gray-100 shadow-lg relative z-10 hover:shadow-2xl transition-all duration-500">
                                        <div className="w-12 h-12 md:w-16 md:h-16 bg-[#25D366] text-white rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-8 shadow-lg shadow-green-200/50">
                                            {item.icon}
                                        </div>
                                        <h4 className="text-lg md:text-2xl font-black mb-2 md:mb-4">{item.title}</h4>
                                        <p className="text-gray-500 font-medium leading-relaxed text-xs md:text-base">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

                <div id="wrapper-problem" className="relative md:h-[200vh] md:-mt-[100vh] h-auto z-[30] md:snap-start">
                    <section id="problem" className="md:sticky md:top-0 md:h-screen relative h-auto bg-white flex flex-col justify-center px-6 py-24 md:py-24 overflow-hidden md:shadow-[0_-20px_40px_rgba(0,0,0,0.08)] border-t border-gray-100 md:border-none">
                        <div className="max-w-7xl mx-auto w-full text-center">
                            <div className="mb-12 md:mb-20">
                                <h2 className="text-[10px] md:text-xs font-black text-[#25D366] uppercase tracking-[0.4em] mb-4">{t('problem_title')}</h2>
                                <h3 className="text-3xl md:text-5xl font-black leading-tight">{t('problem_subtitle')}</h3>
                                <p className="text-gray-500 mt-4 text-base md:text-lg font-medium">{t('problem_desc')}</p>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4 md:gap-8 text-left">
                                {[
                                    { icon: <AlertCircle size={24} className="text-red-500" />, title: t('problem_1_title'), desc: t('problem_1_desc'), bgColor: "bg-red-50" },
                                    { icon: <Clock size={24} className="text-orange-500" />, title: t('problem_2_title'), desc: t('problem_2_desc'), bgColor: "bg-orange-50" },
                                    { icon: <ClipboardList size={24} className="text-blue-500" />, title: t('problem_3_title'), desc: t('problem_3_desc'), bgColor: "bg-blue-50" }
                                ].map((item, idx) => (
                                    <div key={idx} className="bg-white p-6 md:p-10 rounded-[24px] md:rounded-[40px] shadow-lg border border-gray-50 transition-all duration-500">
                                        <div className={`${item.bgColor} w-12 h-12 md:w-20 md:h-20 rounded-[16px] md:rounded-[28px] flex items-center justify-center mb-4 md:mb-8`}>
                                            {item.icon}
                                        </div>
                                        <h4 className="text-lg md:text-2xl font-black mb-2 md:mb-4">{item.title}</h4>
                                        <p className="text-gray-500 leading-relaxed font-medium text-xs md:text-base">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

                {/* 2. Features Section */}
                <div id="wrapper-features" className="relative min-h-screen z-[20] flex items-center justify-center bg-gray-50/50 py-24 md:py-32 overflow-hidden">
                    <section id="features" className="max-w-7xl mx-auto px-4 md:px-8 w-full relative z-10">
                        <div className="text-center mb-16 md:mb-24">
                            <h2 className="text-xs font-bold text-[#22C55E] uppercase tracking-[0.3em] mb-4">{t('features')}</h2>
                            <h3 className="text-3xl md:text-5xl font-black text-navy-dark leading-tight">{t('human_speed_title')}</h3>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {[
                                { icon: <ShoppingBag />, title: t('feature_1_title'), desc: t('feature_1_desc') },
                                { icon: <ClipboardList />, title: t('feature_2_title'), desc: t('feature_2_desc') },
                                { icon: <BarChart3 />, title: t('analytics'), desc: t('feature_3_desc') },
                                { icon: <Bell />, title: t('feature_4_title'), desc: t('feature_4_desc') },
                                { icon: <Users />, title: t('feature_5_title'), desc: t('feature_5_desc') },
                                { icon: <Zap />, title: t('feature_6_title'), desc: t('feature_6_desc') }
                            ].map((feat, idx) => (
                                <div key={idx} className="group premium-card !p-8 hover:bg-white transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-none">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 text-navy-dark group-hover:bg-[#22C55E] group-hover:text-white transition-all duration-300 shadow-sm">
                                        {React.cloneElement(feat.icon as React.ReactElement, { size: 24, className: "group-hover:scale-110 transition-transform" })}
                                    </div>
                                    <h4 className="text-xl font-bold text-navy-dark mb-3 tracking-tight">{feat.title}</h4>
                                    <p className="text-slate-text font-medium leading-relaxed text-sm">{feat.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* ─── Testimonials ─── */}
                <div id="wrapper-testimonials" className="relative md:h-[200vh] md:-mt-[100vh] h-auto z-[15] md:snap-start">
                    <section id="testimonials" className="md:sticky md:top-0 md:h-screen relative h-auto bg-white flex flex-col justify-center px-6 py-24 md:py-24 overflow-hidden md:shadow-[0_-20px_40px_rgba(0,0,0,0.08)] border-t border-gray-100 md:border-none">
                        <div className="max-w-7xl mx-auto w-full text-center">
                            <div className="mb-12 md:mb-16">
                                <h2 className="text-[10px] md:text-xs font-black text-[#25D366] uppercase tracking-[0.4em] mb-4">{t('testimonials_title')}</h2>
                                <h3 className="text-3xl md:text-5xl font-black leading-tight">{t('testimonials_subtitle')}</h3>
                                {/* Star row */}
                                <div className="flex items-center justify-center gap-1 mt-4">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <svg key={s} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                    <span className="ml-2 text-sm font-black text-gray-500">4.8 / 5 &bull; 2,000+ peniaga</span>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-3 gap-6 md:gap-8 text-left">
                                {[
                                    {
                                        quote: t('testimonial_1_quote'),
                                        name: t('testimonial_1_name'),
                                        biz: t('testimonial_1_biz'),
                                        initials: 'KR',
                                        color: 'bg-orange-500',
                                        stars: 5
                                    },
                                    {
                                        quote: t('testimonial_2_quote'),
                                        name: t('testimonial_2_name'),
                                        biz: t('testimonial_2_biz'),
                                        initials: 'HZ',
                                        color: 'bg-blue-500',
                                        stars: 5
                                    },
                                    {
                                        quote: t('testimonial_3_quote'),
                                        name: t('testimonial_3_name'),
                                        biz: t('testimonial_3_biz'),
                                        initials: 'SA',
                                        color: 'bg-[#25D366]',
                                        stars: 5
                                    }
                                ].map((item, idx) => (
                                    <div key={idx} className="bg-gray-50 border border-gray-100 rounded-[28px] p-6 md:p-8 flex flex-col gap-4 hover:shadow-lg transition-all duration-500">
                                        {/* Stars */}
                                        <div className="flex gap-0.5">
                                            {Array.from({ length: item.stars }).map((_, i) => (
                                                <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                        {/* Quote */}
                                        <p className="text-gray-700 font-semibold leading-relaxed text-sm md:text-base flex-1 italic">{item.quote}</p>
                                        {/* Author */}
                                        <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                                            <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>
                                                {item.initials}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900">{item.name}</p>
                                                <p className="text-xs font-bold text-gray-400">{item.biz}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

                <div id="wrapper-pricing" className="relative md:h-[200vh] md:-mt-[100vh] h-auto z-[10] md:snap-start">
                    <section id="pricing" className="md:sticky md:top-0 md:h-screen relative h-auto bg-gray-900 text-white flex flex-col justify-center px-6 py-24 md:py-24 overflow-hidden border-t border-gray-800 md:border-none">
                        <div className="max-w-7xl mx-auto w-full text-center">
                            <div className="mb-10 md:mb-14">
                                <h2 className="text-[10px] md:text-xs font-black text-[#25D366] uppercase tracking-[0.4em] mb-4">{t('pricing_title')}</h2>
                                <h3 className="text-3xl md:text-5xl font-black leading-tight">{t('pricing_subtitle')}</h3>
                            </div>
                            <div className="grid md:grid-cols-3 gap-6 md:gap-8 text-left">
                                {[
                                    { name: t('pricing_free_title'), price: "0", features: [t('price_free_feature_1'), t('price_free_feature_2'), t('price_free_feature_3')], cta: t('start_free'), popular: false, valueBadge: null, roiBadge: null },
                                    { name: t('pricing_basic_title'), price: "29", features: [t('price_basic_feature_1'), t('price_basic_feature_2'), t('price_basic_feature_3'), t('price_basic_feature_4')], cta: t('cta_choose_basic'), popular: true, valueBadge: t('pricing_value_badge'), roiBadge: t('pricing_roi_badge') },
                                    { name: t('pricing_pro_title'), price: "49", features: [t('price_pro_feature_1'), t('price_pro_feature_2'), t('price_pro_feature_3'), t('price_pro_feature_4')], cta: t('cta_go_pro'), popular: false, valueBadge: null, roiBadge: null }
                                ].map((plan, idx) => (
                                    <div key={idx} className={`pricing-card p-8 md:p-10 rounded-[32px] md:rounded-[40px] border-2 transition-all duration-500 ${plan.popular ? 'bg-white text-gray-900 border-[#25D366] md:scale-105 shadow-2xl shadow-green-900/40 z-10' : 'bg-gray-800 text-white border-transparent'}`}>
                                        {plan.popular && <span className="inline-block bg-[#25D366] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full mb-4">{t('popular')}</span>}
                                        <h4 className="text-xl md:text-2xl font-black mb-2">{plan.name}</h4>
                                        <div className="flex items-end gap-1 mb-2">
                                            <span className="text-3xl md:text-4xl font-black">RM {plan.price}</span>
                                            <span className={`text-[10px] font-bold uppercase pb-1.5 ${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>{t('pricing_per_month')}</span>
                                        </div>
                                        {/* Value badge */}
                                        {plan.valueBadge && (
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="inline-flex items-center gap-1 bg-green-50 text-[#25D366] text-[10px] font-black px-2 py-1 rounded-full">
                                                    <Zap size={10} fill="currentColor" />
                                                    {plan.valueBadge}
                                                </span>
                                            </div>
                                        )}
                                        {/* ROI line */}
                                        {plan.roiBadge && (
                                            <p className="text-xs text-gray-400 italic mb-4">{plan.roiBadge}</p>
                                        )}
                                        <ul className={`space-y-3 md:space-y-4 mb-8 md:mb-10 ${plan.valueBadge ? '' : 'mt-6'}`}>
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
                            {/* Guarantee strip */}
                            <p className="mt-8 text-sm font-bold text-gray-400 flex items-center justify-center gap-2">
                                <Check size={16} className="text-[#25D366]" />
                                {t('pricing_guarantee')}
                            </p>
                        </div>
                    </section>
                </div>

                <div className="relative z-[0] bg-white md:snap-start">
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

                    <footer className="py-12 border-t border-gray-100 px-6">
                        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="flex flex-col items-center md:items-start gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg overflow-hidden">
                                        <Image src="/logo.png" alt="KedaiChat Logo" width={32} height={32} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-lg font-black tracking-tighter">KedaiChat</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <a href="https://facebook.com/kedaichat" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-50 text-gray-400 hover:text-[#1877F2] hover:bg-blue-50 rounded-xl flex items-center justify-center transition-all duration-300">
                                        <Facebook size={20} />
                                    </a>
                                    <a href="https://instagram.com/kedaichat" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-50 text-gray-400 hover:text-[#E4405F] hover:bg-red-50 rounded-xl flex items-center justify-center transition-all duration-300">
                                        <Instagram size={20} />
                                    </a>
                                    <a href="mailto:kedaichat@gmail.com" className="w-10 h-10 bg-gray-50 text-gray-400 hover:text-[#EA4335] hover:bg-red-50 rounded-xl flex items-center justify-center transition-all duration-300">
                                        <Mail size={20} />
                                    </a>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 text-sm font-bold text-gray-400">
                                <Link href="/privacy" className="hover:text-[#25D366] transition-colors">{t('privacy')}</Link>
                                <Link href="/terms" className="hover:text-[#25D366] transition-colors">{t('terms')}</Link>
                                <div className="hidden md:flex items-center gap-2">
                                    <span>{t('contact')}:</span>
                                    <a href="mailto:kedaichat@gmail.com" className="text-gray-900 hover:text-[#25D366] bg-green-50 px-3 py-1.5 rounded-full transition-colors flex items-center gap-2">
                                        <Mail size={14} className="text-[#25D366]" />
                                        kedaichat@gmail.com
                                    </a>
                                </div>
                            </div>
                            <p className="text-sm font-bold text-gray-400">© 2026 KedaiChat. {t('all_rights_reserved')}</p>
                        </div>
                    </footer>
                </div>
            </main >
        </div >
    );
}
