import StoreCatalog from '@/components/StoreCatalog';
import { Metadata } from 'next';

type Props = {
    params: { name: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const name = params.name;
    // Capitalize first letter for better appearance
    const displayName = name.charAt(0).toUpperCase() + name.slice(1);

    return {
        title: `${displayName} | KedaiChat Shop`,
        description: `Browse products and order directly from ${displayName} on WhatsApp. Fast and easy ordering via KedaiChat.`,
        openGraph: {
            title: `${displayName} - WhatsApp Shop`,
            description: `Order from ${displayName} via WhatsApp using KedaiChat.`,
        },
    };
}

export default function ShopPage({ params }: Props) {

    return <StoreCatalog slug={params.name} />;
}
