'use client';

import React, { useState, useEffect } from 'react';
import {
    ChevronLeft,
    Store,
    MessageSquare,
    Globe,
    ShieldCheck,
    Camera,
    Save,
    Trash2,
    Lock
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import BottomNav from './BottomNav';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';

export default function Settings() {
    const router = useRouter();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [formData, setFormData] = useState({
        businessName: '',
        whatsappNumber: '',
        slug: '',
        description: '',
        storeLogo: '', // Base64 string
        paymentQrUrl: ''
    });

    const [passFormData, setPassFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passChanging, setPassChanging] = useState(false);
    const [passError, setPassError] = useState('');
    const [passSuccess, setPassSuccess] = useState(false);

    useEffect(() => {
        // Fetch current settings
        fetch('/api/dashboard')
            .then(res => res.json())
            .then(data => {
                if (!data.error) {
                    setFormData({
                        businessName: data.businessName || '',
                        whatsappNumber: data.whatsappNumber || '',
                        slug: data.slug || '',
                        description: data.description || 'Welcome to my store!',
                        storeLogo: data.storeLogo || '',
                        paymentQrUrl: data.paymentQrUrl || ''
                    });
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch('/api/store', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            } else {
                alert('Save failed.');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async () => {
        if (passFormData.newPassword !== passFormData.confirmPassword) {
            setPassError("New passwords don't match");
            return;
        }
        if (passFormData.newPassword.length < 6) {
            setPassError("Password must be at least 6 characters");
            return;
        }

        setPassChanging(true);
        setPassError('');
        try {
            const res = await fetch('/api/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passFormData.currentPassword,
                    newPassword: passFormData.newPassword
                })
            });
            const data = await res.json();
            if (res.ok) {
                setPassSuccess(true);
                setPassFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setTimeout(() => setPassSuccess(false), 3000);
            } else {
                setPassError(data.error || 'Update failed');
            }
        } catch (err) {
            setPassError('Connection error');
        } finally {
            setPassChanging(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/logout', { method: 'POST' });
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleDeleteStore = async () => {
        const confirmDelete = window.confirm(
            "ARE YOU ABSOLUTELY SURE?\n\nThis will permanently delete your store, all products, and all order history. This action cannot be undone."
        );

        if (!confirmDelete) return;

        const doubleConfirm = window.prompt("To confirm deletion, please type 'DELETE' below:");
        if (doubleConfirm !== 'DELETE') {
            alert("Deletion cancelled. Confirmation text did not match.");
            return;
        }

        setSaving(true);
        try {
            const res = await fetch('/api/store', { method: 'DELETE' });
            if (res.ok) {
                alert("Store deleted successfully. Redirecting...");
                router.push('/onboarding');
            } else {
                const data = await res.json();
                alert(data.error || 'Deletion failed');
            }
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Connection error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#25D366] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-24 font-inter">
            <div className="bg-white px-6 pt-12 pb-6 shadow-sm rounded-b-[40px]">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="bg-gray-100 p-3 rounded-2xl active:scale-95 transition-all text-gray-500"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">{t('settings')}</h1>
                    </div>
                    <LanguageToggle />
                </div>

                {/* Profile Header */}
                <div className="flex flex-col items-center">
                    <div className="relative group">
                        <label className="cursor-pointer">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setFormData(prev => ({ ...prev, storeLogo: reader.result as string }));
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                            <div className="w-24 h-24 bg-green-50 rounded-[32px] flex items-center justify-center border-2 border-dashed border-[#25D366] overflow-hidden">
                                {formData.storeLogo ? (
                                    <img src={formData.storeLogo} alt="Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <Store className="text-[#25D366]" size={40} />
                                )}
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-gray-900 text-white p-2.5 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer">
                                <Camera size={16} />
                            </div>
                        </label>
                    </div>
                    <div className="text-center mt-4">
                        <h2 className="text-xl font-bold text-gray-900">{formData.businessName}</h2>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Free Tier Account</p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {showSuccess && (
                    <div className="bg-green-50 border border-green-100 p-4 rounded-2xl text-[#25D366] text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
                        <ShieldCheck size={16} />
                        {t('save')}
                    </div>
                )}

                {/* Form Group */}
                <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-1">{t('biz_identity')}</h3>

                    <div className="premium-card space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block ml-1">{t('biz_name')}</label>
                            <div className="relative">
                                <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                <input
                                    type="text"
                                    value={formData.businessName}
                                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                    className="w-full h-14 bg-gray-50 rounded-2xl pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-[#25D366] transition-all outline-none border-transparent"
                                    placeholder="e.g. Ali Nasi Lemak"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block ml-1">{t('store_link')}</label>
                            <div className="relative">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s/g, '-') })}
                                    className="w-full h-14 bg-gray-50 rounded-2xl pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-[#25D366] transition-all outline-none border-transparent"
                                    placeholder="ali-nasi-lemak"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-300 uppercase">
                                    .kedaichat.online
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block ml-1">{t('whatsapp')}</label>
                            <div className="relative">
                                <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                <input
                                    type="text"
                                    value={formData.whatsappNumber}
                                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                                    className="w-full h-14 bg-gray-50 rounded-2xl pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-[#25D366] transition-all outline-none border-transparent"
                                    placeholder="60123456789"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-4">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-1">Store Presence</h3>
                    <div className="premium-card">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block ml-1">{t('description')}</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full min-h-[100px] bg-gray-50 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#25D366] transition-all outline-none border-transparent resize-none"
                                placeholder="Describe your business..."
                            />
                        </div>
                    </div>
                </div>

                {/* Payment Settings Section */}
                <div className="space-y-4 pt-4">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-1">Payment Settings</h3>
                    <div className="premium-card">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block ml-1">Bank / DuitNow QR Code</label>

                            <div className="flex flex-col items-center gap-4">
                                <label className="cursor-pointer w-full group relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const formData = new FormData();
                                                formData.append('file', file);

                                                try {
                                                    const res = await fetch('/api/upload', {
                                                        method: 'POST',
                                                        body: formData
                                                    });
                                                    const data = await res.json();
                                                    if (data.success) {
                                                        setFormData(prev => ({ ...prev, paymentQrUrl: data.fileUrl }));
                                                    } else {
                                                        alert(data.error);
                                                    }
                                                } catch (err) {
                                                    console.error(err);
                                                    alert('Upload failed');
                                                }
                                            }
                                        }}
                                    />
                                    <div className="w-full aspect-square max-w-[200px] mx-auto bg-gray-50 rounded-[32px] flex items-center justify-center border-2 border-dashed border-gray-200 overflow-hidden group-hover:bg-gray-100 transition-colors">
                                        {formData.paymentQrUrl ? (
                                            <img src={formData.paymentQrUrl} alt="Payment QR" className="w-full h-full object-contain p-2" />
                                        ) : (
                                            <div className="text-center text-gray-400 flex flex-col items-center">
                                                <Camera size={32} className="mb-2 opacity-50" />
                                                <span className="text-xs font-bold uppercase tracking-wider">Upload QR</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute right-0 bottom-0 bg-gray-900 text-white p-2.5 rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera size={16} />
                                    </div>
                                </label>
                                <p className="text-xs text-gray-400 text-center font-medium px-4">
                                    This QR code will be shown to customers during checkout.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Section */}
                <div className="space-y-4 pt-4">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-1 text-orange-400">Security & Password</h3>
                    <div className="premium-card space-y-4">
                        {passSuccess && (
                            <div className="p-4 bg-green-50 text-[#25D366] text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center gap-2">
                                <ShieldCheck size={14} /> Password updated successfully
                            </div>
                        )}
                        {passError && (
                            <div className="p-4 bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-2xl">
                                {passError}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block ml-1">Current Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                <input
                                    type="password"
                                    value={passFormData.currentPassword}
                                    onChange={(e) => setPassFormData({ ...passFormData, currentPassword: e.target.value })}
                                    className="w-full h-14 bg-gray-50 rounded-2xl pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-orange-200 transition-all outline-none border-transparent"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block ml-1">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                <input
                                    type="password"
                                    value={passFormData.newPassword}
                                    onChange={(e) => setPassFormData({ ...passFormData, newPassword: e.target.value })}
                                    className="w-full h-14 bg-gray-50 rounded-2xl pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-[#25D366] transition-all outline-none border-transparent"
                                    placeholder="Minimum 6 characters"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block ml-1">Confirm New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                <input
                                    type="password"
                                    value={passFormData.confirmPassword}
                                    onChange={(e) => setPassFormData({ ...passFormData, confirmPassword: e.target.value })}
                                    className="w-full h-14 bg-gray-50 rounded-2xl pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-[#25D366] transition-all outline-none border-transparent"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handlePasswordChange}
                            disabled={passChanging || !passFormData.currentPassword || !passFormData.newPassword}
                            className="w-full h-12 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black active:scale-95 transition-all disabled:opacity-30 disabled:active:scale-100"
                        >
                            {passChanging ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </div>

                <div className="pt-6 space-y-4">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full h-16 bg-[#25D366] text-white font-black rounded-[24px] flex items-center justify-center gap-2 shadow-2xl shadow-green-200 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {saving ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                {t('save')}
                                <Save size={20} />
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full h-16 bg-white text-gray-600 font-black rounded-[24px] flex items-center justify-center gap-2 border border-gray-100 shadow-sm active:scale-95 transition-all"
                    >
                        {t('sign_out')}
                    </button>

                    <button
                        onClick={handleDeleteStore}
                        className="w-full h-16 bg-white text-red-500 font-bold text-xs rounded-[24px] flex items-center justify-center gap-2 border border-red-50 active:scale-95 transition-all uppercase tracking-widest hover:bg-red-50"
                    >
                        <Trash2 size={16} />
                        {t('delete_store')}
                    </button>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
