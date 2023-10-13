import { format } from 'date-fns'

import { prismadb } from '@/lib/prismadb'

import { BillboardClient } from './components/client'
import { BillboardColumn } from './components/columns'

/**
 * Renders the billboards page for a specific store.
 * @param params - The parameters object containing the storeId.
 * @returns A JSX element representing the billboards page.
 */
export default async function BillboardsPage({ params }: { params: { storeId: string } }) {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  /**
   * Formats the billboards array into a new array of BillboardColumn objects.
   * @param billboards - The array of billboards to format.
   * @returns An array of BillboardColumn objects with formatted properties.
   */
  const formattedBillboards: BillboardColumn[] = billboards.map((billboard) => ({
    id: billboard.id,
    label: billboard.label,
    createdAt: format(billboard.createdAt, 'MMMM dd, yyyy'),
  }))

  return (
    <div className="mx-auto w-screen max-w-7xl px-4 pt-14 md:px-8">
      <BillboardClient data={formattedBillboards} />
    </div>
  )
}
