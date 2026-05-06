import { EventEmitter } from 'events';

// Core events for KedaiChat
export const AppEvents = {
    ORDER_CREATED: 'order.created',
    // Future events
    // STORE_CREATED: 'store.created',
    // PRODUCT_OUT_OF_STOCK: 'product.low_stock',
};

// Singleton EventBus
class EventBus extends EventEmitter { }

export const eventBus = new EventBus();

// Types for event payloads
export interface OrderCreatedPayload {
    orderId: string;
    storeId: string;
    total: number;
    customerName: string;
}
