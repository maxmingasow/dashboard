'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Size } from '@prisma/client'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as z from 'zod'

import { AlertModal } from '@/components/modals/alert-modal'
import { Button } from '@/components/ui/button'
// prettier-ignore
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from '@/components/ui/form'
import { Heading } from '@/components/ui/heading'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

const formSchema = z.object({
  name: z.string().min(3, 'Name is too short.').max(30, 'Name is too long.'),
  value: z.string().min(1),
})

type SizeFormValues = z.infer<typeof formSchema>

type Props = {
  initialData: Size | null
}

export function SizeForm({ initialData }: Props) {
  // get size id from url
  const params = useParams()
  // get router object
  const router = useRouter()
  // open and close delete confirmation modal
  const [open, setOpen] = useState(false)
  // loading state for form submission
  const [loading, setLoading] = useState(false)

  const title = initialData ? 'Edit size' : 'Create size'
  const description = initialData ? 'Edit the current size' : 'Create a new size'
  const toastMessage = initialData ? 'Size has updated to' : 'A new size has created'
  const action = initialData ? 'Save changes' : 'Create'

  // initialize react-hook-form with initial values and validation schema
  const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          value: initialData.value,
        }
      : undefined,
  })

  // called when form is submitted
  const onSubmit = async (values: SizeFormValues) => {
    try {
      setLoading(true)

      if (initialData) await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, values)
      else await axios.post(`/api/${params.storeId}/sizes`, values)

      router.refresh()
      router.push(`/${params.storeId}/sizes`)
      toast.success(toastMessage + ' ' + values.name)
    } catch (error) {
      toast.error("Couldn't update size")
    } finally {
      setLoading(false)
    }
  }

  // called when delete button is clicked
  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`)
      router.refresh()
      toast.success('Size has deleted.')
    } catch (error) {
      toast.error('Make sure you removed all products with this size.')
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button disabled={loading} onClick={() => setOpen(true)} variant="destructive">
            Delete Size
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Size name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="value"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Size value" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button isLoading={loading} type="submit" className="ml-auto">
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  )
}
