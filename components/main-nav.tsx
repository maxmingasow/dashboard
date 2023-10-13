'use client'

import {
  GalleryThumbnails,
  GanttChart,
  LayoutDashboard,
  LayoutList,
  PackageSearch,
  Palette,
  Pencil,
  Settings,
} from 'lucide-react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const params = useParams()

  const routes = [
    {
      href: '/',
      name: 'Dashboard',
      active: pathname === `/${params.storeId}`,
      icon: <LayoutDashboard size={20} />,
    },
    {
      href: `/${params.storeId}/billboards`,
      name: 'Billboards',
      active: pathname === `/${params.storeId}/billboards`,
      icon: <GalleryThumbnails size={20} />,
    },
    {
      href: `/${params.storeId}/categories`,
      name: 'Categories',
      active: pathname === `/${params.storeId}/categories`,
      icon: <GanttChart size={20} />,
    },
    {
      href: `/${params.storeId}/products`,
      name: 'Products',
      active: pathname === `/${params.storeId}/products`,
      icon: <PackageSearch size={20} />,
    },
    {
      href: `/${params.storeId}/sizes`,
      name: 'Sizes',
      active: pathname === `/${params.storeId}/sizes`,
      icon: <Pencil size={20} />,
    },
    {
      href: `/${params.storeId}/colors`,
      name: 'Colors',
      active: pathname === `/${params.storeId}/colors`,
      icon: <Palette size={20} />,
    },
    {
      href: `/${params.storeId}/orders`,
      name: 'Orders',
      active: pathname === `/${params.storeId}/orders`,
      icon: <LayoutList size={20} />,
    },
    {
      href: `/${params.storeId}/settings`,
      name: 'Settings',
      active: pathname === `/${params.storeId}/settings`,
      icon: <Settings size={20} />,
    },
  ]

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex-col gap-y-2">
        {routes.map((route) => (
          <NavigationMenuItem key={route.href} className="mx-0 flex w-full px-0">
            <Link
              href={route.href}
              className={cn(
                navigationMenuTriggerStyle(),
                route.active
                  ? 'border-b bg-accent text-accent-foreground'
                  : 'text-muted-foreground',
                'flex w-full cursor-pointer justify-start gap-x-4',
              )}
            >
              {route.icon}
              {route.name}
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
