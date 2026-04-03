import Login from '@/components/Login';
import { Metadata } from 'next';

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
};

export default function LoginPage() {
    return <Login />;
}
