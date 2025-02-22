"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn, formatPrice } from "@/lib/utils"
import { Property } from "@prisma/client"
import { toast } from "sonner"

interface BookingFormProps {
  property: Property
}

export function BookingForm({ property }: BookingFormProps) {
  const router = useRouter()
  const [date, setDate] = useState<DateRange | undefined>()
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async () => {
    try {
      if (!date?.from || !date?.to) {
        toast.error("Please select check-in and check-out dates")
        return
      }

      setIsLoading(true)
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    <div className="rounded-lg border p-4">
      <h3 className="text-lg font-medium">
        {formatPrice(property.price)} <span className="text-sm font-normal">per night</span>
      </h3>

      <div className="mt-4 grid gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick your dates</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              disabled={(date) =>
                date < new Date(new Date().setHours(0, 0, 0, 0))
              }
            />
          </PopoverContent>
        </Popover>

        {date?.from && date?.to && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total nights</span>
              <span>
                {Math.ceil(
                  (date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24)
                )}
              </span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>
                {formatPrice(
                  property.price *
                    Math.ceil(
                      (date.to.getTime() - date.from.getTime()) /
                        (1000 * 60 * 60 * 24)
                    )
                )}
              </span>
            </div>
          </div>
        )}

        <Button
          onClick={onSubmit}
          disabled={!date?.from || !date?.to || isLoading}
        >
          {isLoading ? "Booking..." : "Book now"}
        </Button>
      </div>
    </div>
  )
}