import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTokenFromHeaders, verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromHeaders(request.headers)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const whereClause = decoded.role === 'ADMIN'
      ? (userId ? { userId } : {})
      : { userId: decoded.userId }

    const progressData = await prisma.$transaction(async (tx: any) => {
      const videoEntries = await tx.videoEntry.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      const quizEntries = await tx.quizEntry.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      const combinedHistory = [
        ...videoEntries.map((entry: any) => ({
          id: entry.id,
          date: entry.createdAt.toISOString().split('T')[0],
          type: 'video' as const,
          title: entry.title,
          category: entry.category,
          duration: entry.duration,
          studentName: entry.user.name
        })),
        ...quizEntries.map((entry: any) => ({
          id: entry.id,
          date: entry.createdAt.toISOString().split('T')[0],
          type: 'quiz' as const,
          title: entry.title,
          category: entry.category,
          score: entry.score,
          totalQuestions: entry.totalQuestions,
          studentName: entry.user.name
        }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      return combinedHistory
    })

    return NextResponse.json({ progressData })
  } catch (error) {
    console.error('Progress API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
