'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { toast } from "sonner"
import type { DateRange } from "react-day-picker"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ClientBookingFormProps {
  property: {
    id: string
    title: string
    price: number
  }
  bookings: {
    checkIn: Date
    checkOut: Date
    status: string
  }[]
  userId: string
}

export function ClientBookingForm({ property, bookings, userId }: ClientBookingFormProps) {
  const router = useRouter()
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [isLoading, setIsLoading] = useState(false)

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  // Process bookings to ensure they're Date objects
  const processedBookings = bookings.map(booking => ({
    ...booking,
    checkIn: new Date(booking.checkIn),
    checkOut: new Date(booking.checkOut)
  }))

  // Get disabled dates (booked dates)
  const disabledDates = processedBookings.map(booking => ({
    from: booking.checkIn,
    to: booking.checkOut
  }))

  // Calculate number of nights and total price
  const getNumberOfNights = () => {
    if (!dateRange?.from || !dateRange?.to) return 0
    const start = new Date(dateRange.from).getTime()
    const end = new Date(dateRange.to).getTime()
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  }

  const numberOfNights = getNumberOfNights()
  const totalPrice = property.price * numberOfNights

  const handleSubmit = async () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast.error("Please select your check-in and check-out dates")
      return
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
          checkIn: dateRange.from,
          checkOut: dateRange.to,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create booking")
      }

      toast.success("Booking request sent successfully!")
      router.push("/dashboard/renter")
      router.refresh()
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{formatPrice(property.price)} <span className="text-sm font-normal text-muted-foreground">per night</span></span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-medium">Your trip dates</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${
                    !dateRange && "text-muted-foreground"
                  }`}
                >
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {formatDate(dateRange.from)} - {formatDate(dateRange.to)}
                      </>
                    ) : (
                      formatDate(dateRange.from)
                    )
                  ) : (
                    <span>Pick your dates</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-3">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    disabled={[
                      { before: new Date() },
                      ...disabledDates
                    ]}
                    className="rounded-md"
                    classNames={{
                      months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                      month: "space-y-4",
                      caption: "flex justify-center pt-1 relative items-center",
                      caption_label: "text-sm font-medium",
                      nav: "space-x-1 flex items-center",
                      nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex",
                      head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                      row: "flex w-full mt-2",
                      cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                      day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                      day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                      day_today: "bg-accent text-accent-foreground",
                      day_outside: "text-muted-foreground opacity-50",
                      day_disabled: "text-red-500 bg-red-100/50 line-through hover:bg-red-100",
                      day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                      day_hidden: "invisible",
                    }}
                  />
                </div>
                {bookings.length > 0 && (
                  <div className="border-t p-3">
                    <p className="text-xs text-muted-foreground">
                      Red dates are unavailable
                    </p>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {dateRange?.from && dateRange?.to && (
          <div className="space-y-3 border-t pt-3">
            <div className="flex justify-between text-sm">
              <span>{formatPrice(property.price)} × {numberOfNights} nights</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between font-medium border-t pt-2">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          onClick={handleSubmit}
          disabled={!dateRange?.from || !dateRange?.to || isLoading}
        >
          {isLoading ? "Requesting booking..." : "Request to book"}
        </Button>
      </CardFooter>
    </Card>
  )
}