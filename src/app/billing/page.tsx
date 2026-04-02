import BillingSubscription from '@/components/BillingSubscription';
import { Metadata } from 'next';

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
};


export default function BillingPage() {
    return <BillingSubscription />;
}
