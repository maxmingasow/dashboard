'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Color } from '@prisma/client'
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
  value: z
    .string()
    .min(4)
    .regex(/^#([0-9a-f]{3}){1,2}$/i, 'Invalid color value.'),
})

type ColorFormValues = z.infer<typeof formSchema>

type Props = {
  initialData: Color | null
}

export function ColorForm({ initialData }: Props) {
  // get color id from url
  const params = useParams()
  // get router object
  const router = useRouter()
  // open and close delete confirmation modal
  const [open, setOpen] = useState(false)
  // loading state for form submission
  const [loading, setLoading] = useState(false)

  const title = initialData ? 'Edit color' : 'Create color'
  const description = initialData ? 'Edit the current color' : 'Create a new color'
  const toastMessage = initialData ? 'Color has updated to' : 'color has created'
  const action = initialData ? 'Save changes' : 'Create'

  // initialize react-hook-form with initial values and validation schema
  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          value: initialData.value,
        }
      : undefined,
  })

  // called when form is submitted
  const onSubmit = async (values: ColorFormValues) => {
    try {
      setLoading(true)

      if (initialData) await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, values)
      else await axios.post(`/api/${params.storeId}/colors`, values)

      router.refresh()
      router.push(`/${params.storeId}/colors`)
      toast.success(
        initialData ? toastMessage + ' ' + values.name : values.name + ' ' + toastMessage,
      )
    } catch (error) {
      toast.error("Couldn't update color")
    } finally {
      setLoading(false)
    }
  }

  // called when delete button is clicked
  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`)
      router.refresh()
      router.push(`/${params.storeId}/colors`)
      toast.success('Color has deleted.')
    } catch (error) {
      toast.error('Make sure you removed all products with this color.')
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
            Delete Color
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
                    <Input disabled={loading} placeholder="Color name" {...field} />
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
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <Input disabled={loading} placeholder="#000000" {...field} />
                      <span
                        className="rounded-full border p-4"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
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
