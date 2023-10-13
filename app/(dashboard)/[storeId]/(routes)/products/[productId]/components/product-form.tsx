'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Category, Color, Image, Product, Size } from '@prisma/client'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as z from 'zod'

import { AlertModal } from '@/components/modals/alert-modal'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
// prettier-ignore
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from '@/components/ui/form'
import { Heading } from '@/components/ui/heading'
import { ImageUpload } from '@/components/ui/image-upload'
import { Input } from '@/components/ui/input'
// prettier-ignore
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

const formSchema = z.object({
  name: z.string().min(3, 'Name is too short.').max(30, 'Name is too long.'),
  description: z.string().min(3, 'Description is too short.').max(200, 'Description is too long.'),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1).positive('Price must be positive.'),
  categoryId: z.string().min(1, 'Category is required.'),
  sizeId: z.string().min(1, 'Size is required.'),
  colorId: z.string().min(1, 'Color is required.'),
  isFeatured: z.boolean().default(false).optional(),
  inStock: z.boolean().default(true).optional(),
})

type ProductFormValues = z.infer<typeof formSchema>

interface Props {
  initialData: (Product & { images: Image[] }) | null
  categories: Category[]
  sizes?: Size[]
  colors?: Color[]
}

export function ProductForm({ initialData, categories, sizes, colors }: Props) {
  // get product id from url
  const params = useParams()
  // get router object
  const router = useRouter()
  // open and close delete confirmation modal
  const [open, setOpen] = useState(false)
  // loading state for form submission
  const [loading, setLoading] = useState(false)

  const title = initialData ? 'Edit product' : 'Add Product'
  const toastMessage = initialData ? 'Product has updated.' : 'A new product has created.'
  const action = initialData ? 'Save' : 'Create'

  // initialize react-hook-form with initial values and validation schema
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          price: parseFloat(initialData.price.toString()),
        }
      : {
          name: '',
          images: [],
          price: 0,
          categoryId: '',
          sizeId: '',
          colorId: '',
          isFeatured: false,
          inStock: true,
        },
  })

  // called when form is submitted
  const onSubmit = async (values: ProductFormValues) => {
    try {
      setLoading(true)

      if (initialData)
        await axios.patch(`/api/${params.storeId}/products/${params.productId}`, values)
      else await axios.post(`/api/${params.storeId}/products`, values)

      router.refresh()
      router.push(`/${params.storeId}/products`)
      toast.success(toastMessage)
    } catch (error) {
      toast.error("Couldn't update Product.")
    } finally {
      setLoading(false)
    }
  }

  // called when delete button is clicked
  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
      router.refresh()
      toast.success('Product has deleted.')
    } catch (error) {
      toast.error("Something went wrong. Couldn't delete product.")
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
        <Heading title={title} />
        {initialData && (
          <Button disabled={loading} onClick={() => setOpen(true)} variant="destructive">
            Delete Product
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4 lg:flex-row"
        >
          {/* Flex item left */}
          <div className="flex w-full flex-col gap-y-4 border bg-background p-4 lg:w-2/3">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Type your message here." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="images"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Images</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value.map((image) => image.url)}
                      disabled={loading}
                      onChange={(url) => field.onChange([...field.value, { url }])}
                      onRemove={(url) =>
                        field.onChange([...field.value.filter((current) => current.url !== url)])
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="categoryId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button isLoading={loading} type="submit" className="ml-auto">
              {action}
            </Button>
          </div>

          {/* Flex item right */}
          <div className="flex w-full flex-col gap-y-4 border bg-background p-4 lg:w-1/3">
            <FormField
              name="price"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} placeholder="1.99" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="sizeId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizes?.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="colorId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors?.map((color) => (
                        <SelectItem key={color.id} value={color.id}>
                          {color.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Is Featured */}
            <FormField
              name="isFeatured"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      disabled={loading}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription className="text-xs text-accent-foreground">
                      Featured products will be shown in the home page.
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* In Stock */}
            <FormField
              name="inStock"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      disabled={loading}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>In stock?</FormLabel>
                    <FormDescription className="text-xs text-accent-foreground">
                      If the product is not in stock, it will not be shown in the store.
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </>
  )
}
