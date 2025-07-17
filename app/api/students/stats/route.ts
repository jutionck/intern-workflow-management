import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Token tidak valid' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const [total, active, inactive, completed] = await Promise.all([
      prisma.user.count({
        where: { role: 'STUDENT' }
      }),
      prisma.user.count({
        where: {
          role: 'STUDENT',
          status: 'ACTIVE'
        }
      }),
      prisma.user.count({
        where: {
          role: 'STUDENT',
          status: 'INACTIVE'
        }
      }),
      prisma.user.count({
        where: {
          role: 'STUDENT',
          status: 'COMPLETED'
        }
      })
    ])

    const stats = {
      total,
      active,
      inactive,
      completed
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Student stats error:', error)
    return NextResponse.json(
      { error: 'Failed to get student stats' },
      { status: 500 }
    )
  }
}
