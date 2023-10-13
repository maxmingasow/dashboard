'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Billboard } from '@prisma/client'
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
import { ImageUpload } from '@/components/ui/image-upload'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

const formSchema = z.object({
  label: z.string().min(3, 'Label is too short.').max(100, 'Label is too long.'),
  imageUrl: z.string().min(1),
})

type BillboardFormValues = z.infer<typeof formSchema>

type Props = {
  initialData: Billboard | null
}

export function BillboardForm({ initialData }: Props) {
  // get billboard id from url
  const params = useParams()
  // get router object
  const router = useRouter()
  // open and close delete confirmation modal
  const [open, setOpen] = useState(false)
  // loading state for form submission
  const [loading, setLoading] = useState(false)

  const title = initialData ? 'Edit billboard' : 'Create billboard'
  const description = initialData ? 'Edit the current billboard' : 'Create a new billboard'
  const toastMessage = initialData ? 'Billboard has updated to' : 'A new billboard has created'
  const action = initialData ? 'Save changes' : 'Create'

  // initialize react-hook-form with initial values and validation schema
  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          label: initialData.label,
          imageUrl: initialData.imageUrl,
        }
      : undefined,
  })

  /**
   * Submits the billboard form data to the server.
   * @param {BillboardFormValues} values - The form values to submit.
   * @returns {Promise<void>} - A Promise that resolves when the submission is complete.
   */
  const onSubmit = async (values: BillboardFormValues) => {
    try {
      setLoading(true)

      if (initialData)
        await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, values)
      else await axios.post(`/api/${params.storeId}/billboards`, values)

      router.refresh()
      router.push(`/${params.storeId}/billboards`)
      toast.success(toastMessage + ' ' + values.label)
    } catch (error) {
      toast.error("Couldn't update store")
    } finally {
      setLoading(false)
    }
  }

  /**
   * Deletes a billboard from the server and refreshes the page.
   * Displays a success message if the deletion is successful, or an error message if there are categories in the billboard.
   * @returns {Promise<void>}
   */
  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
      router.refresh()
      toast.success('Billboard has deleted.')
    } catch (error) {
      toast.error("Make sure you don't have any categories in this billboard")
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
            Delete Billboard
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
          <FormField
            name="imageUrl"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange('')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-4">
            <FormField
              name="label"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Billboard label" {...field} />
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
