import { format } from 'date-fns'

import { prismadb } from '@/lib/prismadb'

import { SizeClient } from './components/client'
import { SizeColumn } from './components/columns'

export default async function SizesPage({ params }: { params: { storeId: string } }) {
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const formattedSizes: SizeColumn[] = sizes.map((size) => ({
    id: size.id,
    name: size.name,
    value: size.value,
    createdAt: format(size.createdAt, 'MMMM dd, yyyy'),
  }))

  return (
    <div className="mx-auto w-screen max-w-7xl px-4 pt-14 md:px-8">
      <SizeClient data={formattedSizes} />
    </div>
  )
}
