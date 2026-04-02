import ResellerGroupDashboard from '@/components/ResellerGroupDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
};


export default function ResellerPage() {
    return <ResellerGroupDashboard />;
}
