import { CircleDashed, CreditCardIcon, DollarSignIcon, Package2 } from 'lucide-react'

import { getGraphRevenue } from '@/actions/get-graph-revenue'
import { getSalesCount } from '@/actions/get-sales-count'
import { getStockCount } from '@/actions/get-stock-count'
import { getTotalRevenue } from '@/actions/get-total-revenue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heading } from '@/components/ui/heading'
import { Overview } from '@/components/ui/overview'
import { Separator } from '@/components/ui/separator'
import { prismadb } from '@/lib/prismadb'
import { formatter } from '@/lib/utils'

type Props = {
  params: {
    storeId: string
  }
}

/**
 * Renders the dashboard page for a specific store.
 * @param {Object} props - The component props.
 * @param {Object} props.params - The route parameters, including the store ID.
 * @returns {JSX.Element} - The rendered component.
 */
export default async function DashboardPage({ params }: Props) {
  const totalRevenue = await getTotalRevenue(params.storeId)
  const salesCount = await getSalesCount(params.storeId)
  const stockCount = await getStockCount(params.storeId)
  const graphRevenue = await getGraphRevenue(params.storeId)

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
    },
  })

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col space-y-4 px-4 pt-14 md:px-8">
      <Heading title="Dashboard" description={`Store Overview for ${store?.name}`} />
      <Separator />
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Total Revenue</CardTitle>
            <DollarSignIcon size={16} />
          </CardHeader>
          <CardContent>{formatter.format(totalRevenue)}</CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Sales</CardTitle>
            <CreditCardIcon size={16} />
          </CardHeader>
          <CardContent>+{salesCount}</CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Products In Stock</CardTitle>
            <Package2 size={16} />
          </CardHeader>
          <CardContent>{stockCount}</CardContent>
        </Card>
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle></CardTitle>
            <CircleDashed size={16} />
          </CardHeader>
          <CardContent>
            <Overview data={graphRevenue} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
