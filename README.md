# Intern Workflow Management System

A modern Next.js application with clean architecture for managing internship workflows, daily reports, and progress tracking. Built with real database integration and no dummy data.

## 🚀 Key Features

- **Admin Dashboard**: Manage intern students, monitor progress, and generate reports
- **Student Dashboard**: Access tasks, submit daily reports, view learning progress
- **Authentication**: Role-based login system (Admin/Student) with JWT
- **Daily Reports**: Form to record daily activities and learning progress
- **Workflow Tracking**: Monitor video tasks, quizzes, and assignments
- **Student Management**: Complete CRUD operations for intern student data
- **Dynamic Categories**: Database-managed categories for learning materials
- **Real-time Data**: No dummy data - fully integrated with real database

## 🛠️ Technology Stack

- **Frontend**: Next.js 15.2.4, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT, bcryptjs
- **Package Manager**: pnpm
- **Architecture**: Clean Architecture with service layer pattern

## 📋 Prerequisites

Make sure you have installed:

- Node.js 18 or newer
- pnpm (recommended) or npm
- MySQL Server
- Git

## 🔧 Installation and Setup

### 1. Clone Repository

```bash
git clone https://github.com/jutionck/intern-workflow-management.git
cd intern-workflow-management
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Database Setup

Create a new MySQL database:

```sql
CREATE DATABASE intern_workflow_management;
```

### 4. Environment Configuration

Copy and configure environment file:

```bash
cp .env.example .env
```

Edit the `.env` file with your database configuration:

```env
DATABASE_URL="mysql://username:password@localhost:3306/intern_workflow_management"
JWT_SECRET="your-super-secret-jwt-key"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
NODE_ENV="development"
```

### 5. Prisma Setup

Generate Prisma client:

```bash
pnpm db:generate
```

Run database migrations:

```bash
pnpm db:migrate
```

Seed database with initial data:

```bash
pnpm db:seed
```

### 6. Run Application

```bash
pnpm dev
```

Open browser and navigate to `http://localhost:3000`

## 👤 Login Credentials

After running the seed, use these credentials:

### Admin:
- **Email**: admin@enigmacamp.com
- **Password**: admin123

### Student:
- **Email**: john.doe@mail.com
- **Password**: student123

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # API endpoints for real database operations
│   │   ├── auth/          # Authentication endpoints
│   │   ├── students/      # Student management CRUD
│   │   ├── daily-reports/ # Daily reports API
│   │   ├── progress/      # Progress tracking API
│   │   ├── workflows/     # Workflow management API
│   │   ├── categories/    # Dynamic categories API
│   │   ├── departments/   # Department management API
│   │   └── supervisors/   # Supervisor management API
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # Reusable React components
│   ├── ui/                # Basic UI components (shadcn/ui)
│   ├── auth/              # Authentication components
│   ├── admin-dashboard.tsx # Admin dashboard with real data
│   ├── student-dashboard.tsx # Student dashboard
│   ├── student-management.tsx # Student CRUD operations
│   ├── daily-report-form.tsx # Daily report submission
│   ├── progress-history.tsx # Progress tracking display
│   ├── workflow-tracker.tsx # Workflow monitoring
│   └── report-generator.tsx # Report generation system
├── services/              # Service layer for business logic
│   ├── auth.service.ts    # Authentication services
│   ├── student.service.ts # Student management services
│   ├── daily-report.service.ts # Daily report services
│   ├── progress.service.ts # Progress tracking services
│   └── workflow.service.ts # Workflow services
├── types/                 # TypeScript type definitions
├── constants/             # Application constants and API endpoints
├── lib/                   # Utility libraries
│   ├── http-client.ts     # HTTP client for API calls
│   ├── auth.ts            # Authentication utilities
│   ├── utils.ts           # General utilities
│   └── prisma.ts          # Database client
├── hooks/                 # Custom React hooks
├── prisma/                # Database schema and migrations
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
└── public/                # Static files
```

## 🎯 Available Scripts

```bash
# Development
pnpm dev          # Run development server
pnpm build        # Build for production
pnpm start        # Run production server
pnpm lint         # Run ESLint

# Database
pnpm db:generate  # Generate Prisma client
pnpm db:migrate   # Run database migrations
pnpm db:seed      # Seed database with initial data
pnpm db:studio    # Open Prisma Studio
```

## 🏗️ Application Architecture

This application uses **Clean Architecture** with the following layers:

### 1. Presentation Layer (UI)
- React components with TypeScript
- Pages and layouts
- UI interaction logic
- Real-time data rendering

### 2. Application Layer
- Custom hooks for state management
- Service classes for business logic
- API communication layer
- Error handling and validation

### 3. Domain Layer
- TypeScript type definitions
- Business rules and constants
- Domain models and interfaces

### 4. Infrastructure Layer
- Database access with Prisma ORM
- External service integrations
- Utility functions and helpers

## 🔐 Authentication System

- **JWT-based authentication**
- **Role-based access control** (Admin/Student)
- **Secure token storage**
- **Protected routes**
- **Session management**
- **Authorization middleware**

## 📊 Database Schema

### Main Tables:

- **User**: User data (admin/students) with roles and authentication
- **DailyReport**: Student daily reports with activities and notes
- **VideoEntry**: Learning video records and completion tracking
- **QuizEntry**: Quiz data and scoring information
- **Workflow**: Learning workflow and task management
- **Category**: Dynamic categories for learning materials (no hardcoded data)

### Key Features:
- **No Dummy Data**: All data comes from real database
- **Dynamic Categories**: Categories managed through database
- **Relational Integrity**: Proper foreign key relationships
- **Audit Trail**: Created/updated timestamps on all records

## 🎨 UI/UX Features

- **Responsive design** for all devices
- **Dark/Light mode** support
- **Accessible components** following standards
- **Modern design** with shadcn/ui
- **Loading states** and comprehensive error handling
- **Real-time data updates**
- **Dynamic content loading**

## ✨ Recent Updates (v1.0.0)

### 🗑️ Dummy Data Removal
- ✅ **Complete removal** of all hardcoded mock data
- ✅ **Real database integration** across all components
- ✅ **Dynamic API endpoints** for all data operations

### 🔧 API Endpoints
- ✅ **Student Management**: `/api/students` - Full CRUD operations
- ✅ **Daily Reports**: `/api/daily-reports` - Report submission and tracking
- ✅ **Progress Tracking**: `/api/progress` - Learning progress monitoring
- ✅ **Workflow Management**: `/api/workflows` - Task and workflow tracking
- ✅ **Dynamic Categories**: `/api/categories` - Category management
- ✅ **Departments**: `/api/departments` - Department data
- ✅ **Supervisors**: `/api/supervisors` - Supervisor information

### 🏢 Service Layer
- ✅ **StudentService**: Complete student management operations
- ✅ **DailyReportService**: Report handling and validation
- ✅ **ProgressService**: Progress tracking and analytics
- ✅ **WorkflowService**: Workflow and task management

### 🎯 Component Updates
- ✅ **AdminDashboard**: Real-time student data and statistics
- ✅ **StudentManagement**: Full CRUD with database integration
- ✅ **DailyReportForm**: Dynamic categories from database
- ✅ **ProgressHistory**: Real progress tracking data
- ✅ **WorkflowTracker**: Live workflow status monitoring
- ✅ **ReportGenerator**: Dynamic report generation from real data

## 🧪 Quality Assurance

- **TypeScript strict mode** for complete type safety
- **ESLint** for code quality enforcement
- **Prettier** for consistent code formatting
- **Clean code principles** and naming conventions
- **Comprehensive error handling** throughout the application
- **Real database integration** with no mock data
- **Service layer pattern** for business logic separation

## 📈 Performance Optimizations

- **Code splitting** with dynamic imports
- **Image optimization** with Next.js automatic optimization
- **Database query optimization** with Prisma
- **Bundle size optimization** and tree shaking
- **Efficient caching strategies**
- **Real-time data loading** with proper loading states

### Environment Variables for Production:
```env
DATABASE_URL="your-production-mysql-url"
JWT_SECRET="your-production-jwt-secret"
NEXT_PUBLIC_API_URL="https://your-domain.com/api"
NODE_ENV="production"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

### Contribution Guidelines:

- Follow the existing architecture patterns
- Add TypeScript types for all new features
- Write clean, self-documenting code
- Include proper error handling
- Test thoroughly before submitting
- Update documentation as needed

## 🐛 Bug Reports

If you find a bug, please create an issue with:

- Bug description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment info (OS, browser, Node.js version)

## 📞 Support

For questions or support:

- **Email**: jutionck@gmail.com
- **GitHub Issues**: [Create an issue](https://github.com/jutionck/intern-workflow-management/issues)

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- **shadcn/ui** for amazing UI components
- **Prisma** for powerful ORM capabilities
- **Next.js** for excellent React framework
- **Tailwind CSS** for utility-first CSS framework
- **TypeScript** for type safety and developer experience

---

**Built with ❤️ using modern web technologies and clean architecture principles.**

## 📝 Changelog

### Version 1.0.0
- ✅ Complete dummy data removal and real database integration
- ✅ JWT authentication implementation
- ✅ Admin and student dashboards with real-time data
- ✅ Workflow and report management system
- ✅ Clean architecture implementation
- ✅ TypeScript strict mode enforcement
- ✅ Responsive UI design with shadcn/ui
- ✅ Dynamic categories and data management
- ✅ Comprehensive API endpoints
- ✅ Service layer business logic
- ✅ Error handling and validation
- ✅ Production-ready deployment configuration

### Key Improvements:
- 🔥 **Zero Dummy Data**: All components now use real database
- 🚀 **Full CRUD Operations**: Complete Create, Read, Update, Delete functionality
- 📊 **Real-time Analytics**: Live data in admin dashboard
- 🎯 **Dynamic Content**: Database-managed categories and options
- 🛡️ **Enhanced Security**: Proper authentication and authorization
- 📱 **Better UX**: Loading states, error handling, and user feedback

---

> **Note**: This application is now production-ready with complete database integration and no mock data.
