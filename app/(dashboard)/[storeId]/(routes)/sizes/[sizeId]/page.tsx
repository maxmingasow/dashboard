import { prismadb } from '@/lib/prismadb'

import { SizeForm } from './components/size-form'

export default async function SizePage({ params }: { params: { sizeId: string } }) {
  const size = await prismadb.size.findUnique({
    where: { id: params.sizeId },
  })

  return (
    <div className="mx-auto w-screen max-w-7xl px-4 pt-14 md:px-8">
      <div className="flex-1 space-y-4 p-6">
        <SizeForm initialData={size} />
      </div>
    </div>
  )
}
