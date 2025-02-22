import { prisma } from "@/lib/prisma"
import { PropertyCard } from "./property-card"

interface PropertiesGridProps {
  search: string | null
  sort: string | null
}

export async function PropertiesGrid({
  search,
  sort,
}: PropertiesGridProps) {
  const properties = await prisma.property.findMany({
    where: {
      OR: search
        ? [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { location: { contains: search, mode: "insensitive" } },
          ]
        : undefined,
    },
    include: {
      host: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: sort
      ? {
          price: sort === "asc" ? "asc" : "desc",
        }
      : {
          createdAt: "desc",
        },
  })

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