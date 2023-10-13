import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { prismadb } from '@/lib/prismadb'

import { SettingsForm } from './components/settings-form'

type Props = {
  params: {
    storeId: string
  }
}

export default async function SettingsPage({ params }: Props) {
  const { userId } = auth()

  if (!userId) redirect('/sign-in')

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  })

  if (!store) redirect('/')

  return (
    <div className="mx-auto w-screen max-w-7xl space-y-4 px-4 pt-14 md:px-8">
      <SettingsForm initialData={store} storeName={store?.name} />
    </div>
  )
}
