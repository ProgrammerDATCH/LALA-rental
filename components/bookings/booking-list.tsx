import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import { BookingCard } from "./booking-card"

export async function BookingList() {
  const session = await getServerSession(authOptions)
  if (!session) {console.log("NO SESSION");return null}

  const bookings = await prisma.booking.findMany({
    where: {
      OR: [
        { renterId: session.user.id },
        {
          property: {
            hostId: session.user.id
          }
        }
      ]
    },
    include: {
      property: {
        include: {
          host: {
            select: {
              name: true,
              email: true,
              image: true
            }
          }
        }
      },
      renter: {
        select: {
          name: true,
          email: true,
          image: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  return (
    <div className="grid gap-4">
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  )
}