import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params

    const student = await prisma.user.findUnique({
      where: {
        id,
        role: 'STUDENT'
      },
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
      }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    const formattedStudent = {
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
    }

    return NextResponse.json(formattedStudent)

  } catch (error) {
    console.error('Get student error:', error)
    return NextResponse.json(
      { error: 'Failed to get student' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params
    const body = await request.json()
    const { name, email, department, supervisor, status } = body

    if (!name || !email || !department || !supervisor) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    // Check if email is already taken by another user
    const emailConflict = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id }
      }
    })

    if (emailConflict) {
      return NextResponse.json(
        { error: 'Email already taken by another user' },
        { status: 409 }
      )
    }

    const updatedStudent = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        department,
        supervisor,
        status: status.toUpperCase(),
      }
    })

    const formattedStudent = {
      id: updatedStudent.id,
      name: updatedStudent.name,
      email: updatedStudent.email,
      department: updatedStudent.department || '',
      startDate: updatedStudent.createdAt.toISOString().split('T')[0],
      supervisor: updatedStudent.supervisor || '',
      status: updatedStudent.status.toLowerCase() as 'active' | 'inactive' | 'completed',
    }

    return NextResponse.json(formattedStudent)

  } catch (error) {
    console.error('Update student error:', error)
    return NextResponse.json(
      { error: 'Failed to update student' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    // Delete related records first (cascade delete)
    await prisma.quizEntry.deleteMany({
      where: { userId: id }
    })

    await prisma.videoEntry.deleteMany({
      where: { userId: id }
    })

    await prisma.dailyReport.deleteMany({
      where: { userId: id }
    })

    // Delete the user
    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Student deleted successfully'
    })

  } catch (error) {
    console.error('Delete student error:', error)
    return NextResponse.json(
      { error: 'Failed to delete student' },
      { status: 500 }
    )
  }
}
