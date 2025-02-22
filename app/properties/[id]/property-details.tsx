import { formatPrice } from "@/lib/utils"
import { Property, User } from "@prisma/client"
import { PropertyActions } from "@/components/properties/property-actions"
import { ImageIcon } from "lucide-react"

interface PropertyDetailsProps {
  property: Property & {
    host: Pick<User, "name" | "email" | "image">
  }
}

export function PropertyDetails({ property }: PropertyDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
        {property.imageUrl ? (
          <img
            src={property.imageUrl}
            alt={property.title}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-muted">
            <ImageIcon className="h-10 w-10 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{property.title}</h1>
          <p className="text-muted-foreground">{property.location}</p>
        </div>
        <PropertyActions propertyId={property.id} />
      </div>

      <div className="border-t pt-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-muted">
            {property.host.image && (
              <img
                src={property.host.image}
                alt={property.host.name || ""}
                className="rounded-full"
              />
            )}
          </div>
          <div>
            <p className="font-medium">Hosted by {property.host.name}</p>
            <p className="text-sm text-muted-foreground">Property host</p>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">About this place</h2>
        <p className="text-muted-foreground whitespace-pre-wrap">
          {property.description}
        </p>
      </div>
    </div>
  )
}