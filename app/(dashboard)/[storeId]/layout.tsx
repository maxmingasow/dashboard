import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { NavBar } from '@/components/navbar'
import { prismadb } from '@/lib/prismadb'

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { storeId: string }
}) {
  // Get the authenticated user's id
  const { userId } = auth()

  // If the user is not authenticated, redirect them to the sign-in page
  if (!userId) redirect('/sign-in')

  // Find the user's store in the database
  const store = await prismadb.store.findFirst({
    where: { id: params.storeId, userId },
  })

  // If the user does not have a store, redirect them to the setup page
  if (!store) redirect('/')

  return (
    <div className="flex">
      <NavBar />
      {children}
    </div>
  )
}
