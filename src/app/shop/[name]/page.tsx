import StoreCatalog from '@/components/StoreCatalog';

export default function ShopPage({ params }: { params: { name: string } }) {
    return <StoreCatalog slug={params.name} />;
}
