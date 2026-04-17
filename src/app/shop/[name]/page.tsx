import StoreCatalog from '@/components/StoreCatalog';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

type Props = {
    params: { name: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const name = params.name;
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

export default async function ShopPage({ params }: Props) {
    const store = await prisma.store.findUnique({
        where: { slug: params.name },
        include: {
            products: {
                where: { active: true }
            },
            subscription: true
        }
    });

    if (!store) {
        notFound();
    }

    return <StoreCatalog slug={params.name} initialStoreData={JSON.parse(JSON.stringify(store))} />;
}
