'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Role } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function RoleSelectionForm() {
  const router = useRouter()
  const { update: updateSession } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const updateRole = async (selectedRole: Role) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/user/role', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selectedRole }),
      })

      if (!response.ok) throw new Error()

      // Update the session with new role
      await updateSession({ user: { role: selectedRole } })
      toast.success("Role updated successfully")
      router.push("/")
    } catch (error) {
      toast.error("Failed to update role")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-4">
      <Button
        size="lg"
        onClick={() => updateRole(Role.RENTER)}
        disabled={isLoading}
      >
        I want to rent
      </Button>
      <Button
        size="lg"
        onClick={() => updateRole(Role.HOST)}
        disabled={isLoading}
      >
        I want to host
      </Button>
    </div>
  )
}