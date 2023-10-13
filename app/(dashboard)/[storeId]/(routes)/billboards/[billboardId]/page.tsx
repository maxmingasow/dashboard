import { prismadb } from '@/lib/prismadb'

import { BillboardForm } from './components/billboard-form'

/**
 * Renders the page for a specific billboard.
 * @param {Object} props - The component props.
 * @param {Object} props.params - The route parameters.
 * @param {string} props.params.billboardId - The ID of the billboard to display.
 * @returns {JSX.Element} - The rendered component.
 */
export default async function BillboardPage({ params }: { params: { billboardId: string } }) {
  const billboard = await prismadb.billboard.findUnique({
    where: { id: params.billboardId },
  })

  return (
    <div className="mx-auto w-screen max-w-7xl px-4 pt-14 md:px-8">
      <div className="flex-1 space-y-4 p-6">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  )
}
