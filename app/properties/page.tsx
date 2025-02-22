import { Suspense } from "react"
import { PropertySearch } from "@/components/properties/property-search"
import { PropertyFilters } from "@/components/properties/property-filters"
import { FilteredProperties } from "@/components/properties/filtered-properties"
import { Loading } from "@/components/ui/loading"

interface PropertiesPageProps {
  searchParams: {
    search?: string | string[]
    sort?: string | string[]
  }
}

export default async function PropertiesPage({
  searchParams,
}: PropertiesPageProps) {
  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold tracking-tight">All Properties</h1>
          <div className="flex items-center gap-4">
            <PropertySearch />
            <PropertyFilters />
          </div>
        </div>
        <Suspense fallback={<Loading />}>
          <FilteredProperties searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}