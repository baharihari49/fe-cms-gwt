// components/authors/authors-table.tsx
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
import { AuthorForm } from "./author-form"
import { AuthorViewDialog } from "./author-view-dialog"
import { createColumns } from "./columns"
import { Plus, Trash2, RefreshCw } from "lucide-react"
import { Author } from "./types/author"
import { authorAPI } from "@/lib/api/author"

export function AuthorsTable() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAuthor, setSelectedAuthor] = useState<Author | undefined>()
  const [viewAuthor, setViewAuthor] = useState<Author | null>(null)
  const [deleteAuthor, setDeleteAuthor] = useState<Author | null>(null)
  const [selectedRows, setSelectedRows] = useState<Author[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showView, setShowView] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false)

  // Load authors
  const loadAuthors = async () => {
    setLoading(true)
    try {
      const response = await authorAPI.getAuthors()
      if (response.success && response.authors) {
        setAuthors(response.authors)
      } else {
        setAuthors([])
      }
    } catch (error) {
      console.error("Failed to load authors:", error)
      toast.error("Failed to load authors")
      setAuthors([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAuthors()
  }, [])

  // Handlers
  const handleCreate = () => {
    setSelectedAuthor(undefined)
    setShowForm(true)
  }

  const handleEdit = (author: Author) => {
    setSelectedAuthor(author)
    setShowForm(true)
  }

  const handleView = (author: Author) => {
    setViewAuthor(author)
    setShowView(true)
  }

  const handleDelete = (author: Author) => {
    setDeleteAuthor(author)
    setShowDeleteDialog(true)
  }

  const handleBulkDelete = () => {
    if (selectedRows.length > 0) {
      setShowBulkDeleteDialog(true)
    }
  }

  const confirmDelete = async () => {
    if (!deleteAuthor) return

    try {
      await authorAPI.deleteAuthor(deleteAuthor.id)
      toast.success("Author deleted successfully")
      loadAuthors()
    } catch (error) {
      console.error("Failed to delete author:", error)
      toast.error("Failed to delete author")
    } finally {
      setShowDeleteDialog(false)
      setDeleteAuthor(null)
    }
  }

  const confirmBulkDelete = async () => {
    try {
      await Promise.all(
        selectedRows.map(author => authorAPI.deleteAuthor(author.id))
      )
      toast.success(`${selectedRows.length} authors deleted successfully`)
      loadAuthors()
      setSelectedRows([])
    } catch (error) {
      console.error("Failed to delete authors:", error)
      toast.error("Failed to delete authors")
    } finally {
      setShowBulkDeleteDialog(false)
    }
  }

  const handleFormSuccess = () => {
    loadAuthors()
    toast.success(selectedAuthor ? "Author updated successfully" : "Author created successfully")
  }

  const columns = createColumns(handleEdit, handleDelete, handleView)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Authors</CardTitle>
              <CardDescription>
                Manage blog authors
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
              <Button variant="outline" size="sm" onClick={loadAuthors}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Add Author
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={authors || []}
            searchKey="name"
            searchPlaceholder="Search authors..."
            loading={loading}
            onRowSelectionChange={setSelectedRows}
          />
        </CardContent>
      </Card>

      {/* Create/Edit Form Dialog */}
      <AuthorForm
        author={selectedAuthor}
        open={showForm}
        onOpenChange={setShowForm}
        onSuccess={handleFormSuccess}
      />

      {/* View Author Dialog */}
      <AuthorViewDialog
        author={viewAuthor}
        open={showView}
        onOpenChange={setShowView}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the author
              &quot;{deleteAuthor?.name}&quot; and remove all associated data.
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
            <AlertDialogTitle>Delete Multiple Authors</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedRows.length} authors? 
              This action cannot be undone and will permanently remove all selected authors and their associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete {selectedRows.length} Authors
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}