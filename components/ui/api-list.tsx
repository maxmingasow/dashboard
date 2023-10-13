'use client'

import { useParams } from 'next/navigation'

import { useOrigin } from '@/lib/hooks/use-origin'

import { ApiAlert } from './api-alert'

type Props = {
  entityName: string
  entityId: string
}

/**
 * Renders a list of API endpoints for a given entity.
 * @param {Object} props - The component props.
 * @param {string} props.entityName - The name of the entity.
 * @param {string} props.entityId - The ID of the entity.
 * @returns {JSX.Element} - The rendered component.
 */
export function ApiList({ entityName, entityId }: Props) {
  const params = useParams()
  const origin = useOrigin()

  const baseUrl = `${origin}/api/${params.storeId}`

  return (
    <>
      <ApiAlert title="GET" variant="public" description={`${baseUrl}/${entityName}`} />
      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseUrl}/${entityName}/{${entityId}}`}
      />
      <ApiAlert title="POST" variant="admin" description={`${baseUrl}/${entityName}`} />
      <ApiAlert
        title="PATCH"
        variant="admin"
        description={`${baseUrl}/${entityName}/{${entityId}}`}
      />
      <ApiAlert
        title="DELETE"
        variant="admin"
        description={`${baseUrl}/${entityName}/{${entityId}}`}
      />
    </>
  )
}
