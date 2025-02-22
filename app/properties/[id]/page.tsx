import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { PropertyDetails } from "./property-details"
import { BookingForm } from "./booking-form"

interface PropertyPageProps {
  params: {
    id: string
  }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const session = await getServerSession(authOptions)
  
  const property = await prisma.property.findUnique({
    where: { id: params.id },
    include: {
      host: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
      bookings: {
        select: {
          checkIn: true,
          checkOut: true,
          status: true,
        },
        where: {
          status: "CONFIRMED",
        },
      },
    },
  })

  if (!property) {
    notFound()
  }

  return (
    <div className="container max-w-7xl py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PropertyDetails property={property} />
        {session?.user && session.user.id !== property.hostId && (
          <div className="lg:sticky lg:top-20 h-fit">
            <BookingForm property={property} />
          </div>
        )}
      </div>
    </div>
  )
}