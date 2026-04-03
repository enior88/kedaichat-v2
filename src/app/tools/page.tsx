import PosterGenerator from '@/components/PosterGenerator';
import { Metadata } from 'next';

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
};

export default function ToolsPage() {
    return <PosterGenerator />;
}
