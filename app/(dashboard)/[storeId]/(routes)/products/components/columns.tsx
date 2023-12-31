'use client'

import { ColumnDef } from '@tanstack/react-table'

import { CellAction } from './cell-action'

export type ProductColumn = {
  id: string
  name: string
  price: string
  category: string
  size: string
  color: string
  isFeatured: boolean
  inStock: boolean
  createdAt: string
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'inStock',
    header: 'In Stock',
  },
  {
    accessorKey: 'isFeatured',
    header: 'Featured',
  },
  {
    accessorKey: 'price',
    header: 'Price',
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'size',
    header: 'Size',
  },
  {
    accessorKey: 'color',
    header: 'Color',
    cell: ({ row }) => (
      <div className="flex items-center">
        <div className="h-6 w-6 rounded-full" style={{ backgroundColor: row.original.color }} />
        <span className="ml-2">{row.original.color}</span>
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
