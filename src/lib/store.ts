import { prisma } from './prisma';

export async function getStoreBySlug(slug: string) {
    return await prisma.store.findUnique({
        where: { slug },
        include: {
            products: {
                where: { active: true }
            },
            subscription: true
        }
    });
}

export async function getStoreById(id: string) {
    return await prisma.store.findUnique({
        where: { id },
        include: {
            subscription: true
        }
    });
}
