import CustomerWallet from '@/components/CustomerWallet';
import { Metadata } from 'next';

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
};


export default function WalletPage() {
    return <CustomerWallet />;
}
