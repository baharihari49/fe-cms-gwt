// components/faq-category/faq-category-table.tsx
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
import { FAQCategoryForm } from "./faq-category-form"
import { FAQCategoryViewDialog } from "./faq-category-view-dialog"
import { createColumns } from "./columns"
import { Plus, Trash2, RefreshCw, FolderOpen } from "lucide-react"
import { FAQCategory } from "./types/faq-category"
import { faqCategoryAPI } from "@/lib/api/faq-category"

export function FAQCategoryTable() {
  const [categories, setCategories] = useState<FAQCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | undefined>()
  const [viewCategory, setViewCategory] = useState<FAQCategory | null>(null)
  const [deleteCategory, setDeleteCategory] = useState<FAQCategory | null>(null)
  const [selectedRows, setSelectedRows] = useState<FAQCategory[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showView, setShowView] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false)

  // Load FAQ Categories
  const loadCategories = async () => {
    setLoading(true)
    try {
      const response = await faqCategoryAPI.getFAQCategories()
      if (response.success && response.data) {
        setCategories(response.data)
      } else {
        setCategories([])
      }
    } catch (error) {
      console.error("Failed to load FAQ categories:", error)
      toast.error("Failed to load FAQ categories")
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  // Handlers
  const handleCreate = () => {
    setSelectedCategory(undefined)
    setShowForm(true)
  }

  const handleEdit = (category: FAQCategory) => {
    setSelectedCategory(category)
    setShowForm(true)
  }

  const handleView = (category: FAQCategory) => {
    setViewCategory(category)
    setShowView(true)
  }

  const handleDelete = (category: FAQCategory) => {
    if (category.count > 0) {
      toast.error(`Cannot delete category "${category.name}" because it contains ${category.count} FAQ(s). Please move or delete the FAQs first.`)
      return
    }
    setDeleteCategory(category)
    setShowDeleteDialog(true)
  }

  const handleBulkDelete = () => {
    const categoriesWithFAQs = selectedRows.filter(cat => cat.count > 0)
    if (categoriesWithFAQs.length > 0) {
      toast.error(`Cannot delete ${categoriesWithFAQs.length} categories that contain FAQs. Please move or delete the FAQs first.`)
      return
    }
    
    if (selectedRows.length > 0) {
      setShowBulkDeleteDialog(true)
    }
  }

  const confirmDelete = async () => {
    if (!deleteCategory) return

    try {
      await faqCategoryAPI.deleteFAQCategory(deleteCategory.id)
      toast.success("FAQ category deleted successfully")
      loadCategories()
    } catch (error) {
      console.error("Failed to delete FAQ category:", error)
      toast.error("Failed to delete FAQ category")
    } finally {
      setShowDeleteDialog(false)
      setDeleteCategory(null)
    }
  }

  const confirmBulkDelete = async () => {
    try {
      await Promise.all(
        selectedRows.map(category => faqCategoryAPI.deleteFAQCategory(category.id))
      )
      toast.success(`${selectedRows.length} FAQ categories deleted successfully`)
      loadCategories()
      setSelectedRows([])
    } catch (error) {
      console.error("Failed to delete FAQ categories:", error)
      toast.error("Failed to delete FAQ categories")
    } finally {
      setShowBulkDeleteDialog(false)
    }
  }

  const handleFormSuccess = () => {
    loadCategories()
    toast.success(selectedCategory ? "FAQ category updated successfully" : "FAQ category created successfully")
  }

  const columns = createColumns(handleEdit, handleDelete, handleView)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                FAQ Categories
              </CardTitle>
              <CardDescription>
                Manage FAQ categories and organization
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
              <Button variant="outline" size="sm" onClick={loadCategories}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={categories || []}
            searchKey="name"
            searchPlaceholder="Search categories..."
            loading={loading}
            onRowSelectionChange={setSelectedRows}
          />
        </CardContent>
      </Card>

      {/* Create/Edit Form Dialog */}
      <FAQCategoryForm
        category={selectedCategory}
        open={showForm}
        onOpenChange={setShowForm}
        onSuccess={handleFormSuccess}
      />

      {/* View Category Dialog */}
      <FAQCategoryViewDialog
        category={viewCategory}
        open={showView}
        onOpenChange={setShowView}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the FAQ category
              &quot;{deleteCategory?.name}&quot; and remove all associated data.
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
            <AlertDialogTitle>Delete Multiple Categories</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedRows.length} FAQ categories? 
              This action cannot be undone and will permanently remove all selected categories and their associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete {selectedRows.length} Categories
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}