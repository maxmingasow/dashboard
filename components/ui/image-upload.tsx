'use client'

import { useEffect, useState } from 'react'

import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import { CldUploadWidget } from 'next-cloudinary'
import { BiImageAdd } from 'react-icons/bi'

import { Button } from '@/components/ui/button'

type Props = {
  disabled: boolean
  onChange: (value: string) => void
  onRemove: (value: string) => void
  value: string[]
}

/**
 * A component that allows users to upload and display images.
 * @param disabled - A boolean indicating whether the component is disabled or not.
 * @param onChange - A callback function that is called when an image is uploaded.
 * @param onRemove - A callback function that is called when an image is removed.
 * @param value - An array of strings representing the URLs of the images to be displayed.
 * @returns A React component that renders an image upload and display interface.
 */
export function ImageUpload({ disabled, onChange, onRemove, value }: Props) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => setIsMounted(true), [])

  /**
   * Callback function that is called when an image is uploaded.
   * @param result - The result object containing information about the uploaded image.
   */
  const onUpload = (result: any) => {
    onChange(result.info.secure_url)
  }

  if (!isMounted) return null

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-4">
        {value.map((url) => (
          <div key={url} className="relative h-48 w-48 overflow-hidden rounded-md">
            <div className="absolute right-2 top-2 z-10">
              <Button type="button" onClick={() => onRemove(url)} variant="outline" size="icon">
                <Trash2 className="h-5 w-5 text-destructive" />
              </Button>
            </div>
            <Image fill alt="Image" className="object-cover" src={url} />
          </div>
        ))}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset="aaaabifl">
        {({ open }) => {
          const onClick = () => {
            open()
          }
          return (
            <Button type="button" variant="secondary" onClick={onClick} disabled={disabled}>
              <BiImageAdd className="mr-2 h-6 w-6" />
              Upload Image
            </Button>
          )
        }}
      </CldUploadWidget>
    </>
  )
}
