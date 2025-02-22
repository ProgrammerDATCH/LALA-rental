"use client"

import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { Role } from "@prisma/client"

export function AddPropertyButton() {
  const { data: session } = useSession()

  if (session?.user?.role !== Role.HOST) return null

  return (
    <Button
      asChild
      className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg"
    >
      <Link href="/properties/create">
        <Plus className="h-6 w-6" />
        <span className="sr-only">Add new property</span>
      </Link>
    </Button>
  )
}