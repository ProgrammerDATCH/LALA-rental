"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { formatPrice } from "@/lib/utils"
import { toast } from "sonner"
import { addDays, differenceInDays, format } from "date-fns"
import type { DateRange } from "react-day-picker"

interface BookingFormProps {
  property: {
    id: string
    price: number
    bookings: {
      checkIn: Date
      checkOut: Date
    }[]
  }
}

export function BookingForm({ property }: BookingFormProps) {
  const router = useRouter()
  const [date, setDate] = useState<DateRange | undefined>()
  const [isLoading, setIsLoading] = useState(false)

  // Disable already booked dates
  const disabledDates = property.bookings.map(booking => ({
    from: new Date(booking.checkIn),
    to: new Date(booking.checkOut)
  }))

  const numberOfNights = date?.from && date?.to
    ? differenceInDays(date.to, date.from)
    : 0

  const totalPrice = property.price * numberOfNights

  async function onSubmit() {
    if (!date?.from || !date?.to) {
      return toast.error("Please select check-in and check-out dates")
    }

    try {
      setIsLoading(true)
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId: property.id,
          checkIn: date.from,
          checkOut: date.to,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create booking")
      }

      toast.success("Booking request sent successfully")
      router.push("/dashboard/renter")
      router.refresh()
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-2xl font-bold">
            {formatPrice(property.price)}
            <span className="text-sm font-normal text-muted-foreground">/night</span>
          </h3>
        </div>

        <div className="space-y-2">
          <Calendar
            mode="range"
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            disabled={[
              { before: new Date() },
              ...disabledDates,
            ]}
            className="rounded-md border"
          />
        </div>

        {date?.from && date?.to && (
          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between text-sm">
              <span>
                {formatPrice(property.price)} x {numberOfNights} nights
              </span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>
        )}

        <Button
          className="w-full"
          onClick={onSubmit}
          disabled={!date?.from || !date?.to || isLoading}
        >
          {isLoading ? "Booking..." : "Reserve"}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          You won't be charged yet
        </p>
      </div>
    </Card>
  )
}