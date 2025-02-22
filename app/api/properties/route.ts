import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { Role } from '@prisma/client'

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      include: {
        host: {
          select: {
            name: true,
            email: true,
            image: true
          }
        }
      }
    })
    
    return NextResponse.json({ success: true, data: properties })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}

// POST /api/properties
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (session.user.role !== Role.HOST) {
      return NextResponse.json(
        { success: false, error: 'Only hosts can create properties' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { title, description, price, location } = body

    const property = await prisma.property.create({
      data: {
        title,
        description,
        price,
        location,
        hostId: session.user.id
      }
    })

    return NextResponse.json({ success: true, data: property })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create property' },
      { status: 500 }
    )
  }
}