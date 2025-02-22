import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { RoleSelectionForm } from "./role-selection-form"
import { prisma } from "@/lib/prisma"

export default async function RoleSelectionPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  })

  if (user?.hasSelectedRole) {
    redirect("/")
  }

  return (
    <div className="container max-w-2xl py-20">
      <div className="flex flex-col items-center space-y-6 text-center">
        <h1 className="text-3xl font-bold">Choose Your Role</h1>
        <p className="text-muted-foreground">
          How would you like to use LaLa Rentals?
        </p>
        <RoleSelectionForm />
      </div>
    </div>
  )
}