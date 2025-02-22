'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Booking, Status } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { Role } from "@prisma/client"

interface BookingCardProps {
  booking: Booking & {
    property: {
      title: string
      price: number
      hostId: string
      host: {
        name: string | null
      }
    }
    renter: {
      name: string | null
    }
  }
}

export function BookingCard({ booking }: BookingCardProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const isHost = session?.user?.role === Role.HOST && session?.user?.id === booking.property.hostId

  // Format date for display
  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date))
  }

  const updateStatus = async (status: Status) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error("Failed to update booking")

      toast.success("Booking status updated")
      router.refresh()
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate total nights
  const calculateNights = () => {
    const start = new Date(booking.checkIn).getTime()
    const end = new Date(booking.checkOut).getTime()
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  }

  const totalNights = calculateNights()
  const totalPrice = booking.property.price * totalNights

  return (
    <Card>
      <CardHeader>
        <CardTitle>{booking.property.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="flex justify-between text-sm">
            <span>Check-in</span>
            <span>{formatDate(booking.checkIn)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Check-out</span>
            <span>{formatDate(booking.checkOut)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Duration</span>
            <span>{totalNights} night{totalNights > 1 ? 's' : ''}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Status</span>
            <span className={`capitalize ${
              booking.status === 'CONFIRMED' ? 'text-green-600' :
              booking.status === 'CANCELED' ? 'text-red-600' :
              'text-yellow-600'
            }`}>
              {booking.status.toLowerCase()}
            </span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>

          {/* Only show action buttons for hosts */}
          {isHost && booking.status === "PENDING" && (
            <div className="flex gap-2 mt-4">
              <Button
                onClick={() => updateStatus("CONFIRMED")}
                disabled={isLoading}
                className="flex-1"
              >
                Confirm
              </Button>
              <Button
                onClick={() => updateStatus("CANCELED")}
                disabled={isLoading}
                variant="destructive"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}