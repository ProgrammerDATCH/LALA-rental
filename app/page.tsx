import { Suspense } from "react"
import { PropertiesList } from "@/components/properties/properties-list"
import { Loading } from "@/components/ui/loading"

export default function HomePage() {
  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold tracking-tight">Welcome to LaLa Rentals</h1>
      <p className="text-lg text-muted-foreground mt-2">
        Find and book your perfect rental property
      </p>
      <div className="mt-8">
        <Suspense fallback={<Loading />}>
          <PropertiesList />
        </Suspense>
      </div>
    </div>
  )
}