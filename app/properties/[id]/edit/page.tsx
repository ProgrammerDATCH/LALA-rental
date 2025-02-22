import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { PropertyForm } from "@/components/properties/property-form"

interface EditPropertyPageProps {
  params: {
    id: string
  }
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const property = await prisma.property.findUnique({
    where: { id: params.id },
  })

  if (!property) {
    notFound()
  }

  // Check if the current user is the property owner
  if (property.hostId !== session.user.id) {
    redirect("/")
  }

  return (
    <div className="container max-w-2xl py-10">
      <h1 className="text-3xl font-bold mb-8">Edit Property</h1>
      <PropertyForm initialData={property} />
    </div>
  )
}