import webpush from 'web-push';
import { eventBus, AppEvents, OrderCreatedPayload } from '../events';
import { prisma } from '../prisma';

// Configure VAPID
const publicKey = process.env.VAPID_PUBLIC_KEY || '';
const privateKey = process.env.VAPID_PRIVATE_KEY || '';
const subject = process.env.VAPID_SUBJECT || 'mailto:support@kedaichat.online';

if (publicKey && privateKey) {
    webpush.setVapidDetails(subject, publicKey, privateKey);
}

/**
 * Handle Order Created event by sending push notifications to the store owner's devices.
 */
eventBus.on(AppEvents.ORDER_CREATED, async (data: OrderCreatedPayload) => {
    console.log(`[PushHandler] Triggered for order ${data.orderId}`);

    try {
        // 1. Find the store and its owner
        const store = await prisma.store.findUnique({
            where: { id: data.storeId },
            select: { ownerId: true, name: true }
        });

        if (!store) return;

        // 2. Find all active push subscriptions for this owner
        const subscriptions = await prisma.pushSubscription.findMany({
            where: { userId: store.ownerId }
        });

        if (subscriptions.length === 0) {
            console.log(`[PushHandler] No subscriptions found for user ${store.ownerId}`);
            return;
        }

        // 3. Construct notification payload
        const payload = JSON.stringify({
            title: `New Order! - ${store.name}`,
            body: `You received a new order for RM ${data.total.toFixed(2)} from ${data.customerName}.`,
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            data: {
                url: '/orders', // Link to the orders page in dashboard
                orderId: data.orderId
            }
        });

        // 4. Send to all devices
        const results = await Promise.all(
            subscriptions.map(async (sub) => {
                const pushConfig = {
                    endpoint: sub.endpoint,
                    keys: {
                        p256dh: sub.p256dh,
                        auth: sub.auth
                    }
                };

                try {
                    await webpush.sendNotification(pushConfig, payload);
                    return { success: true };
                } catch (error: any) {
                    // If subscription has expired or is no longer valid, remove it
                    if (error.statusCode === 404 || error.statusCode === 410) {
                        console.log(`[PushHandler] Removing expired subscription: ${sub.id}`);
                        await prisma.pushSubscription.delete({ where: { id: sub.id } });
                    }
                    return { success: false, error: error.message };
                }
            })
        );

        const successCount = results.filter(r => r.success).length;
        console.log(`[PushHandler] Successfully sent to ${successCount}/${subscriptions.length} devices.`);

    } catch (error: any) {
        console.error(`[PushHandler] Error processing order event:`, error.message);
    }
});

console.log('[PushHandler] Registered and listening for events.');
