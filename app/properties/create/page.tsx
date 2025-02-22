import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Role } from "@prisma/client"
import { PropertyForm } from "@/components/properties/property-form"

export default async function CreatePropertyPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== Role.HOST) {
    redirect("/")
  }

  return (
    <div className="container max-w-2xl py-10">
      <h1 className="text-3xl font-bold mb-8">Create a New Property</h1>
      <PropertyForm />
    </div>
  )
}