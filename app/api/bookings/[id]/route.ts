import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// GET /api/bookings/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
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

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check if user is authorized to view this booking
    if (
      booking.renterId !== session.user.id &&
      booking.property.hostId !== session.user.id
    ) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to view this booking' },
        { status: 403 }
      )
    }

    return NextResponse.json({ success: true, data: booking })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch booking' },
      { status: 500 }
    )
  }
}

// PUT /api/bookings/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { status } = body

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: { property: true }
    })

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Only host can confirm/cancel bookings
    if (booking.property.hostId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to update this booking' },
        { status: 403 }
      )
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: { status }
    })

    return NextResponse.json({ success: true, data: updatedBooking })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}