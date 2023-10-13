import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { prismadb } from '@/lib/prismadb'

export default async function SetupLayout({ children }: { children: React.ReactNode }) {
  // Get the authenticated user's id
  const { userId } = auth()

  // If the user is not authenticated, redirect them to the sign-in page
  if (!userId) redirect('/sign-in')

  // Find the user's store in the database
  const store = await prismadb.store.findFirst({
    where: { userId },
  })

  // If the user has a store, redirect them to (dashboard) > [storeId] > layout.tsx
  if (store) redirect(`/${store.id}`)

  return <>{children}</>
}
