"use client"

import { Button } from "@/components/ui/button"
import { PropertyActions } from "./property-actions"
import { useSession } from "next-auth/react"
import { Role } from "@prisma/client"
import Link from "next/link"

interface PropertyCardActionsProps {
  propertyId: string
  hostId: string
  showActions?: boolean
}

export function PropertyCardActions({ propertyId, hostId, showActions }: PropertyCardActionsProps) {
  const { data: session } = useSession()
  const isHost = session?.user?.role === Role.HOST
  const isOwner = session?.user?.id === hostId

  return (
    <>
      {isOwner && showActions && (
        <PropertyActions propertyId={propertyId} />
      )}
      {session && !isHost && (
        <Button asChild size="sm">
          <Link href={`/properties/${propertyId}`}>
            Book Now
          </Link>
        </Button>
      )}
    </>
  )
}