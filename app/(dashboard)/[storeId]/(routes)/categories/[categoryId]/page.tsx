import { prismadb } from '@/lib/prismadb'

import { CategoryForm } from './components/category-form'

export default async function CategoryPage({
  params,
}: {
  params: { categoryId: string; storeId: string }
}) {
  const category = await prismadb.category.findUnique({
    where: { id: params.categoryId },
  })

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
  })

  return (
    <div className="mx-auto w-screen max-w-7xl px-4 pt-14 md:px-8">
      <div className="flex-1 space-y-4 p-6">
        <CategoryForm initialData={category} billboards={billboards} />
      </div>
    </div>
  )
}
