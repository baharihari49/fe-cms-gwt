// components/technologies/technologies-table.tsx
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
import { TechnologyForm } from "./technology-form"
import { TechnologyViewDialog } from "./technology-view-dialog"
import { createColumns } from "./columns"
import { Plus, Trash2, RefreshCw } from "lucide-react"
import { Technology } from "./types/technology"
import { technologyAPI } from "@/lib/api/technology"

export function TechnologiesTable() {
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTechnology, setSelectedTechnology] = useState<Technology | undefined>()
  const [viewTechnology, setViewTechnology] = useState<Technology | null>(null)
  const [deleteTechnology, setDeleteTechnology] = useState<Technology | null>(null)
  const [selectedRows, setSelectedRows] = useState<Technology[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showView, setShowView] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false)

  // Load technologies
  const loadTechnologies = async () => {
    setLoading(true)
    try {
      const response = await technologyAPI.getTechnologies()
      if (response.success && response.data) {
        setTechnologies(response.data)
      } else {
        setTechnologies([])
      }
    } catch (error) {
      console.error("Failed to load technologies:", error)
      toast.error("Failed to load technologies")
      setTechnologies([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTechnologies()
  }, [])

  // Handlers
  const handleCreate = () => {
    setSelectedTechnology(undefined)
    setShowForm(true)
  }

  const handleEdit = (technology: Technology) => {
    setSelectedTechnology(technology)
    setShowForm(true)
  }

  const handleView = (technology: Technology) => {
    setViewTechnology(technology)
    setShowView(true)
  }

  const handleDelete = (technology: Technology) => {
    setDeleteTechnology(technology)
    setShowDeleteDialog(true)
  }

  const handleBulkDelete = () => {
    if (selectedRows.length > 0) {
      setShowBulkDeleteDialog(true)
    }
  }

  const confirmDelete = async () => {
    if (!deleteTechnology) return

    try {
      await technologyAPI.deleteTechnology(deleteTechnology.id)
      toast.success("Technology deleted successfully")
      loadTechnologies()
    } catch (error) {
      console.error("Failed to delete technology:", error)
      toast.error("Failed to delete technology")
    } finally {
      setShowDeleteDialog(false)
      setDeleteTechnology(null)
    }
  }

  const confirmBulkDelete = async () => {
    try {
      await Promise.all(
        selectedRows.map(technology => technologyAPI.deleteTechnology(technology.id))
      )
      toast.success(`${selectedRows.length} technologies deleted successfully`)
      loadTechnologies()
      setSelectedRows([])
    } catch (error) {
      console.error("Failed to delete technologies:", error)
      toast.error("Failed to delete technologies")
    } finally {
      setShowBulkDeleteDialog(false)
    }
  }

  const handleFormSuccess = () => {
    loadTechnologies()
    toast.success(selectedTechnology ? "Technology updated successfully" : "Technology created successfully")
  }

  const columns = createColumns(handleEdit, handleDelete, handleView)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Technologies</CardTitle>
              <CardDescription>
                Manage your technology stack
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
              <Button variant="outline" size="sm" onClick={loadTechnologies}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Add Technology
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={technologies || []}
            searchKey="name"
            searchPlaceholder="Search technologies..."
            loading={loading}
            onRowSelectionChange={setSelectedRows}
          />
        </CardContent>
      </Card>

      {/* Create/Edit Form Dialog */}
      <TechnologyForm
        technology={selectedTechnology}
        open={showForm}
        onOpenChange={setShowForm}
        onSuccess={handleFormSuccess}
      />

      {/* View Technology Dialog */}
      <TechnologyViewDialog
        technology={viewTechnology}
        open={showView}
        onOpenChange={setShowView}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the technology
              &quot;{deleteTechnology?.name}&quot; and remove all associated data.
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
            <AlertDialogTitle>Delete Multiple Technologies</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedRows.length} technologies? 
              This action cannot be undone and will permanently remove all selected technologies and their associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete {selectedRows.length} Technologies
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}