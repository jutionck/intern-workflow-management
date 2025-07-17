import { NextResponse } from 'next/server'

// In a real application, this would come from your database
const supervisors = [
  "Sarah Johnson",
  "Mike Davis",
  "Emily Chen",
  "John Smith",
  "Lisa Wang",
  "David Brown",
  "Anna Martinez",
  "Robert Wilson",
  "Maria Garcia",
  "James Thompson",
  "Jessica Lee",
  "Kevin Rodriguez",
  "Amanda Foster",
  "Chris Parker"
]

export async function GET() {
  try {
    // In a real application, you would fetch from your database:
    // const supervisors = await prisma.user.findMany({
    //   where: { role: 'SUPERVISOR' },
    //   select: { name: true },
    //   orderBy: { name: 'asc' }
    // })
    // return NextResponse.json({ 
    //   supervisors: supervisors.map(s => s.name) 
    // })

    return NextResponse.json({
      supervisors,
      success: true
    })
  } catch (error) {
    console.error('Error fetching supervisors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch supervisors' },
      { status: 500 }
    )
  }
}
