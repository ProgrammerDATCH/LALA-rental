import { ImageIcon } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Property } from "@prisma/client"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { PropertyCardActions } from "./property-card-actions"

interface PropertyWithHost extends Property {
  host: {
    name: string | null
    image: string | null
  }
}

interface PropertyCardProps {
  property: PropertyWithHost
  showActions?: boolean
}

export function PropertyCard({ property, showActions }: PropertyCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="p-0">
        <div className="aspect-square relative bg-muted">
          {property.imageUrl ? (
            <img
              src={property.imageUrl}
              alt={property.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-muted">
              <ImageIcon className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
          <div className="absolute bottom-2 right-2 flex items-center rounded-lg bg-black/60 p-1 text-white">
            <span className="text-sm">{formatPrice(property.price)}/night</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2.5 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold leading-none">
            <Link href={`/properties/${property.id}`}>
              {property.title}
            </Link>
          </h3>
          <PropertyCardActions 
            propertyId={property.id}
            hostId={property.hostId}
            showActions={showActions}
          />
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {property.description}
        </p>
        <div className="text-sm text-muted-foreground">
          {property.location}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          <span>Hosted by {property.host.name}</span>
        </div>
      </CardFooter>
    </Card>
  )
}