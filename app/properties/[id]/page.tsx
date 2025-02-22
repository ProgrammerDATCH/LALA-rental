import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { PropertyDetails } from "./property-details"
import { ClientBookingForm } from "./client-booking-form"

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
          OR: [
            { status: "CONFIRMED" },
            { status: "PENDING" }
          ]
        },
      },
    },
  })

  if (!property) {
    notFound()
  }

  // Check if the current user is the host
  const isHost = session?.user?.id === property.hostId

  return (
    <div className="container py-10">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Property details - takes up 3 columns */}
        <div className="lg:col-span-3">
          <PropertyDetails property={property} />
        </div>
        
        {/* Booking form - takes up 2 columns */}
        {session?.user && !isHost && (
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-20">
              <ClientBookingForm 
                property={property}
                bookings={property.bookings}
                userId={session.user.id}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}