'use client'

import { useParams, useRouter } from 'next/navigation'
import { HiPlus } from 'react-icons/hi2'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'

import { ColorColumn, columns } from './columns'

type Props = {
  data: ColorColumn[]
}

export function ColorClient({ data }: Props) {
  const router = useRouter()
  const params = useParams()

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        {data.length > 0 && <Heading title={`Colors (${data.length})`} />}
        <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
          <HiPlus className="mr-2 h-4 w-4" />
          Add Color
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
    </>
  )
}
