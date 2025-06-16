// In your page component
import { TeamMembersTable } from '@/components/team-members/team-members-table'

export default function TeamMembersPage() {
    return (
        <section className="p-6">
            <div className="flex items-center justify-between space-y-2 mb-4">
                <h2 className="text-3xl font-bold tracking-tight">Teams</h2>
            </div>
            <TeamMembersTable />
        </section>
    )
}