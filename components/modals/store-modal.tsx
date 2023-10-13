'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { useStoreModal } from '@/lib/hooks/use-store-modal'

const formSchema = z.object({
  name: z.string().min(3, 'Store name is too short').max(30, 'Store name is too long'),
})

export function StoreModal() {
  const storeModal = useStoreModal()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '' },
  })

  /**
   * Handles form submission for creating a new store.
   * @param values - The form values to be submitted.
   */
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      const response = await axios.post('/api/stores', values)
      router.refresh()
      window.location.assign(`/${response.data.id}`)
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title="Create store"
      description="create a new store & manage products/categories"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Create new store" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-4 flex justify-end space-x-4">
              <Button disabled={loading} variant="outline" onClick={storeModal.onClose}>
                Cancel
              </Button>
              <Button isLoading={loading}>Continue</Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  )
}
