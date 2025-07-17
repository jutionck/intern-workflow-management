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

    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: {
        id: true,
        email: true,
        name: true,
        department: true,
        supervisor: true,
        status: true,
        createdAt: true,
        _count: {
          select: {
            dailyReports: true,
            videoEntries: true,
            quizEntries: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const formattedStudents = students.map((student: any) => ({
      id: student.id,
      name: student.name,
      email: student.email,
      department: student.department || '',
      startDate: student.createdAt.toISOString().split('T')[0],
      supervisor: student.supervisor || '',
      status: student.status.toLowerCase() as 'active' | 'inactive' | 'completed',
      stats: {
        dailyReports: student._count.dailyReports,
        videosWatched: student._count.videoEntries,
        quizzesCompleted: student._count.quizEntries,
      }
    }))

    return NextResponse.json({ students: formattedStudents })

  } catch (error) {
    console.error('Students API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { name, email, department, supervisor, status } = body

    if (!name || !email || !department || !supervisor) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    const student = await prisma.user.create({
      data: {
        name,
        email,
        department,
        supervisor,
        status: status.toUpperCase(),
        role: 'STUDENT',
        password: 'defaultPassword123' // In real app, generate secure password
      }
    })

    const formattedStudent = {
      id: student.id,
      name: student.name,
      email: student.email,
      department: student.department || '',
      startDate: student.createdAt.toISOString().split('T')[0],
      supervisor: student.supervisor || '',
      status: student.status.toLowerCase() as 'active' | 'inactive' | 'completed',
    }

    return NextResponse.json(formattedStudent, { status: 201 })

  } catch (error) {
    console.error('Create student error:', error)
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    )
  }
}
