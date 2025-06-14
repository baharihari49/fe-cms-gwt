// components/faq/faq-table.tsx
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
import { FAQForm } from "./faq-form"
import { FAQViewDialog } from "./faq-view-dialog"
import { createColumns } from "./columns"
import { Plus, Trash2, RefreshCw } from "lucide-react"
import { FAQ } from "./types/faq"
import { faqAPI } from "@/lib/api/faq"

export function FAQTable() {
  const [faqs, setFAQs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | undefined>()
  const [viewFAQ, setViewFAQ] = useState<FAQ | null>(null)
  const [deleteFAQ, setDeleteFAQ] = useState<FAQ | null>(null)
  const [selectedRows, setSelectedRows] = useState<FAQ[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showView, setShowView] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false)

  // Load FAQs
  const loadFAQs = async () => {
    setLoading(true)
    try {
      const response = await faqAPI.getFAQs()
      if (response.success && response.data) {
        setFAQs(response.data)
      } else {
        setFAQs([])
      }
    } catch (error) {
      console.error("Failed to load FAQs:", error)
      toast.error("Failed to load FAQs")
      setFAQs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFAQs()
  }, [])

  // Handlers
  const handleCreate = () => {
    setSelectedFAQ(undefined)
    setShowForm(true)
  }

  const handleEdit = (faq: FAQ) => {
    setSelectedFAQ(faq)
    setShowForm(true)
  }

  const handleView = (faq: FAQ) => {
    setViewFAQ(faq)
    setShowView(true)
  }

  const handleDelete = (faq: FAQ) => {
    setDeleteFAQ(faq)
    setShowDeleteDialog(true)
  }

  const handleBulkDelete = () => {
    if (selectedRows.length > 0) {
      setShowBulkDeleteDialog(true)
    }
  }

  const confirmDelete = async () => {
    if (!deleteFAQ) return

    try {
      await faqAPI.deleteFAQ(deleteFAQ.id)
      toast.success("FAQ deleted successfully")
      loadFAQs()
    } catch (error) {
      console.error("Failed to delete FAQ:", error)
      toast.error("Failed to delete FAQ")
    } finally {
      setShowDeleteDialog(false)
      setDeleteFAQ(null)
    }
  }

  const confirmBulkDelete = async () => {
    try {
      await Promise.all(
        selectedRows.map(faq => faqAPI.deleteFAQ(faq.id))
      )
      toast.success(`${selectedRows.length} FAQs deleted successfully`)
      loadFAQs()
      setSelectedRows([])
    } catch (error) {
      console.error("Failed to delete FAQs:", error)
      toast.error("Failed to delete FAQs")
    } finally {
      setShowBulkDeleteDialog(false)
    }
  }

  const handleFormSuccess = () => {
    loadFAQs()
    toast.success(selectedFAQ ? "FAQ updated successfully" : "FAQ created successfully")
  }

  const columns = createColumns(handleEdit, handleDelete, handleView)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Manage your FAQ content
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
              <Button variant="outline" size="sm" onClick={loadFAQs}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Add FAQ
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={faqs || []}
            searchKey="question"
            searchPlaceholder="Search FAQs..."
            loading={loading}
            onRowSelectionChange={setSelectedRows}
          />
        </CardContent>
      </Card>

      {/* Create/Edit Form Dialog */}
      <FAQForm
        faq={selectedFAQ}
        open={showForm}
        onOpenChange={setShowForm}
        onSuccess={handleFormSuccess}
      />

      {/* View FAQ Dialog */}
      <FAQViewDialog
        faq={viewFAQ}
        open={showView}
        onOpenChange={setShowView}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the FAQ
              &quot;{deleteFAQ?.question}&quot; and remove all associated data.
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
            <AlertDialogTitle>Delete Multiple FAQs</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedRows.length} FAQs? 
              This action cannot be undone and will permanently remove all selected FAQs and their associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete {selectedRows.length} FAQs
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}