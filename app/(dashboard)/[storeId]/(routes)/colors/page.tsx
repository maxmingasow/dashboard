import { format } from 'date-fns'

import { prismadb } from '@/lib/prismadb'

import { ColorClient } from './components/client'
import { ColorColumn } from './components/columns'

export default async function ColorsPage({ params }: { params: { storeId: string } }) {
  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const formattedColors: ColorColumn[] = colors.map((color) => ({
    id: color.id,
    name: color.name,
    value: color.value,
    createdAt: format(color.createdAt, 'MMMM dd, yyyy'),
  }))

  return (
    <div className="mx-auto w-screen max-w-7xl px-4 pt-14 md:px-8">
      <ColorClient data={formattedColors} />
    </div>
  )
}
