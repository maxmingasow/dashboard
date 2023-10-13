'use client'

import { useEffect, useState } from 'react'

// prettier-ignore
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type Props = {
  title: string
  description: string
  isOpen: boolean
  onClose: () => void
  children?: React.ReactNode
}

export function Modal({ title, description, isOpen, onClose, children }: Props) {
  // Hack for Hydration mismatch error
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => setIsMounted(true), [])

  if (!isMounted) return null

  const onChange = (open: boolean) => {
    if (!open) {
      onClose?.()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
