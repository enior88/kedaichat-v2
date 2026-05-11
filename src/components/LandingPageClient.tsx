'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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
    Instagram,
    TrendingUp,
    ShieldCheck
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

const OnboardingCarousel = dynamic(() => import('@/components/OnboardingCarousel'), {
    loading: () => <div className="min-h-screen bg-[#F8FAFC]" />
});

export default function LandingPageClient() {
    const { t } = useLanguage();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [onboardingChecked, setOnboardingChecked] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const searchParams = useSearchParams();
    const fromPwa = searchParams.get('v') === '2';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        const isMobile = window.innerWidth < 768;

        if ((isStandalone || fromPwa) && isMobile) {
            const seen = sessionStorage.getItem('kd_onboarding_seen');
            if (!seen) {
                setShowOnboarding(true);
                sessionStorage.setItem('kd_onboarding_seen', 'true');
            }
        }
        setOnboardingChecked(true);
    }, [searchParams, fromPwa]);

    const scrollToSection = (e: React.MouseEvent | null, id: string) => {
        if (e) e.preventDefault();
        const element = document.getElementById(id);
        if (!element) return;
        const yOffset = -100;
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
        setIsMenuOpen(false);
    };

    if (showOnboarding) {
        return <OnboardingCarousel />;
    }

    if (!onboardingChecked && fromPwa) {
        return <div className="min-h-screen bg-[#F8FAFC]" />;
    }

    return (
        <div className="bg-[#F8FAFC] font-inter text-[#0F172A] overflow-x-hidden min-h-screen selection:bg-[#22C55E]/30">
            {/* FLOATING NAVBAR */}
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-4 left-0 right-0 z-[100] px-4 flex justify-center pointer-events-none"
            >
                <nav className={`pointer-events-auto max-w-6xl w-full mx-auto px-4 md:px-6 h-16 flex items-center justify-between rounded-full transition-all duration-300 border ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg border-opacity-100 border-[#0F172A]/5' : 'bg-white/40 backdrop-blur-sm border-transparent'}`}>
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                        <div className="w-9 h-9 rounded-[10px] overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#22C55E] to-[#14B8A6] shadow-sm">
                            <div className="text-white font-black text-lg leading-none">K</div>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-[#071226]">KedaiChat</span>
                    </div>

                    <div className="hidden lg:flex items-center gap-8 font-semibold text-[13px] text-[#64748B]">
                        <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="hover:text-[#0F172A] transition-colors">{t('how_it_works')}</a>
                        <a href="#problem" onClick={(e) => scrollToSection(e, 'problem')} className="hover:text-[#0F172A] transition-colors">{t('problem_title')}</a>
                        <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="hover:text-[#0F172A] transition-colors">{t('features')}</a>
                        <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} className="hover:text-[#0F172A] transition-colors">{t('pricing_title')}</a>
                    </div>

                    <div className="flex items-center gap-3 md:gap-5">
                        <div className="hidden md:block border-r border-[#64748B]/20 pr-5">
                            <LanguageToggle />
                        </div>
                        <Link href="/login" className="hidden md:block text-[13px] font-bold text-[#0F172A] hover:text-[#22C55E] transition-colors">
                            {t('login')}
                        </Link>
                        <Link href="/onboarding" className="hidden md:flex bg-[#071226] text-white px-5 py-2.5 rounded-full text-[13px] font-bold hover:bg-[#0F172A] transition-all shadow-md hover:shadow-xl active:scale-95 items-center gap-2 group">
                            {t('start_free')}
                        </Link>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#64748B]/10 transition-colors"
                        >
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </nav>

                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className="lg:hidden fixed inset-x-4 top-24 bg-white/95 backdrop-blur-2xl rounded-3xl border border-[#0F172A]/5 shadow-2xl p-6 pointer-events-auto"
                        >
                            <div className="flex flex-col gap-2">
                                {[
                                    { id: 'how-it-works', label: t('how_it_works') },
                                    { id: 'problem', label: t('problem_title') },
                                    { id: 'features', label: t('features') },
                                    { id: 'pricing', label: t('pricing_title') }
                                ].map((item) => (
                                    <a
                                        key={item.id}
                                        href={`#${item.id}`}
                                        onClick={(e) => scrollToSection(e, item.id)}
                                        className="text-[15px] font-semibold text-[#0F172A] p-3 rounded-xl hover:bg-[#64748B]/5 transition-colors"
                                    >
                                        {item.label}
                                    </a>
                                ))}
                            </div>
                            <div className="flex flex-col gap-3 pt-4 mt-2 border-t border-[#64748B]/10">
                                <Link
                                    href="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-full py-3.5 text-center text-[15px] font-bold text-[#0F172A] bg-[#64748B]/5 rounded-xl active:scale-95 transition-transform"
                                >
                                    {t('login')}
                                </Link>
                                <Link
                                    href="/onboarding"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-full py-3.5 text-center text-[15px] font-bold text-white bg-gradient-to-r from-[#22C55E] to-[#14B8A6] rounded-xl shadow-lg active:scale-95 transition-transform"
                                >
                                    {t('start_free')}
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <main className="relative z-10 w-full overflow-hidden">

                {/* 1. Hero Section */}
                <section id="hero" className="relative min-h-[95vh] flex items-center justify-center pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-[#F8FAFC]">
                    {/* Abstract Premium Background */}
                    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-gradient-to-b from-[#22C55E]/10 to-[#14B8A6]/5 blur-[120px] rounded-full mix-blend-multiply opacity-80" />
                        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-gradient-to-t from-[#22C55E]/10 to-[#14B8A6]/10 blur-[100px] rounded-full mix-blend-multiply opacity-70" />
                        <div className="absolute inset-0 bg-[#0F172A]/[0.02] [mask-image:linear-gradient(to_bottom,transparent,black)]" style={{ backgroundImage: "radial-gradient(rgba(15, 23, 42, 0.08) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
                    </div>

                    <div className="max-w-7xl mx-auto px-4 md:px-6 w-full relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-8">

                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="flex flex-col gap-6 lg:gap-8 max-w-2xl mx-auto lg:mx-0 text-center lg:text-left flex-1"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-[#0F172A]/5 text-[#0F172A] px-4 py-1.5 rounded-full w-fit mx-auto lg:mx-0 shadow-sm"
                            >
                                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
                                <span className="text-[12px] font-bold tracking-wide">Business OS for WhatsApp</span>
                            </motion.div>

                            <div className="space-y-4">
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-[40px] leading-[1] md:text-[56px] lg:text-[60px] font-extrabold text-[#0F172A] tracking-[-0.03em]"
                                >
                                    {t('hero_title_1')} <br className="hidden md:block" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22C55E] to-[#14B8A6]">{t('hero_title_highlight')}</span>
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-lg md:text-[20px] text-[#64748B] font-medium leading-relaxed max-w-[500px] mx-auto lg:mx-0"
                                >
                                    {t('hero_desc')}
                                </motion.p>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2 w-full"
                            >
                                <Link href="/onboarding" className="w-full sm:w-auto bg-gradient-to-r from-[#22C55E] to-[#14B8A6] text-white px-8 py-4 rounded-2xl text-[16px] font-bold shadow-[0_8px_30px_rgba(34,197,94,0.3)] hover:shadow-[0_8px_40px_rgba(34,197,94,0.4)] hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3">
                                    {t('start_free')}
                                    <ArrowRight size={18} />
                                </Link>
                                <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="w-full sm:w-auto bg-white/50 backdrop-blur-sm text-[#0F172A] border border-[#0F172A]/10 px-8 py-4 rounded-2xl text-[16px] font-bold hover:bg-white/80 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-sm hover:shadow-md">
                                    <div className="w-6 h-6 rounded-full bg-[#0F172A]/5 flex items-center justify-center">
                                        <Play size={10} className="fill-[#0F172A] text-[#0F172A] ml-0.5" />
                                    </div>
                                    {t('how_it_works')}
                                </a>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="flex items-center gap-4 pt-8 justify-center lg:justify-start mt-4"
                            >
                                <div className="flex -space-x-3">
                                    {[
                                        "/avatars/kak-ros.png",
                                        "/avatars/siti.png",
                                        "/avatars/hafiz.png",
                                        "/avatars/farhan.png"
                                    ].map((src, i) => (
                                        <div key={i} className="w-12 h-12 md:w-14 md:h-14 rounded-full border-[3.5px] border-[#F8FAFC] bg-slate-200 overflow-hidden shadow-md transition-transform hover:scale-110 hover:z-20 cursor-pointer">
                                            <img src={src} alt="Malaysian User" className="object-cover w-full h-full" />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col text-left">
                                    <div className="flex items-center gap-1 text-yellow-400">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <svg key={s} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="text-[13px] font-semibold text-[#64748B] tracking-tight mt-0.5">
                                        Trusted by 2,000+ Malaysian sellers
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Right Content - Visual Mockup */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                            className="relative flex-1 w-full h-[550px] flex items-center justify-center pointer-events-none mt-10 lg:mt-0"
                        >
                            {/* Main App Window Mockup */}
                            <div className="relative lg:absolute lg:right-[-50px] w-full max-w-[650px] h-[450px] bg-white rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)] border border-[#0F172A]/5 overflow-hidden flex flex-col z-10">
                                {/* Mac OS Window Header */}
                                <div className="h-10 bg-slate-50 border-b border-[#0F172A]/5 flex items-center px-4 gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                                        <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                                        <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                                    </div>
                                    <div className="mx-auto bg-white border border-[#0F172A]/5 rounded-md px-3 py-1 flex items-center gap-2 shadow-sm">
                                        <Store size={12} className="text-[#64748B]" />
                                        <span className="text-[10px] text-[#64748B] font-bold">Dashboard HQ</span>
                                    </div>
                                </div>

                                {/* App Fake Content */}
                                <div className="flex flex-1 overflow-hidden">
                                    <div className="w-48 bg-[#F8FAFC] border-r border-[#0F172A]/5 p-4 flex flex-col gap-3">
                                        <div className="h-6 w-24 bg-[#0F172A]/10 rounded-md mb-2" />
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className={`h-9 rounded-xl ${i === 1 ? 'bg-[#22C55E]/10' : 'bg-transparent'} flex items-center px-3 gap-3`}>
                                                <div className={`w-4 h-4 rounded ${i === 1 ? 'bg-[#22C55E]' : 'bg-[#64748B]/30'}`} />
                                                <div className={`h-2.5 rounded w-20 ${i === 1 ? 'bg-[#22C55E]/50' : 'bg-[#64748B]/20'}`} />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex-1 p-6 bg-white flex flex-col gap-5">
                                        <div className="flex justify-between items-center pb-2 border-b border-[#0F172A]/5">
                                            <div>
                                                <div className="h-6 w-32 bg-[#0F172A]/10 rounded mb-2" />
                                                <div className="h-3 w-48 bg-[#64748B]/20 rounded" />
                                            </div>
                                            <div className="h-9 w-28 bg-gradient-to-r from-[#22C55E] to-[#14B8A6] rounded-full opacity-90 shadow-md" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-[#0F172A]/5">
                                                <div className="w-8 h-8 rounded-full bg-[#22C55E]/10 flex items-center justify-center mb-3">
                                                    <BarChart3 size={16} className="text-[#22C55E]" />
                                                </div>
                                                <div className="h-6 w-24 bg-[#0F172A]/10 rounded mb-2" />
                                                <div className="h-2 w-[80%] bg-[#64748B]/10 rounded" />
                                            </div>
                                            <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-[#0F172A]/5">
                                                <div className="w-8 h-8 rounded-full bg-[#0F172A]/5 flex items-center justify-center mb-3">
                                                    <ShoppingBag size={16} className="text-[#0F172A]" />
                                                </div>
                                                <div className="h-6 w-20 bg-[#0F172A]/10 rounded mb-2" />
                                                <div className="h-2 w-[70%] bg-[#64748B]/10 rounded" />
                                            </div>
                                        </div>
                                        <div className="flex-1 bg-[#F8FAFC] rounded-2xl border border-[#0F172A]/5 relative overflow-hidden">
                                            <div className="absolute top-4 left-4 h-4 w-32 bg-[#0F172A]/10 rounded" />
                                            <div className="absolute top-12 left-4 right-4 h-3 bg-[#0F172A]/5 rounded" />
                                            <div className="absolute top-12 left-4 w-[60%] h-3 bg-[#22C55E]/20 rounded" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-[20%] lg:top-[10%] left-0 lg:-left-12 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.12)] border border-[#0F172A]/5 z-20 flex flex-col gap-2 w-56"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-[#22C55E]/10 flex items-center justify-center">
                                            <MessageSquare size={14} className="text-[#22C55E]" />
                                        </div>
                                        <span className="text-[12px] font-bold text-[#0F172A]">Kedai Runcit</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-[#64748B]">Just now</span>
                                </div>
                                <div className="bg-[#DCF8C6] p-3 rounded-xl rounded-tr-sm relative mt-2 border border-[#25D366]/20 shadow-sm text-left">
                                    <p className="text-[11px] font-medium text-[#0F172A] leading-relaxed">Hi, ada stok 2kg tepung lagi tak?</p>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 15, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-[20%] lg:bottom-[10%] right-[10%] lg:-right-8 bg-[#071226]/95 backdrop-blur-xl text-white p-5 rounded-[24px] shadow-[0_20px_40px_-5px_rgba(34,197,94,0.25)] border border-white/10 z-30 flex flex-col gap-4 w-60"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                            <TrendingUp size={14} className="text-[#22C55E]" />
                                        </div>
                                        <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Revenue</span>
                                    </div>
                                    <span className="text-[12px] font-bold text-[#22C55E] bg-[#22C55E]/10 px-2 py-1 rounded-full">+18%</span>
                                </div>
                                <div className="flex items-baseline gap-1 text-left">
                                    <span className="text-4xl font-extrabold tracking-tight">RM 4.2k</span>
                                </div>
                                <div className="w-full h-10 flex items-end gap-[3px] opacity-90 mt-2">
                                    {[20, 30, 40, 35, 50, 45, 60, 55, 80, 70, 95].map((h, i) => (
                                        <div key={i} className="flex-1 bg-gradient-to-t from-[#22C55E] to-[#14B8A6] rounded-sm" style={{ height: `${h}%` }} />
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                                className="absolute top-[50%] right-[5%] lg:right-5 bg-white/95 backdrop-blur-xl p-3.5 rounded-2xl shadow-[0_15px_30px_-5px_rgba(0,0,0,0.1)] border border-[#0F172A]/5 z-20 flex gap-3 items-center w-52"
                            >
                                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden relative border-2 border-white shadow-sm">
                                    <img src="/avatars/customer.png" alt="" className="object-cover w-full h-full opacity-0" />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-[#22C55E] to-[#14B8A6] flex justify-center items-center text-white font-bold text-sm">A</div>
                                </div>
                                <div className="text-left flex-1">
                                    <div className="flex items-center justify-between gap-1.5 w-full">
                                        <p className="text-[13px] font-bold text-[#0F172A]">Amellia</p>
                                        <span className="bg-[#22C55E]/10 text-[#22C55E] text-[10px] px-1.5 py-0.5 rounded-md font-bold shrink-0">Paid</span>
                                    </div>
                                    <p className="text-[11px] text-[#64748B] mt-0.5">Updated just now</p>
                                </div>
                            </motion.div>

                        </motion.div>
                    </div>
                </section>


                {/* 2. How It Works Section */}
                <section id="how-it-works" className="relative flex flex-col justify-center px-4 md:px-6 overflow-hidden bg-white pt-24 pb-16 md:pt-32 md:pb-20">
                    <div className="max-w-7xl mx-auto w-full text-center">
                        <div className="mb-12 md:mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center justify-center bg-[#22C55E]/10 text-[#22C55E] px-4 py-1.5 rounded-full mb-4 md:mb-6"
                            >
                                <span className="text-[11px] font-bold tracking-widest uppercase">{t('how_it_works')}</span>
                            </motion.div>
                            <motion.h3
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-3xl md:text-[42px] font-extrabold leading-[1.1] text-[#0F172A] tracking-[-0.02em]"
                            >
                                {t('three_steps_title')}
                            </motion.h3>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6 md:gap-8 relative text-left">
                            {[
                                { title: t('how_step_1_title'), desc: t('how_step_1_desc'), icon: <Store size={24} className="text-[#0F172A]" /> },
                                { title: t('how_step_2_title'), desc: t('how_step_2_desc'), icon: <Package size={24} className="text-[#0F172A]" /> },
                                { title: t('how_step_3_title'), desc: t('how_step_3_desc'), icon: <ArrowRight size={24} className="text-[#0F172A]" /> }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group bg-[#F8FAFC]/50 backdrop-blur-md p-8 md:p-10 rounded-[28px] border border-[#0F172A]/5 relative z-10 transition-all duration-300 hover:bg-white hover:shadow-[0_20px_40px_-10px_rgba(34,197,94,0.1)] hover:-translate-y-1.5"
                                >
                                    <div className="w-14 h-14 bg-white border border-[#0F172A]/5 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:rotate-3 group-hover:border-[#22C55E]/30 group-hover:bg-[#22C55E]/5 transition-all duration-300">
                                        {item.icon}
                                    </div>
                                    <h4 className="text-xl md:text-[22px] font-bold mb-3 text-[#0F172A]">{item.title}</h4>
                                    <p className="text-[#64748B] font-medium leading-relaxed text-[15px]">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 3. Problem Section */}
                <section id="problem" className="relative flex flex-col justify-center px-4 md:px-6 overflow-hidden bg-[#071226] text-white py-24 md:py-32">
                    <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay" />

                    <div className="max-w-7xl mx-auto w-full text-center relative z-10">
                        <div className="mb-12 md:mb-16">
                            <motion.h2
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="text-[11px] font-bold text-[#22C55E] uppercase tracking-[0.3em] mb-4 md:mb-6"
                            >
                                {t('problem_title')}
                            </motion.h2>
                            <motion.h3
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-3xl md:text-[42px] font-extrabold leading-[1.1] tracking-[-0.02em] text-white"
                            >
                                {t('problem_subtitle')}
                            </motion.h3>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="text-[#64748B] mt-5 text-[16px] md:text-[18px] font-medium max-w-[600px] mx-auto"
                            >
                                {t('problem_desc')}
                            </motion.p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 md:gap-8 text-left">
                            {[
                                { icon: <AlertCircle size={24} />, title: t('problem_1_title'), desc: t('problem_1_desc'), color: "EF4444", borderHover: "hover:border-[#EF4444]" },
                                { icon: <Clock size={24} />, title: t('problem_2_title'), desc: t('problem_2_desc'), color: "F59E0B", borderHover: "hover:border-[#F59E0B]" },
                                { icon: <ClipboardList size={24} />, title: t('problem_3_title'), desc: t('problem_3_desc'), color: "3B82F6", borderHover: "hover:border-[#3B82F6]" }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    style={{ '--accent-color': `#${item.color}` } as any}
                                    className={`group bg-white/[0.02] border border-white/5 rounded-[28px] p-8 md:p-10 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(var(--accent-color),0.15)] ${item.borderHover} hover:bg-white/[0.04]`}
                                >
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-[#${item.color}]/10 text-[#${item.color}] group-hover:scale-110 transition-transform duration-300`}>
                                        {item.icon}
                                    </div>
                                    <h4 className="text-[20px] md:text-[22px] font-bold mb-3 text-white tracking-tight">{item.title}</h4>
                                    <p className="text-[#64748B] leading-relaxed font-medium text-[15px]">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4. Features Section (Bento Grid) */}
                <section id="features" className="relative flex flex-col justify-center px-4 md:px-6 overflow-hidden bg-[#F8FAFC] py-24 md:py-32">
                    <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#0F172A]/10 to-transparent" />

                    <div className="max-w-7xl mx-auto w-full relative z-10">
                        <div className="text-center mb-16 md:mb-20">
                            <motion.h2
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="inline-block bg-[#22C55E]/10 text-[#22C55E] px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] mb-4 md:mb-6"
                            >
                                {t('features')}
                            </motion.h2>
                            <motion.h3
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-3xl md:text-[42px] font-extrabold text-[#0F172A] leading-[1.1] tracking-[-0.02em] max-w-2xl mx-auto"
                            >
                                {t('human_speed_title')}
                            </motion.h3>
                        </div>

                        {/* Bento Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 max-h-fit">

                            {/* Feature 1: Large Span */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="md:col-span-2 group bg-white rounded-[32px] border border-[#0F172A]/5 overflow-hidden shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 relative"
                            >
                                <div className="p-8 md:p-10 w-full md:w-[60%] h-full flex flex-col justify-center z-10 relative">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#22C55E] to-[#14B8A6] rounded-[18px] flex items-center justify-center text-white mb-6 group-hover:scale-105 transition-transform duration-300 shadow-md">
                                        <ShoppingBag size={20} />
                                    </div>
                                    <h4 className="text-[22px] font-bold text-[#0F172A] mb-3 tracking-tight">{t('feature_1_title')}</h4>
                                    <p className="text-[#64748B] font-medium leading-relaxed text-[15px]">{t('feature_1_desc')}</p>
                                </div>
                                {/* Visual Mockup */}
                                <div className="absolute right-[-40px] md:right-[-20px] bottom-[-20px] md:-bottom-8 w-[280px] h-[240px] bg-[#F8FAFC] border border-[#0F172A]/10 rounded-tl-3xl shadow-xl flex flex-col group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500">
                                    <div className="bg-[#DCF8C6] p-3 rounded-2xl m-4 w-4/5 shadow-sm text-[10px] text-[#0F172A] font-medium leading-relaxed">
                                        Order baru masuk! ✨<br />
                                        3x Nasi Goreng<br />
                                        2x Milo Ais
                                    </div>
                                    <div className="bg-white p-3 rounded-2xl ml-auto mr-4 w-4/5 shadow-sm text-[10px] text-[#0F172A] font-medium leading-relaxed border border-[#0F172A]/5">
                                        Total RM 35.00.<br />Link bayaran: kda.ai/pay
                                    </div>
                                </div>
                            </motion.div>

                            {/* Feature 2: Small Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="group bg-white rounded-[32px] border border-[#0F172A]/5 p-8 md:p-10 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#3B82F6]/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
                                <div className="w-12 h-12 bg-[#3B82F6]/10 text-[#3B82F6] rounded-[18px] flex items-center justify-center mb-6 group-hover:-translate-y-1 transition-transform duration-300">
                                    <ClipboardList size={20} />
                                </div>
                                <h4 className="text-[20px] font-bold text-[#0F172A] mb-3 tracking-tight">{t('feature_2_title')}</h4>
                                <p className="text-[#64748B] font-medium leading-relaxed text-[15px]">{t('feature_2_desc')}</p>
                            </motion.div>

                            {/* Feature 3: Small Card (Analytics) */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="group bg-white rounded-[32px] border border-[#0F172A]/5 p-8 md:p-10 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between"
                            >
                                <div className="relative z-10 mb-8">
                                    <div className="w-12 h-12 bg-[#F59E0B]/10 text-[#F59E0B] rounded-[18px] flex items-center justify-center mb-6 group-hover:-translate-y-1 transition-transform duration-300">
                                        <BarChart3 size={20} />
                                    </div>
                                    <h4 className="text-[20px] font-bold text-[#0F172A] mb-3 tracking-tight">{t('analytics')}</h4>
                                    <p className="text-[#64748B] font-medium leading-relaxed text-[15px]">{t('feature_3_desc')}</p>
                                </div>
                                {/* Mini Bar Chart */}
                                <div className="flex items-end gap-2 h-12 opacity-80 group-hover:opacity-100 transition-opacity">
                                    {[30, 45, 60, 40, 80, 50, 95].map((h, i) => (
                                        <div key={i} className="flex-1 bg-[#F59E0B]/80 rounded-t-sm transition-all duration-500 group-hover:bg-[#F59E0B]" style={{ height: `${h}%` }} />
                                    ))}
                                </div>
                            </motion.div>

                            {/* Feature 4: Large Span Span */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="md:col-span-2 group bg-[#071226] text-white rounded-[32px] border border-white/10 overflow-hidden shadow-xl hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-[#22C55E]/10 to-transparent pointer-events-none" />
                                <div className="p-8 md:p-10 w-full md:w-[60%] h-full flex flex-col justify-center z-10 relative">
                                    <div className="w-12 h-12 bg-white/10 text-white rounded-[18px] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                                        <Users size={20} />
                                    </div>
                                    <h4 className="text-[22px] font-bold text-white mb-3 tracking-tight">{t('feature_5_title')}</h4>
                                    <p className="text-[#64748B] font-medium leading-relaxed text-[15px]">{t('feature_5_desc')}</p>
                                </div>
                                {/* Visual Mockup */}
                                <div className="absolute right-0 md:right-8 top-1/2 -translate-y-1/2 w-48 h-56 flex flex-col gap-2 group-hover:-translate-x-2 transition-transform duration-500">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-3 backdrop-blur-sm">
                                            <div className="w-8 h-8 rounded-full bg-white/10" />
                                            <div>
                                                <div className="w-20 h-2.5 bg-white/20 rounded-full mb-1.5" />
                                                <div className="w-12 h-2 bg-white/10 rounded-full" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>


                {/* 5. Testimonials Section */}
                <section id="testimonials" className="relative flex flex-col justify-center px-4 md:px-6 overflow-hidden bg-white py-24 md:py-32">
                    <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#0F172A]/10 to-transparent" />
                    <div className="max-w-7xl mx-auto w-full text-center relative z-10">
                        <div className="mb-16 md:mb-20">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 bg-[#F59E0B]/10 text-[#F59E0B] px-4 py-1.5 rounded-full mb-4 md:mb-6"
                            >
                                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">{t('testimonials_title')}</span>
                            </motion.div>
                            <motion.h3
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-3xl md:text-[42px] font-extrabold leading-[1.1] text-[#0F172A] tracking-[-0.02em] max-w-2xl mx-auto"
                            >
                                {t('testimonials_subtitle')}
                            </motion.h3>

                            {/* Live Trust Metrics */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-col md:flex-row items-center justify-center gap-6 mt-8"
                            >
                                <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#0F172A]/5 px-5 py-2.5 rounded-2xl shadow-sm">
                                    <div className="flex gap-1 text-[#F59E0B]">
                                        {[1, 2, 3, 4, 5].map(s => <svg key={s} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                                    </div>
                                    <div className="w-[1px] h-4 bg-[#0F172A]/10" />
                                    <span className="text-[14px] font-bold text-[#0F172A]">4.9/5 Rating</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-3">
                                        {["/avatars/indian-woman.png", "/avatars/malay-man.png", "/avatars/chinese-man.png"].map((src, i) => (
                                            <img key={i} src={src} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" alt="Seller" />
                                        ))}
                                    </div>
                                    <span className="text-[14px] font-medium text-[#64748B]">Trusted by <strong className="text-[#0F172A]">2,000+</strong> sellers</span>
                                </div>
                            </motion.div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 md:gap-8 text-left max-w-6xl mx-auto h-full mt-10">
                            {[
                                { quote: t('testimonial_1_quote'), name: t('testimonial_1_name'), biz: t('testimonial_1_biz'), img: '/avatars/kak-ros.png' },
                                { quote: t('testimonial_2_quote'), name: t('testimonial_2_name'), biz: t('testimonial_2_biz'), img: '/avatars/hafiz.png' },
                                { quote: t('testimonial_3_quote'), name: t('testimonial_3_name'), biz: t('testimonial_3_biz'), img: '/avatars/siti.png' }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-[#F8FAFC] border border-[#0F172A]/5 rounded-[32px] p-8 flex flex-col justify-between hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 relative"
                                >
                                    <svg className="absolute top-8 right-8 w-10 h-10 text-[#0F172A]/5" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                                        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                                    </svg>
                                    <p className="text-[#0F172A] font-medium leading-relaxed text-[16px] relative z-10 mb-8 pt-4">&ldquo;{item.quote}&rdquo;</p>
                                    <div className="flex items-center gap-4 mt-auto relative z-10">
                                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden bg-slate-200 border-2 border-white shadow-md shrink-0">
                                            <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#0F172A] tracking-tight">{item.name}</p>
                                            <p className="text-[12px] font-bold text-[#64748B] tracking-wide uppercase">{item.biz}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 6. Pricing Section */}
                <section id="pricing" className="relative flex flex-col justify-center bg-[#071226] px-4 md:px-6 py-24 md:py-32 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-gradient-to-tr from-[#22C55E]/10 to-[#14B8A6]/5 blur-[120px] rounded-full pointer-events-none" />

                    <div className="max-w-7xl mx-auto w-full text-center relative z-10">
                        <div className="mb-16 md:mb-20 text-white">
                            <motion.h2
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="inline-block bg-white/5 border border-white/10 text-[#22C55E] px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] mb-4 md:mb-6"
                            >
                                {t('pricing_title')}
                            </motion.h2>
                            <motion.h3
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-3xl md:text-[42px] font-extrabold leading-[1.1] tracking-[-0.02em]"
                            >
                                {t('pricing_subtitle')}
                            </motion.h3>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 md:gap-8 text-left items-end max-w-6xl mx-auto">
                            {[
                                { name: t('pricing_free_title'), price: "0", features: [t('price_free_feature_1'), t('price_free_feature_2'), t('price_free_feature_3')], cta: t('start_free'), popular: false },
                                { name: t('pricing_basic_title'), price: "29", features: [t('price_basic_feature_1'), t('price_basic_feature_2'), t('price_basic_feature_3'), t('price_basic_feature_4')], cta: t('cta_choose_basic'), popular: true, valueBadge: t('pricing_value_badge'), roiBadge: t('pricing_roi_badge') },
                                { name: t('pricing_pro_title'), price: "49", features: [t('price_pro_feature_1'), t('price_pro_feature_2'), t('price_pro_feature_3'), t('price_pro_feature_4'), "Advanced APIs & Sync"], cta: t('cta_go_pro'), popular: false }
                            ].map((plan, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`pricing-card p-8 md:p-10 rounded-[32px] md:rounded-[40px] border transition-all duration-500 relative flex flex-col ${plan.popular
                                        ? 'bg-[#0F172A] border-[#22C55E]/50 shadow-[0_0_80px_-15px_rgba(34,197,94,0.15)] md:-translate-y-4 md:scale-105 z-20'
                                        : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.04] z-10 h-[95%]'
                                        }`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#22C55E] to-[#14B8A6] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-[0_4px_20px_rgba(34,197,94,0.3)]">
                                            {t('popular')}
                                        </div>
                                    )}
                                    <h4 className="text-[22px] font-bold mb-4 text-white tracking-tight">{plan.name}</h4>

                                    <div className="flex items-end gap-1 mb-2">
                                        <span className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">RM<span className="px-1">{plan.price}</span></span>
                                        <span className="text-[12px] font-bold uppercase pb-1.5 text-[#64748B]">{t('pricing_per_month')}</span>
                                    </div>

                                    {plan.valueBadge ? (
                                        <div className="flex items-center gap-2 mb-4 h-6">
                                            <span className="inline-flex items-center gap-1.5 bg-[#22C55E]/10 text-[#22C55E] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#22C55E]/20">
                                                <Zap size={10} fill="currentColor" />
                                                {plan.valueBadge}
                                            </span>
                                        </div>
                                    ) : <div className="h-4 mb-4" />}

                                    {plan.roiBadge ? (
                                        <p className="text-[13px] text-[#22C55E] font-medium italic mb-6 h-5">{plan.roiBadge}</p>
                                    ) : <div className="h-5 mb-6" />}

                                    <ul className="space-y-4 mb-10 flex-1">
                                        {plan.features.map((f, i) => (
                                            <li key={i} className="flex items-start gap-3 text-[14px] text-white/90 font-medium">
                                                <div className={`mt-0.5 rounded-full p-0.5 ${plan.popular ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-white/10 text-white'}`}>
                                                    <Check size={12} strokeWidth={3} />
                                                </div>
                                                {f}
                                            </li>
                                        ))}
                                    </ul>

                                    <Link
                                        href={plan.name === t('pricing_free_title') ? '/onboarding' : `/checkout?plan=${plan.name.toUpperCase()}`}
                                        className={`block text-center w-full py-4 rounded-2xl font-bold tracking-wide transition-all active:scale-95 ${plan.popular
                                            ? 'bg-gradient-to-r from-[#22C55E] to-[#14B8A6] text-white shadow-[0_8px_30px_-10px_rgba(34,197,94,0.4)] hover:shadow-[0_8px_40px_-5px_rgba(34,197,94,0.5)] border border-transparent'
                                            : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                                            }`}
                                    >
                                        {plan.cta}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* Guarantee */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="mt-12 flex items-center justify-center gap-2"
                        >
                            <ShieldCheck className="text-[#64748B] w-4 h-4" />
                            <p className="text-[13px] font-medium text-[#64748B]">
                                {t('pricing_guarantee')}
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* 7. Call To Action & Footer */}
                <div id="ready-to-grow" className="relative flex flex-col justify-between bg-[#0F172A] overflow-hidden border-t border-white/5">
                    <section className="flex-1 flex flex-col justify-center px-4 md:px-6 py-24 md:py-32 relative z-10">
                        <div className="max-w-5xl mx-auto w-full relative">
                            {/* CTA Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="bg-gradient-to-br from-[#22C55E] to-[#14B8A6] rounded-[40px] md:rounded-[48px] p-10 md:p-16 text-center text-white relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(34,197,94,0.3)]"
                            >
                                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.05] mix-blend-overlay pointer-events-none" />
                                <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/20 blur-[80px] rounded-full pointer-events-none" />
                                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-black/10 blur-[80px] rounded-full pointer-events-none" />

                                <h3 className="text-3xl md:text-5xl lg:text-[56px] leading-[1.1] font-extrabold mb-6 relative z-10 tracking-[-0.02em]">{t('ready_to_grow')}</h3>
                                <p className="text-lg md:text-[22px] font-medium mb-10 opacity-90 relative z-10 max-w-2xl mx-auto leading-relaxed">{t('join_sellers')}</p>

                                <div className="relative z-10">
                                    <Link href="/onboarding" className="inline-flex items-center justify-center w-full sm:w-auto gap-3 bg-white text-[#0F172A] px-10 h-16 md:h-18 rounded-2xl text-[16px] md:text-lg font-bold hover:bg-slate-50 transition-all shadow-xl active:scale-95 group">
                                        {t('create_store_now')}
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <p className="mt-4 text-[12px] font-medium text-white/80">
                                        <span className="inline-block mr-2">• No credit card required</span>
                                        <span className="inline-block">• Free forever plan available</span>
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </section>

                    <footer className="py-12 border-t border-white/5 px-4 md:px-6 bg-[#071226]">
                        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 md:gap-8">
                            <div className="flex flex-col items-center md:items-start gap-5">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#22C55E] to-[#14B8A6] shadow-sm">
                                        <div className="text-white font-black text-sm leading-none">K</div>
                                    </div>
                                    <span className="text-[20px] font-extrabold tracking-tight text-white">KedaiChat</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <a href="https://facebook.com/kedaichat" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 rounded-xl flex items-center justify-center transition-all">
                                        <Facebook size={18} />
                                    </a>
                                    <a href="https://instagram.com/kedaichat" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 rounded-xl flex items-center justify-center transition-all">
                                        <Instagram size={18} />
                                    </a>
                                    <a href="mailto:kedaichat@gmail.com" className="w-10 h-10 bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 rounded-xl flex items-center justify-center transition-all">
                                        <Mail size={18} />
                                    </a>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 text-[14px] font-medium text-[#64748B]">
                                <Link href="/privacy" className="hover:text-white transition-colors">{t('privacy')}</Link>
                                <Link href="/terms" className="hover:text-white transition-colors">{t('terms')}</Link>
                                <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                                    <span className="text-[#64748B]">{t('contact')}:</span>
                                    <a href="mailto:kedaichat@gmail.com" className="text-white hover:text-[#22C55E] transition-colors flex items-center gap-2 font-bold">
                                        <Mail size={14} className="text-[#22C55E]" />
                                        kedaichat@gmail.com
                                    </a>
                                </div>
                            </div>
                            <p className="text-[12px] font-medium text-[#64748B] text-center md:text-left">© 2026 KedaiChat. {t('all_rights_reserved')}</p>
                        </div>
                    </footer>
                </div>
            </main>
        </div>
    );
}
