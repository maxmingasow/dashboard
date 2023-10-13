import { format } from 'date-fns'

import { prismadb } from '@/lib/prismadb'
import { formatter } from '@/lib/utils'

import { OrderClient } from './components/client'
import { OrderColumn } from './components/columns'

export default async function OrdersPage({ params }: { params: { storeId: string } }) {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const formattedOrders: OrderColumn[] = orders.map((order) => ({
    id: order.id,
    phone: order.phone,
    address: order.address,
    products: order.orderItems.map((orderItem) => orderItem.product.name).join(', '),
    totalPrice: formatter.format(
      order.orderItems.reduce((total, curr) => {
        return total + Number(curr.product.price)
      }, 0),
    ),
    isPaid: order.isPaid,
    createdAt: format(order.createdAt, 'MMMM dd, yyyy'),
  }))

  return (
    <div className="mx-auto w-screen max-w-7xl px-4 pt-14 md:px-8">
      <OrderClient data={formattedOrders} />
    </div>
  )
}
