import { UserButton, auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import SideBar from '@/components/side-bar'
import { ToggleTheme } from '@/components/ui/toggle-theme'
import { prismadb } from '@/lib/prismadb'

export async function NavBar() {
  const { userId } = auth()

  if (!userId) redirect('/sing-in')

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  })

  return (
    <header>
      <SideBar stores={stores}>
        <div className="flex flex-col items-center gap-y-2 pb-2">
          <ToggleTheme />
          <UserButton afterSignOutUrl="/" />
        </div>
      </SideBar>
    </header>
  )
}
