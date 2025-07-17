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

    if (decoded.role === 'ADMIN') {
      const workflows = await prisma.workflow.findMany({
        include: {
          tasks: {
            orderBy: { order: 'asc' }
          },
          assignments: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      return NextResponse.json({ workflows })
    } else {
      const workflows = await prisma.workflowAssignment.findMany({
        where: { userId: decoded.userId },
        include: {
          workflow: {
            include: {
              tasks: {
                orderBy: { order: 'asc' }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      const transformedWorkflows = workflows.map((assignment: any) => ({
        id: assignment.workflow.id,
        title: assignment.workflow.title,
        description: assignment.workflow.description,
        category: assignment.workflow.category,
        status: assignment.status,
        dueDate: assignment.workflow.dueDate,
        tasks: assignment.workflow.tasks.map((task: any) => ({
          id: task.id,
          title: task.title,
          type: task.type.toLowerCase(),
          completed: task.completed,
          score: task.score,
          totalQuestions: task.totalQuestions,
          duration: task.duration
        }))
      }))

      return NextResponse.json({ workflows: transformedWorkflows })
    }
  } catch (error) {
    console.error('Workflows API error:', error)
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
    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { title, description, category, dueDate, tasks, assignedUsers } = await request.json()

    const workflow = await prisma.workflow.create({
      data: {
        title,
        description,
        category,
        dueDate: dueDate ? new Date(dueDate) : null,
        assignedBy: decoded.userId,
        tasks: {
          create: tasks?.map((task: any, index: number) => ({
            title: task.title,
            type: task.type.toUpperCase(),
            order: index,
            score: task.score,
            totalQuestions: task.totalQuestions,
            duration: task.duration
          })) || []
        },
        assignments: {
          create: assignedUsers?.map((userId: string) => ({
            userId
          })) || []
        }
      },
      include: {
        tasks: true,
        assignments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({ workflow })
  } catch (error) {
    console.error('Create workflow error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
