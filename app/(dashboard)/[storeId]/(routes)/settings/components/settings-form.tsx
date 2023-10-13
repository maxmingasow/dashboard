'use client'

import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Store } from '@prisma/client'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as z from 'zod'

import { AlertModal } from '@/components/modals/alert-modal'
import { ApiAlert } from '@/components/ui/api-alert'
import { Button } from '@/components/ui/button'
// prettier-ignore
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from '@/components/ui/form'
import { Heading } from '@/components/ui/heading'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useOrigin } from '@/lib/hooks/use-origin'

const formSchema = z.object({
  name: z.string().min(3, 'Store name is too short').max(30, 'Store name is too long'),
})

type SettingsFormValues = z.infer<typeof formSchema>

type Props = {
  initialData: Store
  storeName?: string
}

export function SettingsForm({ initialData, storeName }: Props) {
  // get store id from url
  const params = useParams()
  // get router object
  const router = useRouter()
  // get origin of the request
  const origin = useOrigin()
  // open and close delete confirmation modal
  const [open, setOpen] = useState(false)
  // loading state for form submission
  const [loading, setLoading] = useState(false)

  // initialize react-hook-form with initial values and validation schema
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  })

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => setIsMounted(true), [])
  if (!isMounted) return null

  // called when form is submitted
  const onSubmit = async (values: SettingsFormValues) => {
    try {
      setLoading(true)

      await axios.patch(`/api/stores/${params.storeId}`, values)

      router.refresh()
      toast.success('Store has updated')
    } catch (error) {
      toast.error("Couldn't update store")
    } finally {
      setLoading(false)
    }
  }

  // called when delete button is clicked
  const onDelete = async () => {
    try {
      setLoading(true)

      await axios.delete(`/api/stores/${params.storeId}`)

      router.refresh()
      toast.success('Store has deleted.')
    } catch (error) {
      toast.error("Make sure you don't have any products/categories in your store")
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
        <Heading title="Settings" description={`Update settings for ${storeName}`} />
        <Button disabled={loading} onClick={() => setOpen(true)} variant="destructive">
          Delete Store
        </Button>
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
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Change store name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button isLoading={loading} type="submit" className="ml-auto">
            Save changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />
    </>
  )
}
