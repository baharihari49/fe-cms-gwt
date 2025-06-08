// app/dashboard/technologies/page.tsx
import { TechnologiesTable } from "@/components/technology/technologies-table"

export default function TechnologiesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Technologies</h2>
      </div>
      <TechnologiesTable />
    </div>
  )
}