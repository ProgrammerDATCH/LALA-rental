"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Role } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { RoleSelect } from "@/components/auth/role-select"
import { Icons } from "@/components/icons"

export function RegisterForm() {
  const [role, setRole] = useState<Role>(Role.RENTER)

  const handleRegister = async () => {
    await signIn("google", { 
      callbackUrl: "/",
      state: role === Role.HOST ? 'HOST' : 'RENTER'  // Pass role through state
    })
  }

  return (
    <div className="grid gap-6">
      <RoleSelect selectedRole={role} onRoleChange={setRole} />
      <Button variant="outline" onClick={handleRegister}>
        <Icons.google className="mr-2 h-4 w-4" />
        Continue with Google
      </Button>
    </div>
  )
}