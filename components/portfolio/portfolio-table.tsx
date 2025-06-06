// components/projects/projects-table.tsx
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
import { ProjectForm } from "./portfolio-form"
import { ProjectViewDialog } from "./portfolio-view-dialog"
import { createColumns } from "./columns"
import { Plus, Trash2, RefreshCw } from "lucide-react"
import { Project } from "@/components/portfolio/types"
import { projectAPI } from "@/lib/api/portfolio"

export function ProjectsTable() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | undefined>()
  const [viewProject, setViewProject] = useState<Project | null>(null)
  const [deleteProject, setDeleteProject] = useState<Project | null>(null)
  const [selectedRows, setSelectedRows] = useState<Project[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showView, setShowView] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false)

  // Load projects
  const loadProjects = async () => {
    setLoading(true)
    try {
      const response = await projectAPI.getProjects()
      if (response.success) {
        setProjects(response.projects)
      }
    } catch (error) {
      console.error("Failed to load projects:", error)
      toast.error("Failed to load projects")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  // Handlers
  const handleCreate = () => {
    setSelectedProject(undefined)
    setShowForm(true)
  }

  const handleEdit = (project: Project) => {
    setSelectedProject(project)
    setShowForm(true)
  }

  const handleView = (project: Project) => {
    setViewProject(project)
    setShowView(true)
  }

  const handleDelete = (project: Project) => {
    setDeleteProject(project)
    setShowDeleteDialog(true)
  }

  const handleBulkDelete = () => {
    if (selectedRows.length > 0) {
      setShowBulkDeleteDialog(true)
    }
  }

  const confirmDelete = async () => {
    if (!deleteProject) return

    try {
      await projectAPI.deleteProject(deleteProject.id)
      toast.success("Project deleted successfully")
      loadProjects()
    } catch (error) {
      console.error("Failed to delete project:", error)
      toast.error("Failed to delete project")
    } finally {
      setShowDeleteDialog(false)
      setDeleteProject(null)
    }
  }

  const confirmBulkDelete = async () => {
    try {
      await Promise.all(
        selectedRows.map(project => projectAPI.deleteProject(project.id))
      )
      toast.success(`${selectedRows.length} projects deleted successfully`)
      loadProjects()
      setSelectedRows([])
    } catch (error) {
      console.error("Failed to delete projects:", error)
      toast.error("Failed to delete projects")
    } finally {
      setShowBulkDeleteDialog(false)
    }
  }

  const handleFormSuccess = () => {
    loadProjects()
    toast.success(selectedProject ? "Project updated successfully" : "Project created successfully")
  }

  const columns = createColumns(handleEdit, handleDelete, handleView)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Projects</CardTitle>
              <CardDescription>
                Manage your portfolio projects
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
              <Button variant="outline" size="sm" onClick={loadProjects}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={projects}
            searchKey="title"
            searchPlaceholder="Search projects..."
            loading={loading}
            onRowSelectionChange={setSelectedRows}
          />
        </CardContent>
      </Card>

      {/* Create/Edit Form Dialog */}
      <ProjectForm
        project={selectedProject}
        open={showForm}
        onOpenChange={setShowForm}
        onSuccess={handleFormSuccess}
      />

      {/* View Project Dialog */}
      <ProjectViewDialog
        project={viewProject}
        open={showView}
        onOpenChange={setShowView}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project
              &quot;{deleteProject?.title}&quot; and remove all associated data.
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
            <AlertDialogTitle>Delete Multiple Projects</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedRows.length} projects? 
              This action cannot be undone and will permanently remove all selected projects and their associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete {selectedRows.length} Projects
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}