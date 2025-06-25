// app/users/page.tsx
import { UsersTable } from "@/components/users/users-table"

export default function UsersPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
      </div>
      <UsersTable />
    </div>
  )
}