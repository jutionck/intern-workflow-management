import { NextResponse } from 'next/server'

// In a real application, this would come from your database
const categories = [
  { id: '1', name: 'Frontend Development', value: 'frontend' },
  { id: '2', name: 'Backend Development', value: 'backend' },
  { id: '3', name: 'Full Stack Development', value: 'fullstack' },
  { id: '4', name: 'UI/UX Design', value: 'design' },
  { id: '5', name: 'Database', value: 'database' },
  { id: '6', name: 'DevOps', value: 'devops' },
  { id: '7', name: 'Mobile Development', value: 'mobile' },
  { id: '8', name: 'Data Science', value: 'datascience' },
  { id: '9', name: 'Machine Learning', value: 'ml' },
  { id: '10', name: 'Cybersecurity', value: 'security' },
  { id: '11', name: 'Quality Assurance', value: 'qa' },
  { id: '12', name: 'Project Management', value: 'pm' },
  { id: '13', name: 'Other', value: 'other' }
]

export async function GET() {
  try {
    // In a real application, you would fetch from your database:
    // const categories = await prisma.category.findMany({
    //   select: { id: true, name: true, value: true },
    //   orderBy: { name: 'asc' }
    // })

    return NextResponse.json({
      categories,
      success: true
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, value } = body

    if (!name || !value) {
      return NextResponse.json(
        { error: 'Name and value are required' },
        { status: 400 }
      )
    }

    // In a real application, you would save to your database:
    // const category = await prisma.category.create({
    //   data: { name, value }
    // })

    const newCategory = {
      id: Date.now().toString(),
      name,
      value
    }

    return NextResponse.json(newCategory, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
