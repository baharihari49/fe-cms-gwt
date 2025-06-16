// components/team-members/team-members-table.tsx
"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DataTable } from "@/components/ui/data-table"
import { TeamMemberForm } from "./team-member-form"
import { TeamMemberViewDialog } from "./team-member-view-dialog"
import { createColumns } from "./columns"
import { Plus, Trash2, RefreshCw, Users } from "lucide-react"
import { TeamMember } from "./types/team-member"
import { teamMemberAPI } from "@/lib/api/team-member"

export function TeamMembersTable() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTeamMember, setSelectedTeamMember] = useState<TeamMember | undefined>()
  const [viewTeamMember, setViewTeamMember] = useState<TeamMember | null>(null)
  const [deleteTeamMember, setDeleteTeamMember] = useState<TeamMember | null>(null)
  const [selectedRows, setSelectedRows] = useState<TeamMember[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showView, setShowView] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false)
  
  // Stats
  const [totalCount, setTotalCount] = useState(0)

  // Load team members
  const loadTeamMembers = async () => {
    setLoading(true)
    try {
      // Use regular get API
      const response = await teamMemberAPI.getTeamMembers({
        limit: 100,
        sort: "name:asc"
      })
      setTotalCount(response.pagination?.total || response.data?.length || 0)
      
      if (response.success && response.data) {
        setTeamMembers(response.data)
      } else {
        setTeamMembers([])
      }
    } catch (error) {
      console.error("Failed to load team members:", error)
      toast.error("Failed to load team members")
      setTeamMembers([])
    } finally {
      setLoading(false)
    }
  }

  // Load metadata (removed - not needed anymore)

  useEffect(() => {
    loadTeamMembers()
  }, [])

  // Handlers
  const handleCreate = () => {
    setSelectedTeamMember(undefined)
    setShowForm(true)
  }

  const handleEdit = (teamMember: TeamMember) => {
    setSelectedTeamMember(teamMember)
    setShowForm(true)
  }

  const handleView = (teamMember: TeamMember) => {
    setViewTeamMember(teamMember)
    setShowView(true)
  }

  const handleDelete = (teamMember: TeamMember) => {
    setDeleteTeamMember(teamMember)
    setShowDeleteDialog(true)
  }

  const handleBulkDelete = () => {
    if (selectedRows.length > 0) {
      setShowBulkDeleteDialog(true)
    }
  }

  const confirmDelete = async () => {
    if (!deleteTeamMember) return

    try {
      await teamMemberAPI.deleteTeamMember(deleteTeamMember.id)
      toast.success("Team member deleted successfully")
      loadTeamMembers()
    } catch (error) {
      console.error("Failed to delete team member:", error)
      toast.error("Failed to delete team member")
    } finally {
      setShowDeleteDialog(false)
      setDeleteTeamMember(null)
    }
  }

  const confirmBulkDelete = async () => {
    try {
      await Promise.all(
        selectedRows.map(teamMember => teamMemberAPI.deleteTeamMember(teamMember.id))
      )
      toast.success(`${selectedRows.length} team members deleted successfully`)
      loadTeamMembers()
      setSelectedRows([])
    } catch (error) {
      console.error("Failed to delete team members:", error)
      toast.error("Failed to delete team members")
    } finally {
      setShowBulkDeleteDialog(false)
    }
  }

  const handleFormSuccess = () => {
    loadTeamMembers()
    toast.success(selectedTeamMember ? "Team member updated successfully" : "Team member created successfully")
  }

  const columns = createColumns(handleEdit, handleDelete, handleView)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members
                {totalCount > 0 && (
                  <span className="text-sm font-normal text-muted-foreground">
                    ({totalCount} total)
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                Manage your team members and their information
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {selectedRows.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete {selectedRows.length} items
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={loadTeamMembers}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Add Team Member
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={teamMembers || []}
            searchKey="name"
            searchPlaceholder="Search team members..."
            loading={loading}
            onRowSelectionChange={setSelectedRows}
          />
        </CardContent>
      </Card>

      {/* Create/Edit Form Dialog */}
      <TeamMemberForm
        teamMember={selectedTeamMember}
        open={showForm}
        onOpenChange={setShowForm}
        onSuccess={handleFormSuccess}
      />

      {/* View Team Member Dialog */}
      <TeamMemberViewDialog
        teamMember={viewTeamMember}
        open={showView}
        onOpenChange={setShowView}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the team member
              &quot;{deleteTeamMember?.name}&quot; and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Multiple Team Members</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedRows.length} team members? 
              This action cannot be undone and will permanently remove all selected team members and their associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete {selectedRows.length} Team Members
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}