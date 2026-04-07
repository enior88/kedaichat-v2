'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, MoreVertical, Package, ArrowLeft, Image as ImageIcon, X } from 'lucide-react';
import BottomNav from './BottomNav';
import { mockProducts } from '@/data/mockData';
import { useSearchParams, useRouter } from 'next/navigation';

const DEFAULT_CATEGORIES = ['Rice Items', 'Noodles', 'Drinks', 'Desserts', 'Snacks', 'Add-ons', 'Others'];

export default function ProductManager() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [showAddForm, setShowAddForm] = useState(searchParams.get('action') === 'add');
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({ id: '', name: '', price: '', description: '', category: 'Rice Items', image: '' });
    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        if (searchParams.get('action') === 'add') {
            setShowAddForm(true);
        }
        fetchProducts();
    }, [searchParams]);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/products');
            if (res.status === 404) {
                // If store not found for products, go back to dashboard which handles the redirect logic
                window.location.href = '/dashboard';
                return;
            }
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveProduct = async () => {
        if (!formData.name || !formData.price) return;

        try {
            const isEditing = !!formData.id;
            const res = await fetch('/api/products', {
                method: isEditing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setShowAddForm(false);
                setFormData({ id: '', name: '', price: '', description: '', category: 'Rice Items', image: '' });
                fetchProducts();
            }
        } catch (error) {
            console.error('Failed to save product', error);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setShowAddForm(false);
                setFormData({ id: '', name: '', price: '', description: '', category: 'Rice Items', image: '' });
                fetchProducts();
            }
        } catch (error) {
            console.error('Failed to delete product', error);
        }
    };

    const handleToggleActive = async (product: any) => {
        try {
            // Optimistic UI update
            setProducts(products.map(p => p.id === product.id ? { ...p, active: !p.active } : p));
            await fetch('/api/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: product.id, active: !product.active }),
            });
        } catch (error) {
            console.error('Failed to toggle active', error);
            fetchProducts(); // Revert on failure
        }
    };

    const openEditForm = (product: any) => {
        const cat = product.category || 'Rice Items';
        setFormData({
            id: product.id,
            name: product.name,
            price: product.price.toString(),
            description: product.description || '',
            category: cat,
            image: product.image || ''
        });
        setShowAddForm(true);
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-24 font-inter max-w-md mx-auto relative shadow-2xl overflow-hidden border-x border-gray-100">
            {showAddForm ? (
                <div className="p-6 pt-12 animate-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center gap-4 mb-8">
                        <button
                            onClick={() => {
                                setShowAddForm(false);
                                setFormData({ id: '', name: '', price: '', description: '', category: 'Rice Items', image: '' });
                            }}
                            className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-gray-400 border border-gray-100 shadow-sm active:scale-90 transition-all"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                            {formData.id ? 'Edit Product' : 'New Product'}
                        </h1>
                    </div>

                    <div className="space-y-6">
                        <label className="w-full aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-[32px] flex flex-col items-center justify-center text-gray-400 gap-2 cursor-pointer hover:bg-gray-100 transition-all overflow-hidden">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            const img = new Image();
                                            img.onload = () => {
                                                const canvas = document.createElement('canvas');
                                                let width = img.width;
                                                let height = img.height;
                                                const MAX_SIZE = 800;

                                                if (width > height && width > MAX_SIZE) {
                                                    height *= MAX_SIZE / width;
                                                    width = MAX_SIZE;
                                                } else if (height > MAX_SIZE) {
                                                    width *= MAX_SIZE / height;
                                                    height = MAX_SIZE;
                                                }

                                                canvas.width = width;
                                                canvas.height = height;
                                                const ctx = canvas.getContext('2d');
                                                ctx?.drawImage(img, 0, 0, width, height);

                                                // Compress as JPEG
                                                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                                                setFormData(prev => ({ ...prev, image: dataUrl }));
                                            };
                                            img.src = reader.result as string;
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                            {formData.image ? (
                                <img src={formData.image} alt="Product" className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <ImageIcon size={32} />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Upload Photo</span>
                                </>
                            )}
                        </label>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Product Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Nasi Lemak Biasa"
                                    className="w-full h-14 bg-white border border-gray-100 rounded-2xl px-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#25D366] shadow-sm transition-all"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price (RM)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="8.50"
                                    className="w-full h-14 bg-white border border-gray-100 rounded-2xl px-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#25D366] shadow-sm transition-all"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category / Tag</label>
                                <div className="w-full min-h-[56px] bg-white border border-gray-100 rounded-2xl p-2 px-3 flex flex-wrap items-center gap-2 shadow-sm focus-within:ring-2 focus-within:ring-[#25D366] transition-all">
                                    {formData.category?.split(',').filter(Boolean).map(cat => (
                                        <div key={cat} className="bg-gray-100 text-gray-700 text-[13px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-2 border border-gray-200 shadow-sm animate-in zoom-in-95 duration-200">
                                            {cat}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const tags = formData.category.split(',').filter(Boolean);
                                                    setFormData({ ...formData, category: tags.filter(t => t !== cat).join(',') });
                                                }}
                                                className="text-gray-400 hover:text-red-500 focus:outline-none bg-white rounded-full p-0.5 shadow-sm transition-colors active:scale-90"
                                            >
                                                <X size={12} strokeWidth={3} />
                                            </button>
                                        </div>
                                    ))}
                                    <div className="flex-1 flex min-w-[80px] items-center">
                                        <input
                                            type="text"
                                            placeholder="Add custom tag..."
                                            className="flex-1 min-w-0 h-10 bg-transparent text-sm font-medium focus:outline-none px-1"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    if (tagInput.trim()) {
                                                        const current = formData.category ? formData.category.split(',').filter(Boolean) : [];
                                                        if (!current.includes(tagInput.trim())) {
                                                            current.push(tagInput.trim());
                                                            setFormData({ ...formData, category: current.join(',') });
                                                        }
                                                        setTagInput('');
                                                    }
                                                }
                                            }}
                                        />
                                        {tagInput.trim() && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const current = formData.category ? formData.category.split(',').filter(Boolean) : [];
                                                    if (!current.includes(tagInput.trim())) {
                                                        current.push(tagInput.trim());
                                                        setFormData({ ...formData, category: current.join(',') });
                                                    }
                                                    setTagInput('');
                                                }}
                                                className="bg-[#25D366] text-white text-[10px] uppercase font-black px-3 py-1.5 rounded-xl ml-2 shadow-sm active:scale-95 transition-all animate-in zoom-in duration-200"
                                            >
                                                Add
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-1.5 mt-2 px-1 animate-in fade-in duration-300">
                                    {DEFAULT_CATEGORIES.map(cat => {
                                        const isSelected = formData.category?.split(',').filter(Boolean).includes(cat);
                                        if (isSelected) return null;
                                        return (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => {
                                                    const current = formData.category ? formData.category.split(',').filter(Boolean) : [];
                                                    if (!current.includes(cat)) {
                                                        current.push(cat);
                                                        setFormData({ ...formData, category: current.join(',') });
                                                    }
                                                }}
                                                className="bg-white border border-gray-100 hover:bg-gray-50 text-gray-500 hover:text-gray-900 border-b-2 hover:border-gray-200 text-[11px] font-bold px-3 py-1.5 rounded-full transition-all active:scale-95"
                                            >
                                                {cat}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description (Optional)</label>
                                <textarea
                                    placeholder="Brief description about the product..."
                                    className="w-full bg-white border border-gray-100 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#25D366] shadow-sm transition-all resize-none"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            disabled={!formData.name || !formData.price}
                            onClick={handleSaveProduct}
                            className="w-full h-14 bg-[#25D366] text-white font-black rounded-2xl shadow-lg shadow-green-100 active:scale-95 transition-all mt-4 disabled:opacity-50"
                        >
                            {formData.id ? 'Update Product' : 'Save Product'}
                        </button>
                        {formData.id && (
                            <button
                                onClick={() => handleDeleteProduct(formData.id)}
                                className="w-full h-14 bg-white text-red-500 font-bold rounded-2xl border border-red-100 shadow-sm active:scale-95 transition-all mt-2"
                            >
                                Delete Product
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <>
                    {/* Header */}
                    <div className="p-6 pb-2">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="w-10 h-10 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg shadow-green-100 active:scale-90 transition-all font-bold"
                            >
                                <Plus size={24} />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="relative mb-6">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full h-12 bg-white border border-gray-100 rounded-2xl pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] transition-all text-sm font-medium"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Product List */}
                    <div className="px-6 space-y-4">
                        {isLoading ? (
                            <div className="text-center py-10 text-gray-400">Loading products...</div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-10 text-gray-400">No products found. Add one above!</div>
                        ) : (
                            products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map((product) => (
                                <div key={product.id} className="premium-card !p-3 flex items-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-2xl mr-4 flex-shrink-0 flex items-center justify-center text-gray-400 overflow-hidden">
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Package size={24} />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 truncate">{product.name}</h3>
                                        <div className="flex flex-wrap items-center gap-1 mt-0.5">
                                            {product.category ? product.category.split(',').filter(Boolean).map((cat: string) => (
                                                <span key={cat} className="bg-gray-100 text-gray-500 text-[10px] uppercase font-black px-2 py-0.5 rounded-md">{cat}</span>
                                            )) : (
                                                <span className="bg-gray-100 text-gray-500 text-[10px] uppercase font-black px-2 py-0.5 rounded-md">Uncategorized</span>
                                            )}
                                            <p className="text-[#25D366] font-bold text-sm ml-2">RM {product.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col items-center">
                                            <div
                                                onClick={() => handleToggleActive(product)}
                                                className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${product.active ? 'bg-[#25D366]' : 'bg-gray-200'}`}
                                            >
                                                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${product.active ? 'left-[22px]' : 'left-0.5 shadow-sm'}`}></div>
                                            </div>
                                            <span className="text-[8px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">
                                                {product.active ? 'Active' : 'Hidden'}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => openEditForm(product)}
                                            className="text-gray-300 hover:text-[#25D366] transition-colors ml-2"
                                        >
                                            <MoreVertical size={20} />
                                        </button>
                                    </div>
                                </div>
                            )))}
                    </div>
                </>
            )}


        </div>
    );
}
