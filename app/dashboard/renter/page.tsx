import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Role } from "@prisma/client"
import { BookingList } from "@/components/bookings/booking-list"

export default async function RenterDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== Role.RENTER) {
    redirect("/")
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
      <BookingList />
    </div>
  )
}