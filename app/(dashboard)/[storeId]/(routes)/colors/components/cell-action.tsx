'use client'

import { useState } from 'react'

import axios from 'axios'
import { Trash2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { BiEdit } from 'react-icons/bi'
import { FiCopy, FiMoreHorizontal } from 'react-icons/fi'

import { AlertModal } from '@/components/modals/alert-modal'
import { Button } from '@/components/ui/button'
// prettier-ignore
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu'

import { ColorColumn } from './columns'

type Props = {
  data: ColorColumn
}

export function CellAction({ data }: Props) {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id)
    toast.success('Colors id Copied to clipboard')
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/${params.storeId}/colors/${data.id}`)
      router.refresh()
      toast.success('Color has deleted.')
    } catch (error) {
      toast.error('Make sure you removed all products that use this color.')
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <>
      <AlertModal
        loading={loading}
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <span className="sr-only">Open Menu</span>
            <FiMoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/colors/${data.id}`)}>
            <BiEdit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <FiCopy className="mr-2 h-4 w-4" />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
