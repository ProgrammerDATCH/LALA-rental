"use client"

import { useRouter, useSearchParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function PropertyFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePriceSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set("sort", value)
    } else {
      params.delete("sort")
    }
    router.push(`/properties?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-4">
      <Select
        defaultValue={searchParams.get("sort")?.toString()}
        onValueChange={handlePriceSort}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by price" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="asc">Price: Low to High</SelectItem>
            <SelectItem value="desc">Price: High to Low</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}