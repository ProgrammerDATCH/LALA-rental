import { Role, Status } from '@prisma/client'

export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
}

export type PropertyCreateInput = {
  title: string
  description: string
  price: number
  location: string
}

export type BookingCreateInput = {
  propertyId: string
  checkIn: Date
  checkOut: Date
}

export type BookingUpdateInput = {
  status: Status
}