import { prismadb } from '@/lib/prismadb'

import { ColorForm } from './components/color-form'

export default async function ColorPage({ params }: { params: { colorId: string } }) {
  const color = await prismadb.color.findUnique({
    where: { id: params.colorId },
  })

  return (
    <div className="mx-auto w-screen max-w-7xl px-4 pt-14 md:px-8">
      <div className="flex-1 space-y-4 p-6">
        <ColorForm initialData={color} />
      </div>
    </div>
  )
}
