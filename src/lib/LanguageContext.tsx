'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ms';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
    en: {
        // Common
        dashboard: 'Dashboard',
        orders: 'Orders',
        products: 'Products',
        customers: 'Customers',
        tools: 'Tools',
        settings: 'Settings',
        sign_out: 'Sign Out',
        save: 'Save Changes',
        loading: 'Loading...',
        back: 'Back',

        // Landing Page
        hero_title: 'Turn your WhatsApp into a',
        hero_subtitle: 'simple online shop',
        hero_desc: 'Organize orders, show your catalog, and track sales from one dashboard. No complex setups, just pure commerce.',
        start_free: 'Start Free',
        how_it_works: 'How it works',
        how_step_1_title: '1. Create Store',
        how_step_1_desc: 'Enter your business name and WhatsApp number to get started in seconds.',
        how_step_2_title: '2. Add Products',
        how_step_2_desc: 'Upload your items with photos and prices. Your catalog is always active.',
        how_step_3_title: '3. Share & Sell',
        how_step_3_desc: 'Send your link to customers. They order via WhatsApp, you manage everything here.',

        problem_title: 'The Problem',
        problem_subtitle: 'Messy WhatsApp Messages?',
        problem_desc: "Managing a business on WhatsApp shouldn't feel like a chore.",

        features: 'Features',
        feature_1_title: 'Digital Catalog',
        feature_1_desc: 'Create a beautiful mobile-friendly catalog. Share your products with a single link.',
        feature_2_title: 'Order Management',
        feature_2_desc: 'Convert messy chats into structured order forms automatically.',
        feature_3_desc: 'Understand your bestsellers and peak hours with real-time reports.',
        feature_4_title: 'Instant Alerts',
        feature_4_desc: 'Get notified the moment a customer places an order.',
        feature_5_title: 'Team Collaboration',
        feature_5_desc: 'Add multiple agents to handle chats and assign roles.',
        feature_6_title: 'Seamless Integrations',
        feature_6_desc: 'Connect with payment gateways and logistics providers easily.',

        problem_1_title: 'Lost Orders',
        problem_1_desc: 'Important orders get buried in endless chat history. Never miss a customer again.',
        problem_2_title: 'Slow Response',
        problem_2_desc: "Customers wait too long for basic price and catalog details while you're busy.",
        problem_3_title: 'Manual Tracking',
        problem_3_desc: "Spreadsheets are a nightmare on mobile. Tracking sales shouldn't be manual work.",

        ready_to_grow: 'Ready to grow your sales?',
        join_sellers: 'Join 2,000+ Malaysian sellers today.',
        create_store_now: 'Create My Store Now',

        pricing_subtitle: 'Choose the perfect plan for your business',
        pricing_title: 'Price',
        pricing_free_title: 'Free',
        pricing_basic_title: 'Basic',
        pricing_pro_title: 'Pro',
        pricing_biz_title: 'Business',
        pricing_per_month: '/ Month',
        popular: 'Most Popular',
        built_for_smes: 'Built for Malaysian SMEs',
        hero_shop_highlight: 'simple online shop',
        three_steps_title: '3 steps to live commerce',
        human_speed_title: 'Designed for human speed',
        all_rights_reserved: 'All rights reserved.',
        price_free_feature_1: '30 orders per month',
        price_free_feature_2: 'Basic dashboard',
        price_free_feature_3: 'Product manager',
        price_basic_feature_1: 'Unlimited orders',
        price_basic_feature_2: 'Group order system',
        price_basic_feature_3: 'Reseller links',
        price_basic_feature_4: 'Repeat order button',
        price_pro_feature_1: 'Analytics dashboard',
        price_pro_feature_2: 'Broadcast tools',
        price_pro_feature_3: 'Advanced reseller system',
        price_pro_feature_4: 'Priority support',
        cta_choose_basic: 'Choose Basic',
        cta_go_pro: 'Go Pro',
        new_order: 'New Order',
        privacy: 'Privacy',
        terms: 'Terms',
        contact: 'Contact',

        // Dashboard
        revenue: 'Revenue Today',
        total_orders: 'Total Orders',
        quick_actions: 'Quick Actions',
        add_product: 'Add Product',
        share_link: 'Share Link',
        analytics: 'Analytics',
        go_pro: 'Go Pro',
        recent_orders: 'Recent Orders',
        paid: 'Paid',

        // Onboarding
        ob_store_name_title: "What's your store name?",
        ob_store_name_desc: "We'll use this for your link",
        ob_store_name_placeholder: "e.g. Ali Nasi Lemak",
        ob_category_title: 'Pick a category',
        ob_category_desc: 'Helps customers find you',
        cat_food: 'Food',
        cat_fashion: 'Fashion',
        cat_grocery: 'Grocery',
        cat_services: 'Services',
        ob_whatsapp_title: 'WhatsApp Number',
        ob_whatsapp_desc: 'For receiving orders',
        ob_password_title: 'Create a Password',
        ob_password_desc: 'To secure your store dashboard',
        ob_continue: 'Continue',
        ob_launching: 'Launching...',
        ob_launch_store: 'Launch My Store',

        // Settings
        store_settings: 'Store Settings',
        biz_identity: 'Business Identity',
        biz_name: 'Business Name',
        store_link: 'Store Link (Slug)',
        whatsapp: 'WhatsApp Number',
        description: 'Description',
        delete_store: 'Delete Store',

        // Store Catalog
        cat_all: 'All',
        cat_rice: 'Rice Items',
        cat_noodles: 'Noodles',
        cat_drinks: 'Drinks',
        cat_desserts: 'Desserts',
        store_open: 'Open • 0.5km away',
        chat: 'Chat',
        view_cart: 'View Cart',

        // Checkout
        checkout_title: 'Checkout',
        scan_pay: 'Scan & Pay',
        secure_qr: 'Secure Bank QR Transfer',
        zoom_qr: 'Zoom QR',
        verified_biz: 'Verified Business',
        submit_proof: "I've Paid - Submit Proof",
        pay_whatsapp: 'Pay via WhatsApp Instead',
        transfer_details: 'Transfer Details',
        account_name: 'Account Name',
        reference_no: 'Reference No.',
        payment_confirmed: 'Payment Confirmed!',
        verifying_payment: 'Verifying Payment...',
        order_prepared: 'Your order is being prepared. You will receive an update via WhatsApp shortly.',
        checking_txn: 'We are checking your transaction. This usually takes less than a minute.',
        track_order: 'Track My Order',

        // Wallet
        your_orders: 'Your Orders',
        delivered: 'Delivered',
        repeat_order: 'Repeat Order',
        order_again: 'Order Again'
    },
    ms: {
        // Common
        dashboard: 'Papan Pemuka',
        orders: 'Pesanan',
        products: 'Produk',
        customers: 'Pelanggan',
        tools: 'Alat',
        settings: 'Tetapan',
        sign_out: 'Log Keluar',
        save: 'Simpan Perubahan',
        loading: 'Memuatkan...',
        back: 'Kembali',

        // Landing Page
        hero_title: 'Tukarkan WhatsApp anda menjadi',
        hero_subtitle: 'kedai dalam talian yang mudah',
        hero_desc: 'Urus pesanan, tunjukkan katalog anda, dan jejak jualan dari satu papan pemuka. Tiada persediaan kompleks, hanya perniagaan tulen.',
        start_free: 'Mula Percuma',
        how_it_works: 'Cara ia berfungsi',
        built_for_smes: 'Dibina untuk PKS Malaysia',
        hero_shop_highlight: 'kedai dalam talian yang mudah',
        three_steps_title: '3 langkah untuk perniagaan langsung',
        human_speed_title: 'Direka untuk kelajuan manusia',
        all_rights_reserved: 'Hak cipta terpelihara.',
        price_free_feature_1: '30 pesanan sebulan',
        price_free_feature_2: 'Papan pemuka asas',
        price_free_feature_3: 'Pengurus produk',
        price_basic_feature_1: 'Pesanan tanpa had',
        price_basic_feature_2: 'Sistem pesanan berkumpulan',
        price_basic_feature_3: 'Pautan ejen',
        price_basic_feature_4: 'Butang pesanan ulangan',
        price_pro_feature_1: 'Papan pemuka analatik',
        price_pro_feature_2: 'Alatan siaran',
        price_pro_feature_3: 'Sistem ejen maju',
        price_pro_feature_4: 'Sokongan utama',
        cta_choose_basic: 'Pilih Basic',
        cta_go_pro: 'Jadi Pro',
        new_order: 'Pesanan Baru',
        privacy: 'Privasi',
        terms: 'Terma',
        contact: 'Hubungi',
        how_step_1_title: '1. Bina Kedai',
        how_step_1_desc: 'Masukkan nama perniagaan dan nombor WhatsApp anda untuk mula dalam beberapa saat.',
        how_step_2_title: '2. Tambah Produk',
        how_step_2_desc: 'Muat naik produk anda dengan gambar dan harga. Katalog anda sentiasa aktif.',
        how_step_3_title: '3. Kongsi & Jual',
        how_step_3_desc: 'Hantar pautan anda kepada pelanggan. Mereka pesan melalui WhatsApp, anda urus semua di sini.',

        problem_title: 'Masalah',
        problem_subtitle: 'Mesej WhatsApp Berselerak?',
        problem_desc: 'Menguruskan perniagaan di WhatsApp sepatutnya tidak terasa seperti beban.',

        features: 'Ciri-ciri',
        feature_1_title: 'Katalog Digital',
        feature_1_desc: 'Bina katalog mesra mudah alih yang indah. Kongsi produk anda dengan satu pautan.',
        feature_2_title: 'Pengurusan Pesanan',
        feature_2_desc: 'Tukarkan sembang berselerak kepada borang pesanan berstruktur secara automatik.',
        feature_3_desc: 'Fahami produk terlaris dan waktu puncak anda dengan laporan masa nyata.',
        feature_4_title: 'Amaran Segera',
        feature_4_desc: 'Dapatkan pemberitahuan sebaik sahaja pelanggan membuat pesanan.',
        feature_5_title: 'Kolaborasi Pasukan',
        feature_5_desc: 'Tambah ramai ejen untuk mengendalikan sembang dan tetapkan peranan.',
        feature_6_title: 'Integrasi Lancar',
        feature_6_desc: 'Sambungkan dengan gerbang pembayaran dan penyedia logistik dengan mudah.',

        problem_1_title: 'Pesanan Hilang',
        problem_1_desc: 'Pesanan penting tertimbus dalam sejarah sembang yang tidak berkesudahan.',
        problem_2_title: 'Respon Lambat',
        problem_2_desc: 'Pelanggan menunggu terlalu lama untuk butiran harga dan katalog.',
        problem_3_title: 'Jejak Manual',
        problem_3_desc: 'Spreedsheet adalah mimpi ngeri di telefon bimbit. Jejak jualan tidak sepatutnya manual.',

        ready_to_grow: 'Sedia untuk tingkatkan jualan anda?',
        join_sellers: 'Sertai 2,000+ penjual Malaysia hari ini.',
        create_store_now: 'Bina Kedai Saya Sekarang',

        pricing_subtitle: 'Pilih pelan yang sesuai untuk perniagaan anda',
        pricing_title: 'Harga',
        pricing_free_title: 'Percuma',
        pricing_basic_title: 'Asas',
        pricing_pro_title: 'Pro',
        pricing_biz_title: 'Perniagaan',
        pricing_per_month: '/ Bulan',
        popular: 'Paling Popular',

        // Dashboard
        revenue: 'Hasil Hari Ini',
        total_orders: 'Jumlah Pesanan',
        quick_actions: 'Tindakan Pantas',
        add_product: 'Tambah Produk',
        share_link: 'Kongsi Pautan',
        analytics: 'Analatik',
        go_pro: 'Jadi Pro',
        recent_orders: 'Pesanan Terkini',
        paid: 'Dibayar',

        // Onboarding
        ob_store_name_title: 'Apakah nama kedai anda?',
        ob_store_name_desc: 'Kami akan gunakan ini untuk pautan anda',
        ob_store_name_placeholder: 'cth. Nasi Lemak Ali',
        ob_category_title: 'Pilih kategori',
        ob_category_desc: 'Membantu pelanggan cari anda',
        cat_food: 'Makanan',
        cat_fashion: 'Fesyen',
        cat_grocery: 'Runcit',
        cat_services: 'Perkhidmatan',
        ob_whatsapp_title: 'Nombor WhatsApp',
        ob_whatsapp_desc: 'Untuk menerima pesanan',
        ob_password_title: 'Cipta Kata Laluan',
        ob_password_desc: 'Untuk menjamin papan pemuka kedai anda',
        ob_continue: 'Seterusnya',
        ob_launching: 'Melancarkan...',
        ob_launch_store: 'Lancar Kedai Saya',

        // Settings
        store_settings: 'Tetapan Kedai',
        biz_identity: 'Identiti Perniagaan',
        biz_name: 'Nama Perniagaan',
        store_link: 'Pautan Kedai (Slug)',
        whatsapp: 'Nombor WhatsApp',
        description: 'Penerangan',
        delete_store: 'Padam Kedai',

        // Store Catalog
        cat_all: 'Semua',
        cat_rice: 'Nasi',
        cat_noodles: 'Mi',
        cat_drinks: 'Minuman',
        cat_desserts: 'Pencuci Mulut',
        store_open: 'Buka • 0.5km jauh',
        chat: 'Sembang',
        view_cart: 'Lihat Troli',

        // Checkout
        checkout_title: 'Daftar Keluar',
        scan_pay: 'Imbas & Bayar',
        secure_qr: 'Pindahan QR Bank Selamat',
        zoom_qr: 'Zum QR',
        verified_biz: 'Perniagaan Sah',
        submit_proof: 'Saya Telah Bayar - Hantar Bukti',
        pay_whatsapp: 'Bayar melalui WhatsApp',
        transfer_details: 'Butiran Pindahan',
        account_name: 'Nama Akaun',
        reference_no: 'No. Rujukan',
        payment_confirmed: 'Pembayaran Disahkan!',
        verifying_payment: 'Mengesahkan Pembayaran...',
        order_prepared: 'Pesanan anda sedang disediakan. Anda akan menerima kemas kini melalui WhatsApp sebentar lagi.',
        checking_txn: 'Kami sedang menyemak transaksi anda. Ini biasanya mengambil masa kurang dari seminit.',
        track_order: 'Jejak Pesanan Saya',

        // Wallet
        your_orders: 'Pesanan Anda',
        delivered: 'Dihantar',
        repeat_order: 'Ulang Pesanan',
        order_again: 'Pesan Lagi'
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        console.log('LanguageProvider mounted');
        const saved = localStorage.getItem('kd_lang');
        if (saved === 'en' || saved === 'ms') {
            setLanguage(saved);
        }
        setMounted(true);
    }, []);

    const setLanguageAndStore = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('kd_lang', lang);
    };

    const t = (key: string) => {
        const lang = language as Language;
        return translations[lang][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: setLanguageAndStore, t }}>
            {!mounted ? (
                <div style={{ visibility: 'hidden' }}>{children}</div>
            ) : (
                children
            )}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
