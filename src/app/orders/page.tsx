import OrdersManagement from '@/components/OrdersManagement';
import { Metadata } from 'next';

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
};


export default function OrdersPage() {
    return <OrdersManagement />;
}
