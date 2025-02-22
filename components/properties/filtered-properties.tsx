'use client'

import { useSearchParams } from 'next/navigation'
import { PropertiesGrid } from './properties-grid'

export function FilteredProperties() {
  const searchParams = useSearchParams()
  const search = searchParams.get('search')
  const sort = searchParams.get('sort')

  return <PropertiesGrid search={search} sort={sort} />
}