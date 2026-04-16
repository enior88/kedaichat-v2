'use client';

import React, { useState, useEffect } from 'react';
import { Share2, Users, Send, ChevronRight, TrendingUp, Loader2, Info, Trash2, XCircle } from 'lucide-react';
import BottomNav from './BottomNav';

export default function ResellerGroupDashboard() {
    const [activeTab, setActiveTab] = useState('Resellers');
    const [storeInfo, setStoreInfo] = useState<any>(null);
    const [resellers, setResellers] = useState<any[]>([]);
    const [groupOrders, setGroupOrders] = useState<any[]>([]);
    const [showNewSessionModal, setShowNewSessionModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [generatedLink, setGeneratedLink] = useState('');
    const [resellerName, setResellerName] = useState('');
    const [sessionForm, setSessionForm] = useState({ title: '', deadline: '', pickupTime: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const tabs = ['Resellers', 'Group Orders'];

    const fetchGroupOrders = () => {
        fetch('/api/group-orders')
            .then(res => res.json())
            .then(data => {
                if (!data.error) setGroupOrders(data);
            });
    };

    const fetchResellers = () => {
        fetch('/api/resellers')
            .then(res => res.json())
            .then(data => {
                if (!data.error && Array.isArray(data)) setResellers(data);
            });
    };

    useEffect(() => {
        fetch('/api/dashboard')
            .then(res => res.json())
            .then(data => {
                if (!data.error) setStoreInfo(data);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));

        fetchGroupOrders();
        fetchResellers();
    }, []);

    const handleGenerateInvite = async () => {
        if (!resellerName.trim()) return;
        setIsSaving(true);
        const res = await fetch('/api/resellers', {
            method: 'POST',
            body: JSON.stringify({ name: resellerName })
        });
        if (res.ok) {
            const data = await res.json();
            const link = `${window.location.origin}/shop/${storeInfo?.slug}?ref=${data.refCode}`;
            setGeneratedLink(link);
            fetchResellers();
        }
        setIsSaving(false);
    };

    const handleCreateSession = async () => {
        setIsSaving(true);
        const res = await fetch('/api/group-orders', {
            method: 'POST',
            body: JSON.stringify(sessionForm)
        });
        if (res.ok) {
            setShowNewSessionModal(false);
            setSessionForm({ title: '', deadline: '', pickupTime: '' });
            fetchGroupOrders();
        }
        setIsSaving(false);
    };

    const handleUpdateSession = async (inviteCode: string, data: any) => {
        setIsSaving(true);
        const res = await fetch(`/api/group-orders/${inviteCode}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
        if (res.ok) fetchGroupOrders();
        setIsSaving(false);
    };

    const handleDeleteSession = async (inviteCode: string) => {
        if (!confirm('Are you sure you want to delete this session? All participation data will be lost.')) return;
        setIsSaving(true);
        const res = await fetch(`/api/group-orders/${inviteCode}`, {
            method: 'DELETE'
        });
        if (res.ok) fetchGroupOrders();
        setIsSaving(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#25D366]" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-32 font-inter">
            {/* Conditional Content Gating */}
            {(storeInfo?.plan === 'FREE' && !storeInfo.isAdmin) ? (
                <div className="flex flex-col min-h-[80vh]">
                    {/* Simplified Header for Free Users */}
                    <div className="bg-white px-6 py-8 shadow-sm text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Network</h1>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">{storeInfo?.businessName || 'KedaiChat'}</p>
                    </div>

                    <div className="flex-1 p-8 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-700">
                        <div className="w-28 h-28 bg-green-50 rounded-[40px] flex items-center justify-center mb-8 text-[#25D366] shadow-2xl shadow-green-100/50 rotate-3 transition-transform hover:rotate-0">
                            <Users size={56} strokeWidth={2.5} />
                        </div>

                        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
                            Scale your business <br /> with Resellers.
                        </h2>

                        <p className="text-gray-500 font-bold mb-10 max-w-[280px] leading-relaxed mx-auto text-sm">
                            Invite regulars to sell for you and manage group orders seamlessly. These are premium features.
                        </p>

                        <button
                            onClick={() => window.location.href = '/billing'}
                            className="w-full max-w-xs bg-[#25D366] text-white py-5 rounded-[24px] font-black uppercase tracking-widest shadow-2xl shadow-green-200 active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                            Upgrade to Basic <ChevronRight size={20} />
                        </button>

                        <p className="mt-10 text-[10px] font-black text-gray-300 uppercase tracking-[4px]">
                            Professional Edition Required
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Header & Tabs */}
                    <div className="bg-white px-6 pt-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Network</h1>
                                <p className="text-xs text-gray-400 font-medium">{storeInfo?.businessName || 'Your Store'}</p>
                            </div>
                            <div className="bg-green-50 px-3 py-1 rounded-full flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-[#25D366] rounded-full animate-pulse" />
                                <span className="text-[10px] font-black text-[#25D366] uppercase tracking-wider">Live</span>
                            </div>
                        </div>

                        <div className="flex bg-gray-50 p-1.5 rounded-[20px] mb-4">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 py-3 text-sm font-bold rounded-[16px] transition-all ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 max-w-lg mx-auto">
                        {activeTab === 'Resellers' ? (
                            <div className="space-y-6 text-gray-900">
                                {/* Commission Card */}
                                <div className="bg-[#25D366] rounded-[28px] p-6 text-white shadow-xl shadow-green-100 relative overflow-hidden">
                                    <div className="relative z-10">
                                        <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mb-1">Total Commission Owed</p>
                                        <h2 className="text-3xl font-black mb-4">RM {(storeInfo?.revenueToday * 0.1 || 0).toFixed(2)}</h2>
                                        <div className="flex items-center gap-2 bg-white/20 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm">
                                            <TrendingUp size={14} />
                                            <span className="text-[10px] font-bold">Calculated at 10% rate</span>
                                        </div>
                                    </div>
                                    <Users className="absolute -right-6 -bottom-6 text-white/10 w-36 h-36 rotate-12" />
                                </div>

                                {/* Tip/Info */}
                                <div className="flex gap-3 p-4 bg-orange-50 rounded-2xl border border-orange-100 italic text-[11px] text-orange-700 leading-relaxed font-medium">
                                    <Info size={16} className="shrink-0" />
                                    Invite your regulars to become resellers! They earn commission while you get more orders automatically.
                                </div>

                                {/* Reseller List */}
                                <div>
                                    <div className="flex justify-between items-center mb-4 text-gray-900">
                                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Resellers</h3>
                                        <span className="text-[10px] font-bold text-[#25D366]">{resellers.length} Active</span>
                                    </div>
                                    <div className="space-y-3">
                                        {resellers.length === 0 ? (
                                            <p className="text-center text-sm font-bold text-gray-300 py-6">No resellers yet. Generate an invite link below!</p>
                                        ) : resellers.map((reseller) => (
                                            <div key={reseller.id} className="bg-white border border-gray-100 rounded-[24px] p-4 flex justify-between items-center shadow-xs hover:border-[#25D366]/30 transition-all cursor-pointer group">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center font-bold text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-all">
                                                        {reseller.name[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">{reseller.name}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{reseller.commissions?.length || 0} Orders Generated</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-black text-gray-400 font-mono text-xs">#{reseller.refCode}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Ref Code</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => { setShowInviteModal(true); setGeneratedLink(''); setResellerName(''); }}
                                    className="w-full h-14 bg-[#25D366] text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-green-100 active:scale-95 transition-all">
                                    <Share2 size={20} />
                                    Generate Reseller Invite Link
                                </button>

                                {/* Invite Link Modal */}
                                {showInviteModal && (
                                    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                                        <div className="absolute inset-0" onClick={() => setShowInviteModal(false)} />
                                        <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl relative z-10 animate-in slide-in-from-bottom-8 duration-300">
                                            <div className="flex justify-between items-center mb-6">
                                                <h2 className="text-xl font-bold text-gray-900">{generatedLink ? 'Share This Link' : 'New Reseller Invite'}</h2>
                                                <button onClick={() => setShowInviteModal(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold hover:bg-gray-200">
                                                    ✕
                                                </button>
                                            </div>

                                            {!generatedLink ? (
                                                <div className="space-y-4">
                                                    <p className="text-sm text-gray-400 font-medium">Enter the name of the person you want to invite as a reseller.</p>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Ali Hassan"
                                                        className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                                                        value={resellerName}
                                                        onChange={e => setResellerName(e.target.value)}
                                                    />
                                                    <button
                                                        disabled={!resellerName.trim() || isSaving}
                                                        onClick={handleGenerateInvite}
                                                        className="w-full h-13 bg-[#25D366] text-white font-black rounded-2xl shadow-lg shadow-green-100 active:scale-95 transition-all py-4 disabled:opacity-50"
                                                    >
                                                        {isSaving ? 'Generating...' : 'Generate Link'}
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <p className="text-sm text-gray-500 font-medium">Share this unique link with <span className="font-black text-gray-900">{resellerName}</span> via WhatsApp.</p>
                                                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                                        <p className="text-xs font-mono text-gray-600 break-all">{generatedLink}</p>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <button
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(generatedLink);
                                                                alert('Link copied!');
                                                            }}
                                                            className="h-13 bg-gray-900 text-white font-black rounded-2xl active:scale-95 transition-all py-3 text-sm"
                                                        >
                                                            Copy Link
                                                        </button>
                                                        <a
                                                            href={`https://wa.me/?text=${encodeURIComponent(`Join as my reseller and earn commission! Use this link: ${generatedLink}`)}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="h-13 bg-[#25D366] text-white font-black rounded-2xl active:scale-95 transition-all py-3 text-sm flex items-center justify-center gap-2"
                                                        >
                                                            Share on WhatsApp
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4 text-gray-900">
                                {/* Group Orders List */}
                                {groupOrders.length === 0 && (
                                    <div className="p-8 text-center text-gray-400 bg-white/50 border-2 border-dashed border-gray-200 rounded-[32px]">
                                        <p className="text-sm font-bold">No active sessions.</p>
                                        <button
                                            onClick={() => setShowNewSessionModal(true)}
                                            className="mt-4 px-6 py-2 bg-white border border-gray-200 rounded-full text-xs font-black text-gray-900 hover:border-[#25D366] transition-all shadow-sm"
                                        >
                                            Start New Session
                                        </button>
                                    </div>
                                )}

                                {groupOrders.map((session) => (
                                    <div key={session.id} className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm relative overflow-hidden">
                                        {session.status === 'ACTIVE' && (
                                            <div className="absolute top-0 right-0 bg-[#25D366] text-white text-[9px] font-black px-4 py-1 rounded-bl-2xl uppercase tracking-widest shadow-sm">
                                                Active
                                            </div>
                                        )}
                                        {session.status === 'CLOSED' && (
                                            <div className="absolute top-0 right-0 bg-gray-500 text-white text-[9px] font-black px-4 py-1 rounded-bl-2xl uppercase tracking-widest shadow-sm">
                                                Closed
                                            </div>
                                        )}
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-black text-gray-900 text-lg leading-tight">{session.title}</h3>
                                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter mt-1">
                                                    Deadline: {new Date(session.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Pickup: {session.pickupTime}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleDeleteSession(session.inviteCode)}
                                                    className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all"
                                                    title="Delete Session"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                <div className={`p-2 rounded-xl ${session.status === 'ACTIVE' ? 'bg-green-50 text-[#25D366]' : 'bg-gray-50 text-gray-400'}`}>
                                                    <TrendingUp size={22} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mb-6 items-center">
                                            <div className="flex-1 font-medium text-xs text-gray-500 flex items-center gap-2">
                                                <Users size={14} className="text-[#25D366]" />
                                                <span className="font-bold text-gray-900">{session.totalItems} Items Submitted</span>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const url = `${window.location.origin}/group/${session.inviteCode}`;
                                                    navigator.clipboard.writeText(url);
                                                    alert('Invite link copied! Share it on WhatsApp.');
                                                }}
                                                className="text-[10px] text-[#25D366] font-black uppercase bg-green-50 px-2 py-1 rounded-md"
                                            >
                                                Copy Invite Link
                                            </button>
                                            {session.status === 'ACTIVE' && (
                                                <button
                                                    onClick={() => handleUpdateSession(session.inviteCode, { status: 'CLOSED' })}
                                                    className="text-[10px] text-orange-500 font-black uppercase bg-orange-50 px-2 py-1 rounded-md flex items-center gap-1"
                                                >
                                                    <XCircle size={12} /> Close Early
                                                </button>
                                            )}
                                        </div>

                                        {session.status === 'ACTIVE' && (
                                            <button
                                                onClick={async () => {
                                                    setIsSaving(true);
                                                    try {
                                                        const res = await fetch(`/api/group-orders/${session.inviteCode}/push`, { method: 'POST' });
                                                        const data = await res.json();
                                                        if (data.success) {
                                                            // Save to local wallet
                                                            const storePhone = storeInfo?.whatsappNumber || '60128556781';
                                                            const myOrders = JSON.parse(localStorage.getItem('kd_my_orders') || '[]');
                                                            myOrders.push({
                                                                ...data.order,
                                                                storeName: storeInfo?.businessName || 'Group Order',
                                                                storeSlug: '',
                                                                whatsappNumber: storePhone
                                                            });
                                                            localStorage.setItem('kd_my_orders', JSON.stringify(myOrders));

                                                            // Auto open WhatsApp Link
                                                            let text = `*Group Order - ${session.title}*\n\n`;
                                                            text += `Total: *RM ${(data.order.total || 0).toFixed(2)}*\n\n`;
                                                            text += `_Please verify my payment attached._`;
                                                            const encodedText = encodeURIComponent(text);
                                                            const phone = storePhone.replace(/\D/g, '');
                                                            const link = `https://wa.me/${phone}?text=${encodedText}`;

                                                            window.open(link, '_blank');
                                                            fetchGroupOrders();
                                                        } else {
                                                            alert(data.error || 'Failed to push order');
                                                        }
                                                    } catch (err) {
                                                    } finally {
                                                        setIsSaving(false);
                                                    }
                                                }}
                                                disabled={isSaving}
                                                className="w-full h-12 bg-gray-900 text-white font-black rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all text-xs uppercase tracking-widest shadow-md disabled:opacity-50"
                                            >
                                                <Send size={16} />
                                                Finalize & Push Combined Order
                                            </button>
                                        )}
                                    </div>
                                ))}

                                {groupOrders.length > 0 && (
                                    <button
                                        onClick={() => setShowNewSessionModal(true)}
                                        className="w-full mt-4 px-6 py-4 bg-white border-2 border-dashed border-gray-200 rounded-3xl text-xs font-black text-gray-400 hover:border-[#25D366] hover:text-[#25D366] transition-all"
                                    >
                                        + Start Another Group Order Session
                                    </button>
                                )}
                            </div>
                        )}

                        {/* New Session Modal */}
                        {showNewSessionModal && (
                            <div className="fixed object-contain h-full z-50 flex items-end justify-center sm:items-center inset-0 px-0 sm:px-4 bg-black/60 backdrop-blur-md transition-all animate-in fade-in duration-300">
                                <div className="absolute inset-0 max-w-md mx-auto" onClick={() => setShowNewSessionModal(false)} />
                                <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl relative z-10 animate-in slide-in-from-bottom-8 duration-300">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-gray-900">New Group Order</h2>
                                        <button onClick={() => setShowNewSessionModal(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold text-sm hover:bg-gray-200">
                                            ✕
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Session Title</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Friday Office Lunch"
                                                className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                                                value={sessionForm.title}
                                                onChange={e => setSessionForm({ ...sessionForm, title: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Order Deadline</label>
                                                <input
                                                    type="datetime-local"
                                                    className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                                                    value={sessionForm.deadline}
                                                    onChange={e => setSessionForm({ ...sessionForm, deadline: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Expected Pickup</label>
                                                <input
                                                    type="time"
                                                    className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                                                    value={sessionForm.pickupTime}
                                                    onChange={e => setSessionForm({ ...sessionForm, pickupTime: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <button
                                            disabled={!sessionForm.title || !sessionForm.deadline || !sessionForm.pickupTime || isSaving}
                                            onClick={handleCreateSession}
                                            className="w-full h-14 bg-[#25D366] text-white font-black rounded-2xl shadow-lg shadow-green-100 active:scale-95 transition-all mt-4 disabled:opacity-50"
                                        >
                                            {isSaving ? 'Creating...' : 'Create Session'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}


        </div>
    );

}
