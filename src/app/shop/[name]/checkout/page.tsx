import Checkout from '@/components/Checkout';

export default function CheckoutPage({ params }: { params: { name: string } }) {
    return <Checkout params={params} />;
}
