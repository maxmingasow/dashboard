'use client'

import toast from 'react-hot-toast'
import { BiCopy, BiSolidServer } from 'react-icons/bi'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge, BadgeProps } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type Props = {
  title: string
  description: string
  variant: 'public' | 'admin'
}

const textMap: Record<Props['variant'], string> = {
  public: 'Public',
  admin: 'Admin',
}

const variantMap: Record<Props['variant'], BadgeProps['variant']> = {
  public: 'secondary',
  admin: 'destructive',
}

export function ApiAlert({ title, description, variant }: Props) {
  const onCopy = () => {
    navigator.clipboard.writeText(description)
    toast.success('API Route Copied to clipboard')
  }

  return (
    <Alert>
      <BiSolidServer className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-x-2">
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className="mt-4 flex items-center justify-between">
        <code className="rounded-md bg-muted p-1.5">{description}</code>
        <Button onClick={onCopy} variant="outline" size="icon">
          <BiCopy className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  )
}
