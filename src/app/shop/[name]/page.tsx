import StoreCatalog from '@/components/StoreCatalog';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

type Props = {
    params: { name: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const store = await prisma.store.findUnique({
        where: { slug: params.name },
        select: { name: true, category: true, logoUrl: true }
    });

    if (!store) return { title: 'Shop Not Found' };

    const title = `${store.name} | KedaiChat WhatsApp Shop`;
    const description = `Order from ${store.name}${store.category ? ` (${store.category})` : ''} on WhatsApp. Browse products and place your order instantly on KedaiChat.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: store.logoUrl ? [store.logoUrl] : ['/logo.png'],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: store.logoUrl ? [store.logoUrl] : ['/logo.png'],
        }
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
