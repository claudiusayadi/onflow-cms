# onFlow CMS

## Introduction

Welcome to **onFlow**, the next-generation CMS designed to eliminate writer’s block and help you focus on seamless content creation. Whether you're an individual blogger, a team of writers, or a full-scale editorial staff, onFlow empowers you with a **fluid, distraction-free writing experience** while maintaining complete control over your content.

## Why onFlow?

Unlike traditional CMS platforms, **onFlow** puts the **writing experience** first. With an elegant, **modern UI**, a **customizable editor**, and **role-based access control**, it simplifies content management without compromising power and flexibility. Our cutting-edge technology stack ensures that your content loads fast, remains secure, and is **accessible anywhere**.

## Key Features

### 📝 **Powerful Writing & Editing Experience**

- Rich text editing with **novel.sh**
- **Auto-save every 5 minutes** so you never lose progress
- **Distraction-free UI** with dark mode support
- **Keyboard shortcuts** for faster writing & publishing

### 📑 **Seamless Content Management**

- **Post Editor** with inline image uploads & live preview
- **Manage Posts** view with sortable columns & pagination
- **Trash System** to recover deleted posts
- **Draft & Publish** workflows

### 🛠 **Advanced Role-Based Access Control (RBAC)**

- **Admin**: Full control over users and posts
- **Editor**: Can manage all posts but not users
- **Writer**: Can manage their own posts only
- **Reader**: Can view, read, comment, and engage with posts

### 📊 **Dashboard Analytics**

- Overview of total posts & user roles
- Latest login attempts & recent posts preview
- **TODO**: attach screenshots of the dashboard

### 🔐 **Security & Performance**

- **Optimized for speed** with Next.js and Hono
- **PostgreSQL with Drizzle-ORM** for structured and scalable data storage
- **API-based data handling** for real-time interactions

## Tech Stack

**Frontend:**

- Next.js (React-based framework for performance & SEO)
- Tailwind CSS & Shadcn UI (modern, accessible design)
- Tanstack Query & Form (efficient state & data management)

**Backend:**

- Hono (lightweight, high-performance backend framework)
- PostgreSQL (robust database)
- Drizzle-ORM (type-safe database queries)
- Zod (schema validation for reliability)

## Get Started

1. Clone the repository:
   ```bash
   git clone https://github.com/ClaudiusAyadi/onflow-cms.git
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up environment variables (refer to `.env.example`)
4. Start development server:
   ```bash
   pnpm dev
   ```
5. Visit `http://localhost:3001` in your browser

## Contribution

I happily welcome contributions! Feel free to open an issue or submit a PR to improve **onFlow**.

_This is a work-in-progress repo. Check back reguarly for new updates._
