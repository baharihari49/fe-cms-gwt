// app/dashboard/services/page.tsx
import { ServicesTable } from "@/components/services/services-table"

export default function ServicesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Services</h2>
        <div className="flex items-center space-x-2">
          {/* Additional header actions can go here if needed */}
        </div>
      </div>
      <ServicesTable />
    </div>
  )
}