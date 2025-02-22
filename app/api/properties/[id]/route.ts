import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

type Props = {
  params: Promise<{
    id: string
  }>
}

export async function GET(
  req: NextRequest,
  props: Props
) {
  try {
    const params = await props.params
    const property = await prisma.property.findUnique({
      where: { id: params.id },
      include: {
        host: {
          select: {
            name: true,
            email: true,
            image: true
          }
        },
        bookings: true
      }
    })

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: property })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch property' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  props: Props
) {
  try {
    const params = await props.params
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const property = await prisma.property.findUnique({
      where: { id: params.id }
    })

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      )
    }

    if (property.hostId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to update this property' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { title, description, price, location } = body

    const updatedProperty = await prisma.property.update({
      where: { id: params.id },
      data: { title, description, price, location }
    })

    return NextResponse.json({ success: true, data: updatedProperty })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update property' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  props: Props
) {
  try {
    const params = await props.params
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const property = await prisma.property.findUnique({
      where: { id: params.id }
    })

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      )
    }

    if (property.hostId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to delete this property' },
        { status: 403 }
      )
    }

    await prisma.property.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete property' },
      { status: 500 }
    )
  }
}