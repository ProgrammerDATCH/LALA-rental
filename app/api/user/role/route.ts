import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { Role } from '@prisma/client'

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { role } = body

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        role: role as Role,
        hasSelectedRole: true
      },
    })

    return NextResponse.json({ 
      success: true, 
      data: { role: updatedUser.role } 
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update role' },
      { status: 500 }
    )
  }
}