import ProductManager from '@/components/ProductManager';
import { Suspense } from 'react';

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
            <ProductManager />
        </Suspense>
    );
}
