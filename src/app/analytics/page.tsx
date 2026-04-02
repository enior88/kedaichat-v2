import Analytics from '@/components/Analytics';
import { Metadata } from 'next';

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
};


export default function AnalyticsPage() {
    return <Analytics />;
}
