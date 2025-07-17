import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Hash passwords
  const adminPassword = await bcrypt.hash('admin123', 10)
  const studentPassword = await bcrypt.hash('student123', 10)

  // Create admin users
  const admin1 = await prisma.user.upsert({
    where: { email: 'admin@enigmacamp.com' },
    update: {},
    create: {
      email: 'admin@enigmacamp.com',
      password: adminPassword,
      name: 'System Administrator',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  })

  const admin2 = await prisma.user.upsert({
    where: { email: 'supervisor@enigmacamp.com' },
    update: {},
    create: {
      email: 'supervisor@enigmacamp.com',
      password: adminPassword,
      name: 'Sarah Johnson',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  })

  // Create student users
  const student1 = await prisma.user.upsert({
    where: { email: 'john.doe@mail.com' },
    update: {},
    create: {
      email: 'john.doe@mail.com',
      password: studentPassword,
      name: 'John Doe',
      role: 'STUDENT',
      department: 'Frontend Development',
      supervisor: 'Sarah Johnson',
      status: 'ACTIVE',
    },
  })

  const student2 = await prisma.user.upsert({
    where: { email: 'jane.smith@mail.com' },
    update: {},
    create: {
      email: 'jane.smith@mail.com',
      password: studentPassword,
      name: 'Jane Smith',
      role: 'STUDENT',
      department: 'Backend Development',
      supervisor: 'Mike Davis',
      status: 'ACTIVE',
    },
  })

  const student3 = await prisma.user.upsert({
    where: { email: 'alex.johnson@mail.com' },
    update: {},
    create: {
      email: 'alex.johnson@mail.com',
      password: studentPassword,
      name: 'Alex Johnson',
      role: 'STUDENT',
      department: 'UI/UX Design',
      supervisor: 'Emily Chen',
      status: 'ACTIVE',
    },
  })

  const student4 = await prisma.user.upsert({
    where: { email: 'maria.garcia@mail.com' },
    update: {},
    create: {
      email: 'maria.garcia@mail.com',
      password: studentPassword,
      name: 'Maria Garcia',
      role: 'STUDENT',
      department: 'Database',
      supervisor: 'John Smith',
      status: 'INACTIVE', // This student is inactive for testing
    },
  })

  // Create some sample workflows
  const workflow1 = await prisma.workflow.create({
    data: {
      title: 'React Fundamentals',
      description: 'Learn the basics of React.js framework',
      category: 'FRONTEND',
      status: 'ACTIVE',
      dueDate: new Date('2025-08-01'),
      assignedBy: 'Sarah Johnson',
    },
  })

  const workflow2 = await prisma.workflow.create({
    data: {
      title: 'Node.js Backend Development',
      description: 'Build REST APIs with Node.js and Express',
      category: 'BACKEND',
      status: 'ACTIVE',
      dueDate: new Date('2025-08-15'),
      assignedBy: 'Mike Davis',
    },
  })

  // Assign workflows to students
  await prisma.workflowAssignment.create({
    data: {
      userId: student1.id,
      workflowId: workflow1.id,
      status: 'IN_PROGRESS',
      assignedAt: new Date(),
    },
  })

  await prisma.workflowAssignment.create({
    data: {
      userId: student2.id,
      workflowId: workflow2.id,
      status: 'IN_PROGRESS',
      assignedAt: new Date(),
    },
  })

  // Create sample daily reports
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const report1 = await prisma.dailyReport.create({
    data: {
      userId: student1.id,
      date: yesterday,
      notes: 'Completed React component basics tutorial',
    },
  })

  // Add video entries to the report
  await prisma.videoEntry.create({
    data: {
      title: 'React Components Introduction',
      duration: '45 minutes',
      category: 'FRONTEND',
      userId: student1.id,
      dailyReportId: report1.id,
    },
  })

  // Add quiz entries to the report
  await prisma.quizEntry.create({
    data: {
      title: 'React Basics Quiz',
      score: 85,
      totalQuestions: 10,
      category: 'FRONTEND',
      userId: student1.id,
      dailyReportId: report1.id,
    },
  })

  console.log('Database seeded successfully!')
  console.log('Created users:')
  console.log('- Admin: admin@enigmacamp.com (password: admin123)')
  console.log('- Supervisor: supervisor@enigmacamp.com (password: admin123)')
  console.log('- Students: john.doe@mail.com, jane.smith@mail.com, alex.johnson@mail.com (password: student123)')
  console.log('- Inactive student: maria.garcia@mail.com (password: student123)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
