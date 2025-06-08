// components/testimonials/testimonials-table.tsx
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
import { TestimonialForm } from "./testimonial-form"
import { TestimonialViewDialog } from "./testimonial-view-dialog"
import { createColumns } from "./columns"
import { Plus, Trash2, RefreshCw, MessageSquare } from "lucide-react"
import { Testimonial } from "@/components/testimonial/types/testimonial"
import { testimonialAPI } from "@/lib/api/testimonial"

export function TestimonialsTable() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | undefined>()
  const [viewTestimonial, setViewTestimonial] = useState<Testimonial | null>(null)
  const [deleteTestimonial, setDeleteTestimonial] = useState<Testimonial | null>(null)
  const [selectedRows, setSelectedRows] = useState<Testimonial[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showView, setShowView] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false)

  // Load testimonials
  const loadTestimonials = async () => {
    setLoading(true)
    try {
      const response = await testimonialAPI.getTestimonials()
      if (response.success && response.data) {
        setTestimonials(response.data)
      } else {
        setTestimonials([])
      }
    } catch (error) {
      console.error("Failed to load testimonials:", error)
      toast.error("Failed to load testimonials")
      setTestimonials([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTestimonials()
  }, [])

  // Handlers
  const handleCreate = () => {
    setSelectedTestimonial(undefined)
    setShowForm(true)
  }

  const handleEdit = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial)
    setShowForm(true)
  }

  const handleView = (testimonial: Testimonial) => {
    setViewTestimonial(testimonial)
    setShowView(true)
  }

  const handleDelete = (testimonial: Testimonial) => {
    setDeleteTestimonial(testimonial)
    setShowDeleteDialog(true)
  }

  const handleBulkDelete = () => {
    if (selectedRows.length > 0) {
      setShowBulkDeleteDialog(true)
    }
  }

  const confirmDelete = async () => {
    if (!deleteTestimonial) return

    try {
      await testimonialAPI.deleteTestimonial(deleteTestimonial.id)
      toast.success("Testimonial deleted successfully")
      loadTestimonials()
    } catch (error) {
      console.error("Failed to delete testimonial:", error)
      toast.error("Failed to delete testimonial")
    } finally {
      setShowDeleteDialog(false)
      setDeleteTestimonial(null)
    }
  }

  const confirmBulkDelete = async () => {
    try {
      await Promise.all(
        selectedRows.map(testimonial => testimonialAPI.deleteTestimonial(testimonial.id))
      )
      toast.success(`${selectedRows.length} testimonials deleted successfully`)
      loadTestimonials()
      setSelectedRows([])
    } catch (error) {
      console.error("Failed to delete testimonials:", error)
      toast.error("Failed to delete testimonials")
    } finally {
      setShowBulkDeleteDialog(false)
    }
  }

  const handleFormSuccess = () => {
    loadTestimonials()
    toast.success(selectedTestimonial ? "Testimonial updated successfully" : "Testimonial created successfully")
  }

  const columns = createColumns(handleEdit, handleDelete, handleView)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Testimonials
              </CardTitle>
              <CardDescription>
                Manage client testimonials and reviews
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
              <Button variant="outline" size="sm" onClick={loadTestimonials}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Add Testimonial
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={testimonials || []}
            searchKey="author"
            searchPlaceholder="Search testimonials..."
            loading={loading}
            onRowSelectionChange={setSelectedRows}
          />
        </CardContent>
      </Card>

      {/* Create/Edit Form Dialog */}
      <TestimonialForm
        testimonial={selectedTestimonial}
        open={showForm}
        onOpenChange={setShowForm}
        onSuccess={handleFormSuccess}
      />

      {/* View Testimonial Dialog */}
      <TestimonialViewDialog
        testimonial={viewTestimonial}
        open={showView}
        onOpenChange={setShowView}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the testimonial
              from &quot;{deleteTestimonial?.author}&quot; and remove all associated data.
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
            <AlertDialogTitle>Delete Multiple Testimonials</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedRows.length} testimonials? 
              This action cannot be undone and will permanently remove all selected testimonials and their associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete {selectedRows.length} Testimonials
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}