import { prisma } from "@/lib/prisma"
import { PropertyCard } from "./property-card"

interface FilteredPropertiesProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function FilteredProperties({
  searchParams,
}: FilteredPropertiesProps) {
  const properties = await prisma.property.findMany({
    where: {
      OR: searchParams.search
        ? [
            { title: { contains: searchParams.search as string, mode: "insensitive" } },
            { description: { contains: searchParams.search as string, mode: "insensitive" } },
            { location: { contains: searchParams.search as string, mode: "insensitive" } },
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
    orderBy: searchParams.sort
      ? {
          price: searchParams.sort === "asc" ? "asc" : "desc",
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