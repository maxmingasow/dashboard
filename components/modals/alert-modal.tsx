'use client'

import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'

type Props = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  loading: boolean
}

/**
 * AlertModal component displays a modal with a title, description, and two buttons for confirming or cancelling an action.
 * @param isOpen - A boolean value indicating whether the modal is open or not.
 * @param onClose - A function that will be called when the modal is closed.
 * @param onConfirm - A function that will be called when the confirm button is clicked.
 * @param loading - A boolean value indicating whether the confirm button is in a loading state or not.
 * @returns A React component that displays a modal with a title, description, and two buttons for confirming or cancelling an action.
 */
export function AlertModal({ isOpen, onClose, onConfirm, loading }: Props) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => setIsMounted(true), [])

  if (!isMounted) return null

  return (
    <Modal
      title="Are you absolutely sure?"
      description="This action cannot be undone. This will permanently delete your products and categories."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex w-full items-center justify-center space-x-2 pt-8">
        <Button disabled={loading} onClick={onClose} variant="outline">
          Cancel
        </Button>
        <Button isLoading={loading} onClick={onConfirm} variant="destructive">
          Delete
        </Button>
      </div>
    </Modal>
  )
}
