// components/aboutus/CompanyValuesList.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { companyValueAPI } from '@/lib/api/about'
import { CompanyValue, CompanyValuesResponse } from '@/components/aboutUs/types/aboutus'
import { parseTailwindGradient } from '@/lib/utils/dynamicGradients'
import * as icons from 'lucide-react'

interface CompanyValuesListProps {
  onEdit: (value: CompanyValue) => void
  onCreate: () => void
  refreshTrigger: number
}

export default function CompanyValuesList({
  onEdit,
  onCreate,
  refreshTrigger
}: CompanyValuesListProps) {
  const [companyValues, setCompanyValues] = useState<CompanyValue[]>([])
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [limit] = useState(12)

  // Delete dialog state
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    value: null as CompanyValue | null
  })

  // Sort state
  const [sortBy, setSortBy] = useState('order:asc')

  const fetchCompanyValues = async () => {
    try {
      setLoading(true)

      const response: CompanyValuesResponse = await companyValueAPI.getCompanyValues({
        page: currentPage,
        limit: limit,
        sort: sortBy
      })

      if (response.success) {
        setCompanyValues(response.data)
        setTotalPages(response.pagination.pages)
        setTotalItems(response.pagination.total)
      } else {
        toast.error("Failed to fetch company values")
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompanyValues()
  }, [currentPage, sortBy, refreshTrigger])

  const handleDelete = async () => {
    if (!deleteDialog.value) return

    try {
      setDeleteLoading(true)
      await companyValueAPI.deleteCompanyValue(deleteDialog.value.id)

      toast.success("Company value deleted successfully")

      setDeleteDialog({ open: false, value: null })
      fetchCompanyValues()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete company value')
    } finally {
      setDeleteLoading(false)
    }
  }

  const openDeleteDialog = (value: CompanyValue) => {
    setDeleteDialog({ open: true, value })
  }

  // Helper function to render icon dynamically
  const renderIcon = (iconName: string) => {
    const IconComponent = (icons as any)[iconName]
    if (IconComponent) {
      return <IconComponent className="w-6 h-6 text-white" />
    }
    // Fallback icon if the specified icon doesn't exist
    return <icons.Star className="w-6 h-6 text-white" />
  }

  if (loading && companyValues.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-12 w-12 rounded-lg mb-4" />
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="flex space-x-2">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Company Values</h2>
          <p className="text-muted-foreground">
            Manage your company's core values and principles
          </p>
        </div>
        <Button onClick={onCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Value
        </Button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="order:asc">Order (Ascending)</SelectItem>
              <SelectItem value="order:desc">Order (Descending)</SelectItem>
              <SelectItem value="createdAt:desc">Newest First</SelectItem>
              <SelectItem value="createdAt:asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Badge variant="secondary">
          {totalItems} value{totalItems !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companyValues.map((value) => (
          <Card key={value.id} className="group hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: parseTailwindGradient(value.color) }}
                >
                  {renderIcon(value.icon)}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(value)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => openDeleteDialog(value)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <h3 className="text-lg font-semibold mb-2">{value.title}</h3>

              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                {value.description}
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <Badge variant="outline">Order: {value.order}</Badge>
                <span>{new Date(value.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {companyValues.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No company values</h3>
            <p className="text-muted-foreground mb-4 text-center">
              Get started by creating your first company value.
            </p>
            <Button onClick={onCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Value
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) =>
        setDeleteDialog({ open, value: deleteDialog.value })
      }>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Company Value</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteDialog.value?.title}"?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}