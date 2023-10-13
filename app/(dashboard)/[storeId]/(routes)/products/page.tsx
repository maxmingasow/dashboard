import { format } from 'date-fns'

import { prismadb } from '@/lib/prismadb'
import { formatter } from '@/lib/utils'

import { ProductClient } from './components/client'
import { ProductColumn } from './components/columns'

export default async function ProductsPage({ params }: { params: { storeId: string } }) {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const formattedProducts: ProductColumn[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    isFeatured: product.isFeatured,
    inStock: product.inStock,
    price: formatter.format(+product.price),
    category: product.category.name,
    size: product.size.name,
    color: product.color.value,
    createdAt: format(product.createdAt, 'MMMM dd, yyyy'),
  }))

  return (
    <div className="mx-auto w-screen max-w-7xl px-4 pt-14 md:px-8">
      <ProductClient data={formattedProducts} />
    </div>
  )
}
