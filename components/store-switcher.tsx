'use client'

import { useState } from 'react'

import { Store } from '@prisma/client'
import { useParams, useRouter } from 'next/navigation'
import { AiOutlineAppstoreAdd } from 'react-icons/ai'
import { HiCheck, HiChevronUpDown, HiOutlinePlusCircle } from 'react-icons/hi2'

import { Button } from '@/components/ui/button'
// prettier-ignore
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useStoreModal } from '@/lib/hooks/use-store-modal'
import { cn } from '@/lib/utils'

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

type Props = {
  onSidebarOpen: boolean
  items: Store[]
} & PopoverTriggerProps

export default function StoreSwitcher({ items = [], onSidebarOpen }: Props) {
  const StoreModal = useStoreModal()
  const params = useParams()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  /**
   * Formats the items array into an array of objects with label and value properties.
   * @param items - The array of items to format.
   * @returns An array of objects with label and value properties.
   */
  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }))

  /**
   * Finds the current store based on the provided store ID parameter.
   * @param formattedItems - An array of formatted store items.
   * @param params - An object containing the current store ID.
   * @returns The current store object if found, otherwise undefined.
   */
  const currentStore = formattedItems.find((item) => item.value === params.storeId)

  /**
   * Handles the selection of a store and navigates to the selected store's page.
   * @param {Object} store - The selected store object containing a value and label.
   * @param {string} store.value - The value of the selected store.
   * @param {string} store.label - The label of the selected store.
   * @returns {void}
   */
  const onStoreSelect = (store: { value: string; label: string }) => {
    setOpen(false)
    router.push(`/${store.value}`)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className={cn(onSidebarOpen || 'border-none')}>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a store"
          className={cn('w-60 justify-between')}
        >
          <AiOutlineAppstoreAdd className="mr-2 h-6 w-6" />
          {onSidebarOpen ? currentStore?.label || 'Select a store' : ''}
          <HiChevronUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-1">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search store..." />
            <CommandEmpty>No store found!</CommandEmpty>
            <CommandGroup heading="Your stores:">
              {formattedItems.map((store) => (
                <CommandItem
                  key={store.value}
                  onSelect={() => onStoreSelect(store)}
                  className="text-sm"
                >
                  {store.label}
                  <HiCheck
                    className={cn(
                      'ml-auto h-4 w-4',
                      currentStore?.value === store.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  StoreModal.onOpen()
                }}
                className="cursor-pointer"
              >
                <HiOutlinePlusCircle className="mr-2 h-5 w-5" />
                Create store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
