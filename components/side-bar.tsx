'use client'

import { useState } from 'react'

import { Store } from '@prisma/client'
import { ArrowLeft, Menu } from 'lucide-react'

import { MainNav } from '@/components/main-nav'
import StoreSwitcher from '@/components/store-switcher'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Props = {
  children: React.ReactNode
  stores: Store[]
}

export default function SideBar({ children, stores }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative flex h-screen border px-2 pt-6 shadow-md">
      <Button
        onClick={() => setOpen(!open)}
        variant="outline"
        size="icon"
        className={cn(
          'absolute -right-[40px] -top-[1px] z-10 rounded-none border-l-0',
          open || '-right-[1px] w-full',
        )}
      >
        {open ? <ArrowLeft size={20} /> : <Menu size={20} />}
      </Button>
      <div
        className={cn(
          'relative flex flex-col items-start justify-between overflow-hidden transition-all duration-300 ',
          open ? 'w-60' : 'w-[52px]',
        )}
      >
        <div>
          <div className="py-5">
            <StoreSwitcher items={stores} onSidebarOpen={open} />
          </div>
          <MainNav />
        </div>
        {children}
      </div>
    </div>
  )
}
