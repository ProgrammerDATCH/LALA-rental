
import { prisma } from "@/lib/prisma"
import { PropertiesGrid } from "./properties-grid"

interface FilteredPropertiesProps {
  searchParams: {
    search?: string
    sort?: string
  }
}

export async function FilteredProperties({ searchParams }: FilteredPropertiesProps) {
  const { search, sort } = searchParams

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

  return <PropertiesGrid properties={properties} />
}
