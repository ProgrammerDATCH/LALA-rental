import { PropertyCard } from "./property-card"
import type { Property, User } from "@prisma/client"

interface PropertyWithHost extends Property {
  host: Pick<User, "name" | "image">
}

interface PropertiesGridProps {
  properties: PropertyWithHost[]
}

export function PropertiesGrid({ properties }: PropertiesGridProps) {
  if (!properties.length) {
    return (
      <div className="text-center">
        <p className="text-lg text-muted-foreground">No properties found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}
