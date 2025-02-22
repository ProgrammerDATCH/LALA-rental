import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "./auth"
import { Role } from "@prisma/client"

export async function checkRole(allowedRoles: Role[]) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  if (!allowedRoles.includes(session.user.role)) {
    redirect("/")
  }
}