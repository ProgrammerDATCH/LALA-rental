import { Role } from "@prisma/client"
import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: Role
      email: string
      name: string
      image?: string
    }
  }

  interface User {
    id: string
    role: Role
    email: string
    name: string
    image?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: Role
    email: string
    name: string
    picture?: string
  }
}