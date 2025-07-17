import { NextResponse } from 'next/server'

// In a real application, this would come from your database
const departments = [
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "UI/UX Design",
  "Database",
  "DevOps",
  "Mobile Development",
  "Data Science",
  "Quality Assurance",
  "Project Management",
  "Cybersecurity",
  "Machine Learning",
  "Cloud Computing",
  "Software Testing"
]

export async function GET() {
  try {
    // In a real application, you would fetch from your database:
    // const departments = await prisma.department.findMany({
    //   select: { name: true },
    //   orderBy: { name: 'asc' }
    // })
    // return NextResponse.json({ 
    //   departments: departments.map(d => d.name) 
    // })

    return NextResponse.json({
      departments,
      success: true
    })
  } catch (error) {
    console.error('Error fetching departments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch departments' },
      { status: 500 }
    )
  }
}
