'use client'

import { useEffect, useState } from 'react'

import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'

import { OrderColumn, columns } from './columns'

type Props = {
  data: OrderColumn[]
  storeName?: string
}

export function OrderClient({ data, storeName }: Props) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => setIsMounted(true), [])
  if (!isMounted) return null

  return (
    <>
      <Heading title={`Orders (${data.length})`} />
      <Separator />
      <DataTable columns={columns} data={data} searchKey="products" />
    </>
  )
}
