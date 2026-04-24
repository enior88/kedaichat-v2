'use client';

import { useState, useEffect } from 'react';
import TabNavigation from '@/components/TabNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Send, RefreshCw, BarChart3, Globe } from 'lucide-react';

export default function AdminMarketingPage() {
    const [articles, setArticles] = useState<any[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const res = await fetch('/api/admin/platform-articles');
            const data = await res.json();
            setArticles(data.articles || []);
        } catch (error) {
            console.error("Failed to fetch articles");
        } finally {
            setLoading(false);
        }
    };

    const runPlatformAgent = async () => {
        setIsGenerating(true);
        try {
            const res = await fetch('/api/cron/platform-agent?key=kedaichat_agent_secret_2026');
            await fetchArticles();
        } catch (error) {
            alert("Generation failed");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F172A] text-white p-6 md:p-12">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent italic tracking-tight">
                            Platform Command Center
                        </h1>
                        <p className="text-slate-400 mt-2">Grow kedaichat.online marketing through 24/7 AI-driven content.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={runPlatformAgent}
                            disabled={isGenerating}
                            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:scale-105 transition-all shadow-lg shadow-indigo-500/20"
                        >
                            {isGenerating ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                            Run Growth Agent
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-[#1E293B] border-slate-800 text-white shadow-xl hover:border-indigo-500/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Daily Reach</CardTitle>
                            <Globe className="h-4 w-4 text-indigo-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+12,450</div>
                            <p className="text-xs text-green-400 mt-1">↑ 18% from last week</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-[#1E293B] border-slate-800 text-white shadow-xl hover:border-purple-500/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">AI Content Efficiency</CardTitle>
                            <Sparkles className="h-4 w-4 text-purple-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">98.2%</div>
                            <p className="text-xs text-slate-400 mt-1">Average engagement score</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-[#1E293B] border-slate-800 text-white shadow-xl hover:border-blue-500/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Lead Conversion</CardTitle>
                            <BarChart3 className="h-4 w-4 text-blue-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">4.8%</div>
                            <p className="text-xs text-green-400 mt-1">↑ 0.5% optimization shift</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Content Area */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Send className="h-5 w-5 text-indigo-400" />
                            Recent Growth Updates
                        </h2>
                    </div>

                    <div className="grid gap-6">
                        {loading ? (
                            <div className="flex justify-center p-20">
                                <RefreshCw className="h-10 w-10 text-indigo-500 animate-spin" />
                            </div>
                        ) : articles.length === 0 ? (
                            <div className="text-center p-20 bg-[#1E293B] rounded-2xl border-2 border-dashed border-slate-800 text-slate-500">
                                No articles generated yet. Click "Run Growth Agent" to start.
                            </div>
                        ) : (
                            articles.map((article) => (
                                <Card key={article.id} className="bg-[#1E293B] border-slate-800 text-white overflow-hidden group hover:border-indigo-500/30 transition-all shadow-2xl">
                                    <div className="md:flex">
                                        <div className="md:w-1/3 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-center">
                                            <Badge className="w-fit mb-3 bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                                                {article.category}
                                            </Badge>
                                            <h3 className="text-xl font-bold mb-4 line-clamp-2">{article.title}</h3>
                                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                                <span>📅 {new Date(article.createdAt).toLocaleDateString()}</span>
                                                <Badge variant="outline" className={article.status === 'PUBLISHED' ? 'border-green-500 text-green-500' : 'border-amber-500 text-amber-500'}>
                                                    {article.status}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="md:w-2/3 p-6 flex flex-col justify-between">
                                            <p className="text-slate-400 text-sm italic line-clamp-4 mb-6 leading-relaxed">
                                                "{article.content}"
                                            </p>
                                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/50">
                                                <Button variant="outline" className="text-slate-300 border-slate-700 hover:bg-slate-800">Edit Draft</Button>
                                                <Button className="bg-indigo-600 hover:bg-indigo-500">Blast to FB/IG</Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
