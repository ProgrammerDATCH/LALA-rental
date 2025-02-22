"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Booking, Status } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { toast } from "sonner"

interface BookingCardProps {
  booking: Booking & {
    property: {
      title: string
      price: number
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
  const [isLoading, setIsLoading] = useState(false)

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{booking.property.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="flex justify-between text-sm">
            <span>Check-in</span>
            <span>{format(new Date(booking.checkIn), "LLL dd, y")}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Check-out</span>
            <span>{format(new Date(booking.checkOut), "LLL dd, y")}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Status</span>
            <span className="capitalize">{booking.status.toLowerCase()}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>
              {formatPrice(
                booking.property.price *
                  Math.ceil(
                    (new Date(booking.checkOut).getTime() -
                      new Date(booking.checkIn).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )
              )}
            </span>
          </div>

          {booking.status === "PENDING" && (
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