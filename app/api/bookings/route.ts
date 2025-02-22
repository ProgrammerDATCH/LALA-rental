import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// GET /api/bookings
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

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
        property: true,
        renter: {
          select: {
            name: true,
            email: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json({ success: true, data: bookings })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

// POST /api/bookings
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { propertyId, checkIn, checkOut } = body

    // Check for double booking
    const existingBooking = await prisma.booking.findFirst({
      where: {
        propertyId,
        OR: [
          {
            AND: [
              { checkIn: { lte: new Date(checkIn) } },
              { checkOut: { gte: new Date(checkIn) } }
            ]
          },
          {
            AND: [
              { checkIn: { lte: new Date(checkOut) } },
              { checkOut: { gte: new Date(checkOut) } }
            ]
          }
        ]
      }
    })

    if (existingBooking) {
      return NextResponse.json(
        { success: false, error: 'Property is already booked for these dates' },
        { status: 400 }
      )
    }

    const booking = await prisma.booking.create({
      data: {
        propertyId,
        renterId: session.user.id,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        status: 'PENDING'
      }
    })

    return NextResponse.json({ success: true, data: booking })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}