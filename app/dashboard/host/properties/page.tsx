import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { PropertyCard } from "@/components/properties/property-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function HostPropertiesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const properties = await prisma.property.findMany({
    where: {
      hostId: session.user.id
    },
    include: {
      host: {
        select: {
          name: true,
          image: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Properties</h1>
        <Button asChild>
          <Link href="/properties/create">
            <Plus className="h-4 w-4 mr-2" />
            Add New Property
          </Link>
        </Button>
      </div>

      {properties.length === 0 ? (
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            You haven't listed any properties yet.
          </p>
          <Button asChild>
            <Link href="/properties/create">
              List Your First Property
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              showActions={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}