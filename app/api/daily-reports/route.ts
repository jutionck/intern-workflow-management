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

    const dailyReports = await prisma.dailyReport.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        videoEntries: true,
        quizEntries: true,
      },
      orderBy: { date: 'desc' }
    })

    return NextResponse.json({ dailyReports })
  } catch (error) {
    console.error('Daily reports API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromHeaders(request.headers)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { notes, videoEntries, quizEntries } = await request.json()

    const dailyReport = await prisma.dailyReport.create({
      data: {
        userId: decoded.userId,
        notes,
        videoEntries: {
          create: videoEntries?.map((video: any) => ({
            title: video.title,
            duration: video.duration,
            category: video.category,
            userId: decoded.userId,
          })) || []
        },
        quizEntries: {
          create: quizEntries?.map((quiz: any) => ({
            title: quiz.title,
            score: quiz.score,
            totalQuestions: quiz.totalQuestions,
            category: quiz.category,
            userId: decoded.userId,
          })) || []
        },
      },
      include: {
        videoEntries: true,
        quizEntries: true,
      }
    })

    return NextResponse.json({ dailyReport })
  } catch (error) {
    console.error('Create daily report error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
