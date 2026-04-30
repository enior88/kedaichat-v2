import React from 'react';

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[110] bg-white flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500">
            <div className="w-20 h-20 mb-8 relative">
                <div className="absolute inset-0 border-4 border-[#25D366]/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#25D366] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">
                Welcome, store is preparing <span className="inline-block animate-bounce">📦</span>
            </h2>
            <div className="flex gap-1.5 mt-4">
                <div className="w-2 h-2 rounded-full bg-[#25D366] animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 rounded-full bg-[#25D366] animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 rounded-full bg-[#25D366] animate-bounce" style={{ animationDelay: "300ms" }}></div>
            </div>
        </div>
    );
}
