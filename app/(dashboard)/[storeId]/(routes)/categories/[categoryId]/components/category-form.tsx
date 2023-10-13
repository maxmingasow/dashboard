'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Billboard, Category } from '@prisma/client'
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
// prettier-ignore
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

const formSchema = z.object({
  name: z.string().min(3, 'Name is too short.').max(30, 'Name is too long.'),
  billboardId: z.string().min(1),
})

type CategoryFormValues = z.infer<typeof formSchema>

type Props = {
  initialData: Category | null
  billboards: Billboard[]
}

export function CategoryForm({ initialData, billboards }: Props) {
  // get category id from url
  const params = useParams()
  // get router object
  const router = useRouter()
  // open and close delete confirmation modal
  const [open, setOpen] = useState(false)
  // loading state for form submission
  const [loading, setLoading] = useState(false)

  const title = initialData ? 'Edit category' : 'Create category'
  const description = initialData ? 'Edit the current category' : 'Add a new category'
  const toastMessage = initialData ? 'Category has updated to' : 'A new category has created'
  const action = initialData ? 'Save changes' : 'Create'

  // initialize react-hook-form with initial values and validation schema
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          billboardId: initialData.billboardId,
        }
      : undefined,
  })

  // called when form is submitted
  const onSubmit = async (values: CategoryFormValues) => {
    try {
      setLoading(true)

      if (initialData)
        await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, values)
      else await axios.post(`/api/${params.storeId}/categories`, values)

      router.refresh()
      router.push(`/${params.storeId}/categories`)
      toast.success(toastMessage + ' ' + values.name)
    } catch (error) {
      toast.error("Couldn't update category")
    } finally {
      setLoading(false)
    }
  }

  // called when delete button is clicked
  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)
      router.refresh()
      toast.success('Category has deleted.')
    } catch (error) {
      toast.error('Make sure you removed all products in this category')
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
            Delete Category
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
                    <Input disabled={loading} placeholder="Category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="billboardId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a billboard" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((billboard) => (
                        <SelectItem key={billboard.id} value={billboard.id}>
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
