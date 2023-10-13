'use client'

import { useParams, useRouter } from 'next/navigation'
import { HiPlus } from 'react-icons/hi2'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'

import { CategoryColumn, columns } from './columns'

type Props = {
  data: CategoryColumn[]
}

export function CategoryClient({ data }: Props) {
  const router = useRouter()
  const params = useParams()

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        {data.length > 0 && <Heading title={`Categories (${data.length})`} />}
        <Button onClick={() => router.push(`/${params.storeId}/categories/new`)}>
          <HiPlus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
    </>
  )
}
