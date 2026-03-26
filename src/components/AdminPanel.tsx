'use client';

import React, { useState, useEffect } from 'react';
import {
    TrendingUp, ExternalLink, XCircle, RefreshCw, Trash2, Archive, Key, LogOut
} from 'lucide-react';

type Section = 'Overview' | 'Stores' | 'Subscriptions' | 'Payments';

const PLAN_COLORS: Record<string, string> = {
    Free: 'bg-gray-100 text-gray-500',
    Pro: 'bg-blue-50 text-blue-600',
    Business: 'bg-purple-50 text-purple-600',
};

const STATUS_COLORS: Record<string, string> = {
    PAID: 'bg-green-50 text-[#25D366]',
    COMPLETED: 'bg-green-50 text-[#25D366]',
    PREPARING: 'bg-blue-50 text-blue-500',
    DELIVERING: 'bg-orange-50 text-orange-500',
    PENDING: 'bg-yellow-50 text-yellow-600',
    CANCELED: 'bg-red-50 text-red-500',
};

export default function AdminPanel() {
    const [activeSection, setActiveSection] = useState<Section>('Overview');
    const [adminData, setAdminData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);
    const [showArchived, setShowArchived] = useState(false);

    const handleLogout = async () => {
        try {
            await fetch('/api/logout', { method: 'POST' });
            window.location.href = '/'; // Redirect admin to landing page
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const fetchData = () => {
        setIsLoading(true);
        fetch('/api/admin')
            .then(res => {
                if (res.status === 401) {
                    window.location.href = '/login';
                    return;
                }
                return res.json();
            })
            .then(data => {
                if (data && !data.error) setAdminData(data);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    };

    const handleDeleteStore = async (id: string) => {
        try {
            const res = await fetch(`/api/admin?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setDeletingId(null);
                setSelectedIds(prev => prev.filter(item => item !== id));
                fetchData();
            }
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const handleArchiveStore = async (id: string, archived: boolean) => {
        try {
            const res = await fetch('/api/admin', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, archived })
            });
            if (res.ok) {
                fetchData();
            }
        } catch (error) {
            console.error('Archive failed:', error);
        }
    };

    const handleResetUserPassword = async (storeId: string) => {
        if (!confirm('Generate a new temporary password for this user?')) return;
        try {
            const res = await fetch('/api/admin', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ storeId })
            });
            const data = await res.json();
            if (data.success) {
                alert(`New Temporary Password: ${data.tempPassword}\n\nPlease share this with the store owner.`);
                fetchData();
            } else {
                alert(data.error || 'Reset failed');
            }
        } catch (error) {
            console.error('Reset failed:', error);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (!confirm(`Are you sure you want to delete ${selectedIds.length} stores? This cannot be undone.`)) return;

        setIsBulkDeleting(true);
        try {
            const res = await fetch(`/api/admin?ids=${selectedIds.join(',')}`, { method: 'DELETE' });
            if (res.ok) {
                setSelectedIds([]);
                fetchData();
            }
        } catch (error) {
            console.error('Bulk delete failed:', error);
        } finally {
            setIsBulkDeleting(false);
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredStores.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredStores.map((s: any) => s.id));
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    useEffect(() => { fetchData(); }, []);

    // reset search on section change
    const switchSection = (s: Section) => {
        setActiveSection(s);
        setSearch('');
    };

    const navItems = [
        { name: 'Overview' as Section, icon: BarChart3 },
        { name: 'Stores' as Section, icon: Store },
        { name: 'Subscriptions' as Section, icon: CreditCard },
        { name: 'Payments' as Section, icon: CheckCircle2 },
    ];

    const stats = [
        { label: 'Total Stores', value: adminData?.totalStores ?? '—', icon: Store, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Users', value: adminData?.totalUsers ?? '—', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Total Orders', value: adminData?.totalOrders ?? '—', icon: ShoppingBag, color: 'text-orange-500', bg: 'bg-orange-50' },
        { label: 'Platform Revenue', value: adminData?.totalRevenue != null ? `RM ${adminData.totalRevenue.toFixed(2)}` : '—', icon: BarChart3, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Total Products', value: adminData?.totalProducts ?? '—', icon: Package, color: 'text-pink-500', bg: 'bg-pink-50' },
    ];

    const lowerSearch = search.toLowerCase();

    const filteredStores = (adminData?.allStores || []).filter((s: any) => {
        const matchesSearch = s.name?.toLowerCase().includes(lowerSearch) ||
            s.slug?.toLowerCase().includes(lowerSearch) ||
            s.ownerEmail?.toLowerCase().includes(lowerSearch);
        const matchesArchive = showArchived ? s.archived : !s.archived;
        return matchesSearch && matchesArchive;
    });

    const filteredSubs = (adminData?.subscriptions || []).filter((s: any) =>
        s.ownerEmail?.toLowerCase().includes(lowerSearch) ||
        s.storeName?.toLowerCase().includes(lowerSearch) ||
        s.plan?.toLowerCase().includes(lowerSearch)
    );

    const filteredPayments = (adminData?.payments || []).filter((p: any) =>
        p.storeName?.toLowerCase().includes(lowerSearch) ||
        p.customerName?.toLowerCase().includes(lowerSearch) ||
        p.paymentStatus?.toLowerCase().includes(lowerSearch)
    );

    const sectionTitles: Record<Section, string> = {
        Overview: 'Platform Overview',
        Stores: 'All Stores',
        Subscriptions: 'Subscriptions',
        Payments: 'Payments & Orders',
    };

    const searchPlaceholders: Record<Section, string> = {
        Overview: 'Search stores...',
        Stores: 'Search by name, slug or owner...',
        Subscriptions: 'Search by email, store or plan...',
        Payments: 'Search by store, customer or status...',
    };

    return (
        <div className="flex min-h-screen bg-[#F8F9FA] font-inter">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col pt-8 shrink-0">
                <div className="px-8 mb-10">
                    <h1 className="text-xl font-black text-gray-900 tracking-tight">
                        KedaiChat <span className="text-[#25D366]">Admin</span>
                    </h1>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Management Console</p>
                </div>

                <nav className="flex-1 space-y-1 px-4">
                    {navItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => switchSection(item.name)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeSection === item.name
                                ? 'bg-[#25D366]/10 text-[#25D366]'
                                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                                }`}
                        >
                            <item.icon size={20} />
                            {item.name}
                            {item.name === 'Payments' && (adminData?.payments?.length || 0) > 0 && (
                                <span className="ml-auto bg-orange-100 text-orange-600 text-[10px] font-black rounded-full px-2 py-0.5">
                                    {adminData.payments.length}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>

                <div className="px-4 pb-8 space-y-1">
                    <button
                        onClick={fetchData}
                        className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold text-gray-400 hover:text-[#25D366] transition-colors"
                    >
                        <RefreshCw size={14} />
                        Refresh Data
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold text-red-400 hover:text-red-500 transition-colors"
                    >
                        <LogOut size={14} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 p-10 overflow-y-auto">
                {/* Header */}
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{sectionTitles[activeSection]}</h2>
                        <p className="text-xs text-gray-400 font-medium mt-1">
                            {activeSection === 'Overview' && `${adminData?.totalStores || 0} stores · ${adminData?.totalUsers || 0} users`}
                            {activeSection === 'Stores' && `${filteredStores.length} stores found`}
                            {activeSection === 'Subscriptions' && `${filteredSubs.length} accounts`}
                            {activeSection === 'Payments' && `${filteredPayments.length} transactions`}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder={searchPlaceholders[activeSection]}
                                className="bg-white border border-gray-100 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] w-72 shadow-sm"
                            />
                        </div>
                        <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center text-white font-bold text-sm">A</div>
                    </div>
                </header>

                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="w-10 h-10 border-4 border-[#25D366] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* ── OVERVIEW ── */}
                        {activeSection === 'Overview' && (
                            <>
                                <div className="grid grid-cols-2 xl:grid-cols-5 gap-5 mb-10">
                                    {stats.map((stat) => (
                                        <div key={stat.label} className="bg-white p-6 rounded-[28px] shadow-sm border border-gray-50">
                                            <div className={`${stat.bg} ${stat.color} w-11 h-11 rounded-2xl flex items-center justify-center mb-4`}>
                                                <stat.icon size={22} />
                                            </div>
                                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                                            <h3 className="text-2xl font-black text-gray-900 leading-tight">{stat.value}</h3>
                                        </div>
                                    ))}
                                </div>

                                <section className="bg-white rounded-[36px] shadow-sm border border-gray-50 overflow-hidden">
                                    <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                                        <h3 className="text-lg font-bold text-gray-900">Recent Stores</h3>
                                        <button onClick={() => switchSection('Stores')} className="text-[#25D366] text-sm font-bold flex items-center gap-1 hover:underline">
                                            View All <ExternalLink size={12} />
                                        </button>
                                    </div>
                                    <StoresTable stores={adminData?.recentStores || []} emptyMessage="No stores yet." />
                                </section>
                            </>
                        )}

                        {/* ── STORES ── */}
                        {activeSection === 'Stores' && (
                            <section className="bg-white rounded-[36px] shadow-sm border border-gray-50 overflow-hidden">
                                <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-bold text-gray-400">{filteredStores.length} stores total</span>
                                        <div className="h-6 w-px bg-gray-100 mx-2" />
                                        <button
                                            onClick={() => setShowArchived(!showArchived)}
                                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${showArchived
                                                ? 'bg-orange-50 text-orange-500 ring-2 ring-orange-100'
                                                : 'text-gray-400 hover:bg-gray-50'}`}
                                        >
                                            {showArchived ? 'Viewing Archived' : 'View Archived'}
                                        </button>
                                    </div>
                                    {selectedIds.length > 0 && (
                                        <button
                                            onClick={handleBulkDelete}
                                            disabled={isBulkDeleting}
                                            className="bg-red-50 text-red-500 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                                        >
                                            <Trash2 size={14} />
                                            {isBulkDeleting ? 'Deleting...' : `Delete Selected (${selectedIds.length})`}
                                        </button>
                                    )}
                                </div>
                                {filteredStores.length === 0 ? (
                                    <Empty message={search ? 'No stores match your search.' : 'No stores registered yet.'} />
                                ) : (
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-50">
                                                <th className="px-8 py-4 w-10">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.length === filteredStores.length && filteredStores.length > 0}
                                                        onChange={toggleSelectAll}
                                                        className="rounded border-gray-300 text-[#25D366] focus:ring-[#25D366]"
                                                    />
                                                </th>
                                                <th className="px-8 py-4">Store</th>
                                                <th className="px-8 py-4">Owner</th>
                                                <th className="px-8 py-4">Plan</th>
                                                <th className="px-8 py-4">Products</th>
                                                <th className="px-8 py-4">Orders</th>
                                                <th className="px-8 py-4">Revenue</th>
                                                <th className="px-8 py-4">Status</th>
                                                <th className="px-8 py-4 text-right">Delete</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                                            {filteredStores.map((s: any) => (
                                                <tr key={s.id} className={`hover:bg-gray-50/50 transition-colors ${selectedIds.includes(s.id) ? 'bg-[#25D366]/5' : ''}`}>
                                                    <td className="px-8 py-5">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedIds.includes(s.id)}
                                                            onChange={() => toggleSelect(s.id)}
                                                            className="rounded border-gray-300 text-[#25D366] focus:ring-[#25D366]"
                                                        />
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 bg-green-50 rounded-full flex items-center justify-center text-[#25D366] text-xs font-black shrink-0">
                                                                {s.name?.[0] || '?'}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-gray-900">{s.name}</p>
                                                                <p className="text-[11px] text-gray-400">/shop/{s.slug}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5 text-gray-500 font-medium text-xs">{s.ownerEmail}</td>
                                                    <td className="px-8 py-5">
                                                        <span className={`text-[11px] font-black px-3 py-1 rounded-full ${PLAN_COLORS[s.plan] || 'bg-gray-100 text-gray-500'}`}>{s.plan}</span>
                                                    </td>
                                                    <td className="px-8 py-5 font-bold">{s.productCount}</td>
                                                    <td className="px-8 py-5 font-bold">{s.orderCount}</td>
                                                    <td className="px-8 py-5 font-bold text-[#25D366]">RM {s.revenue.toFixed(2)}</td>
                                                    <td className="px-8 py-5">
                                                        <span className={`text-[11px] font-black px-3 py-1 rounded-full ${s.status === 'Active' ? 'bg-green-50 text-[#25D366]' : 'bg-red-50 text-red-500'}`}>{s.status}</span>
                                                    </td>
                                                    <td className="px-8 py-5 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            {deletingId === s.id ? (
                                                                <>
                                                                    <button onClick={() => handleDeleteStore(s.id)} className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-100 active:scale-95 transition-all">Burn Permanent</button>
                                                                    <button onClick={() => setDeletingId(null)} className="text-gray-400 hover:text-gray-900 text-[10px] font-bold underline">Cancel</button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {s.archived ? (
                                                                        <>
                                                                            <button
                                                                                onClick={() => handleArchiveStore(s.id, false)}
                                                                                className="p-3 text-green-500 hover:bg-green-50 rounded-xl transition-all flex items-center gap-2 text-xs font-bold"
                                                                                title="Restore Store"
                                                                            >
                                                                                <RefreshCw size={16} /> Restore
                                                                            </button>
                                                                            <button
                                                                                onClick={() => setDeletingId(s.id)}
                                                                                className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                                                title="Permanent Delete"
                                                                            >
                                                                                <Trash2 size={16} />
                                                                            </button>
                                                                        </>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => handleArchiveStore(s.id, true)}
                                                                            className="p-3 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all flex items-center gap-2 text-xs font-bold"
                                                                            title="Archive Store"
                                                                        >
                                                                            <Archive size={16} /> Archive
                                                                        </button>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </section>
                        )}

                        {/* ── SUBSCRIPTIONS ── */}
                        {activeSection === 'Subscriptions' && (
                            <section className="bg-white rounded-[36px] shadow-sm border border-gray-50 overflow-hidden">
                                <div className="p-8 border-b border-gray-50">
                                    <span className="text-sm font-bold text-gray-400">{filteredSubs.length} accounts</span>
                                </div>
                                {filteredSubs.length === 0 ? (
                                    <Empty message={search ? 'No accounts match your search.' : 'No users registered yet.'} />
                                ) : (
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-50">
                                                <th className="px-8 py-4">Account</th>
                                                <th className="px-8 py-4">Store</th>
                                                <th className="px-8 py-4">Plan</th>
                                                <th className="px-8 py-4">Status</th>
                                                <th className="px-8 py-4">Proof</th>
                                                <th className="px-8 py-4">Renewal</th>
                                                <th className="px-8 py-4">Joined</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                                            {filteredSubs.map((s: any) => (
                                                <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 bg-purple-50 rounded-full flex items-center justify-center text-purple-500 text-xs font-black shrink-0">
                                                                {s.ownerEmail?.[0]?.toUpperCase() || 'U'}
                                                            </div>
                                                            <span className="font-bold text-gray-900">{s.ownerEmail}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5 font-medium">{s.storeName}</td>
                                                    <td className="px-8 py-5">
                                                        <span className={`text-[11px] font-black px-3 py-1 rounded-full ${PLAN_COLORS[s.plan] || 'bg-gray-100 text-gray-500'}`}>{s.plan}</span>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <span className={`text-[11px] font-black px-3 py-1 rounded-full ${s.status === 'Active' ? 'bg-green-50 text-[#25D366]' : 'bg-red-50 text-red-500'}`}>
                                                            {s.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        {s.paymentReceiptUrl ? (
                                                            <a href={s.paymentReceiptUrl} target="_blank" className="text-blue-500 hover:underline text-xs font-bold flex items-center gap-1">
                                                                View Proof <ExternalLink size={12} />
                                                            </a>
                                                        ) : (
                                                            <span className="text-gray-300 text-xs">—</span>
                                                        )}
                                                    </td>
                                                    <td className="px-8 py-5 text-gray-400 text-xs font-medium">
                                                        {s.renewalDate ? new Date(s.renewalDate).toLocaleDateString() : '—'}
                                                    </td>
                                                    <td className="px-8 py-5 text-gray-400 text-xs font-medium">
                                                        {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '—'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </section>
                        )}

                        {/* ── PAYMENTS ── */}
                        {activeSection === 'Payments' && (
                            <section className="bg-white rounded-[36px] shadow-sm border border-gray-50 overflow-hidden">
                                <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-400">{filteredPayments.length} transactions</span>
                                    <div className="flex gap-2">
                                        {['PAID', 'PREPARING', 'DELIVERING', 'COMPLETED', 'PENDING'].map(status => (
                                            <button
                                                key={status}
                                                onClick={() => setSearch(search === status.toLowerCase() ? '' : status.toLowerCase())}
                                                className={`text-[11px] font-black px-3 py-1.5 rounded-full transition-all ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-500'} ${search === status.toLowerCase() ? 'ring-2 ring-offset-1 ring-current' : 'opacity-70 hover:opacity-100'}`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {filteredPayments.length === 0 ? (
                                    <Empty message={search ? 'No payments match your search.' : 'No orders placed yet.'} />
                                ) : (
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-50">
                                                <th className="px-8 py-4">Order ID</th>
                                                <th className="px-8 py-4">Store</th>
                                                <th className="px-8 py-4">Customer</th>
                                                <th className="px-8 py-4">Amount</th>
                                                <th className="px-8 py-4">Status</th>
                                                <th className="px-8 py-4">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                                            {filteredPayments.map((p: any) => (
                                                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-8 py-5">
                                                        <span className="font-mono text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
                                                            {p.id.slice(0, 10)}...
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <div className="font-bold text-gray-900">{p.storeName}</div>
                                                        <div className="text-[11px] text-gray-400">/shop/{p.storeSlug}</div>
                                                    </td>
                                                    <td className="px-8 py-5 font-medium text-gray-600">{p.customerName}</td>
                                                    <td className="px-8 py-5 font-black text-gray-900">RM {p.total.toFixed(2)}</td>
                                                    <td className="px-8 py-5">
                                                        <span className={`text-[11px] font-black px-3 py-1 rounded-full ${STATUS_COLORS[p.paymentStatus] || 'bg-gray-100 text-gray-500'}`}>
                                                            {p.paymentStatus}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5 text-gray-400 text-xs font-medium">
                                                        {p.createdAt ? new Date(p.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : '—'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </section>
                        )}
                    </>
                )}
            </main>
        </div >
    );
}

// Shared sub-components
function StoresTable({ stores, emptyMessage }: { stores: any[], emptyMessage: string }) {
    if (stores.length === 0) return <Empty message={emptyMessage} />;
    return (
        <table className="w-full text-left">
            <thead>
                <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-50">
                    <th className="px-8 py-4">Store</th>
                    <th className="px-8 py-4">Slug</th>
                    <th className="px-8 py-4">Orders</th>
                    <th className="px-8 py-4">Created</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm font-bold text-gray-700">
                {stores.map((store: any) => (
                    <tr key={store.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-[#25D366] text-xs font-black">
                                    {store.name?.[0] || '?'}
                                </div>
                                {store.name || 'Unnamed'}
                            </div>
                        </td>
                        <td className="px-8 py-5 text-gray-400 font-medium">/shop/{store.slug}</td>
                        <td className="px-8 py-5">
                            <span className="bg-green-50 text-[#25D366] text-xs font-black px-3 py-1 rounded-full">{store.orderCount} orders</span>
                        </td>
                        <td className="px-8 py-5 text-gray-400 font-medium text-xs">
                            {store.createdAt ? new Date(store.createdAt).toLocaleDateString() : '—'}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function Empty({ message }: { message: string }) {
    return (
        <div className="p-16 text-center text-gray-400 font-medium">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <XCircle size={24} className="text-gray-300" />
            </div>
            {message}
        </div>
    );
}
