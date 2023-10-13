import { format } from 'date-fns'

import { prismadb } from '@/lib/prismadb'

import { CategoryClient } from './components/client'
import { CategoryColumn } from './components/columns'

export default async function BillboardsPage({ params }: { params: { storeId: string } }) {
  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const formattedCategories: CategoryColumn[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    billboardLabel: category.billboard.label,
    createdAt: format(category.createdAt, 'MMMM dd, yyyy'),
  }))

  return (
    <div className="mx-auto w-screen max-w-7xl px-4 pt-14 md:px-8">
      <CategoryClient data={formattedCategories} />
    </div>
  )
}
