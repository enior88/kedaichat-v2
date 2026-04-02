import ProductManager from '@/components/ProductManager';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
};


export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
            <ProductManager />
        </Suspense>
    );
}
