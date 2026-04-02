import Settings from '@/components/Settings';
import { Metadata } from 'next';

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
};


export default function SettingsPage() {
    return <Settings />;
}
