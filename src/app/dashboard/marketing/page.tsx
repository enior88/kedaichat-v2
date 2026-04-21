'use client';

import React, { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Zap,
    Copy,
    Check,
    Share2,
    RefreshCw,
    MessageCircle,
    Instagram,
    Facebook
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';

export default function MarketingPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState<any[]>([]);
    const [latestPost, setLatestPost] = useState<any>(null);
    const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

    const generateContent = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/marketing/generate', { method: 'POST' });
            const data = await res.json();
            if (!res.ok) {
                const errorMessage = data.error || data.details || 'Unknown server error';
                throw new Error(errorMessage);
            }
            setLatestPost(data);
            // Refresh history
            fetchHistory();
        } catch (error: any) {
            console.error('Generation failed:', error);
            alert(`Marketing Agent Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await fetch('/api/marketing/history');
            const data = await res.json();
            setPosts(data);
        } catch (error) {
            console.error('Failed to fetch history');
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedPostId(id);
        setTimeout(() => setCopiedPostId(null), 2000);
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-24 font-inter max-w-md mx-auto shadow-2xl relative">
            {/* Header */}
            <div className="bg-white px-6 pt-12 pb-6 sticky top-0 z-20 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-900 active:scale-90 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-black tracking-tight">Marketing Toolkit</h1>
                        <p className="text-[10px] font-bold text-gray-400 border-t-0 p-0 m-0 uppercase tracking-widest">AI Growth Agent</p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Generate Action */}
                <section className="bg-gray-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-2">Need a Viral Post?</h3>
                        <p className="text-gray-400 text-xs mb-8 leading-relaxed">Let AI scan your best products and write a high-converting caption for your WhatsApp Status or Social Media.</p>
                        <button
                            onClick={generateContent}
                            disabled={loading}
                            className={`w-full bg-[#25D366] text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-green-500/20`}
                        >
                            {loading ? <RefreshCw className="animate-spin" /> : <Zap size={20} fill="currentColor" />}
                            {loading ? 'Generating...' : 'Generate New Assets'}
                        </button>
                    </div>
                    <Zap className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5 rotate-12" />
                </section>

                {/* Latest Result */}
                {latestPost && (
                    <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-1">Latest Generative Result</h3>
                        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase block mb-2">Headline</label>
                                <p className="text-lg font-black text-gray-900">{latestPost.headline}</p>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase block mb-2">Caption (WhatsApp/Social)</label>
                                <div className="bg-gray-50 rounded-2xl p-4 relative group">
                                    <p className="text-sm font-medium text-gray-700 whitespace-pre-wrap">{latestPost.caption}{'\n\n'}{latestPost.hashtags.join(' ')}</p>
                                    <button
                                        onClick={() => copyToClipboard(latestPost.caption + '\n\n' + latestPost.hashtags.join(' '), 'latest')}
                                        className="absolute top-2 right-2 p-2 bg-white rounded-lg shadow-sm text-gray-400 hover:text-gray-900 transition-colors"
                                    >
                                        {copiedPostId === 'latest' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <button className="bg-green-50 text-[#25D366] p-3 rounded-xl flex items-center justify-center gap-2 text-xs font-black">
                                    <MessageCircle size={16} /> WhatsApp
                                </button>
                                <button className="bg-blue-50 text-blue-500 p-3 rounded-xl flex items-center justify-center gap-2 text-xs font-black">
                                    <Facebook size={16} /> Facebook
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                {/* History */}
                <section>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-1 mb-4">Past Marketing Posts</h3>
                    {posts.length === 0 && !loading && (
                        <div className="text-center py-12 bg-white rounded-[32px] border border-dashed border-gray-100">
                            <p className="text-sm font-bold text-gray-300">No history yet.</p>
                        </div>
                    )}
                    <div className="space-y-4">
                        {posts.map((post: any) => (
                            <div key={post.id} className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-50 space-y-3">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-sm font-black text-gray-900">{post.headline}</h4>
                                    <span className="text-[9px] font-bold text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-xs text-gray-500 truncate">{post.caption}</p>
                                <button
                                    onClick={() => copyToClipboard(post.caption, post.id)}
                                    className="text-[10px] font-black text-[#25D366] flex items-center gap-1.5"
                                >
                                    {copiedPostId === post.id ? <Check size={12} /> : <Copy size={12} />}
                                    {copiedPostId === post.id ? 'Copied' : 'Copy Caption'}
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
