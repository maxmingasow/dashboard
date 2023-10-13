import { prismadb } from '@/lib/prismadb'

/**
 * Retrieves the total revenue for a given store ID.
 * @param storeId - The ID of the store to retrieve revenue for.
 * @returns The total revenue for the store.
 */
export async function getTotalRevenue(storeId: string) {
  const paidOrders = await prismadb.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  })

  const totalRevenue = paidOrders.reduce((acc, order) => {
    const orderTotal = order.orderItems.reduce((acc, orderItem) => {
      return acc + orderItem.product.price.toNumber()
    }, 0)

    return acc + orderTotal
  }, 0)

  return totalRevenue
}
