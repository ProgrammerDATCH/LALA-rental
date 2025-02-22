# LaLa Rental Booking Platform

A property rental platform built with Next.js 14, Prisma, and PostgreSQL.

## Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- PostgreSQL database
- Google OAuth credentials

### Installation

1. Clone the repository
```bash
git clone https://github.com/ProgrammerDATCH/LALA-rental.git
cd LALA-rental
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables by creating a `.env` file:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/lala_rentals"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

4. Setup the database
```bash
npx prisma db push
```

5. Start the development server
```bash
npm run dev
```

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable OAuth and configure the consent screen
4. Create OAuth credentials (Web application)
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
6. Copy the Client ID and Secret to your `.env` file

## Features

- User authentication with Google
- Property listing management
- Booking system
- Role-based access (Host/Renter)
- Image upload
- Responsive design

## Tech Stack

- Next.js 14
- Prisma
- PostgreSQL
- NextAuth.js
- Tailwind CSS
- shadcn/ui