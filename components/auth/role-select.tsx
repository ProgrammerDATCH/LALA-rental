"use client"

import { Button } from "@/components/ui/button"
import { Role } from "@prisma/client"

interface RoleSelectProps {
  selectedRole: Role
  onRoleChange: (role: Role) => void
}

export function RoleSelect({ selectedRole, onRoleChange }: RoleSelectProps) {
  return (
    <div className="flex gap-4">
      <Button
        variant={selectedRole === Role.RENTER ? "default" : "outline"}
        onClick={() => onRoleChange(Role.RENTER)}
      >
        I want to rent
      </Button>
      <Button
        variant={selectedRole === Role.HOST ? "default" : "outline"}
        onClick={() => onRoleChange(Role.HOST)}
      >
        I want to host
      </Button>
    </div>
  )
}