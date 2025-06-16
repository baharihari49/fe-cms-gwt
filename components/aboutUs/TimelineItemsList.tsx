// components/aboutus/TimelineItemsList.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Calendar, Trophy, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Separator } from '@/components/ui/separator'
import { timelineItemAPI } from '@/lib/api/about'
import { TimelineItem, TimelineItemsResponse } from '@/components/aboutUs/types/aboutus'

interface TimelineItemsListProps {
  onEdit: (item: TimelineItem) => void
  onCreate: () => void
  refreshTrigger: number
}

export default function TimelineItemsList({ 
  onEdit, 
  onCreate, 
  refreshTrigger 
}: TimelineItemsListProps) {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([])
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [limit] = useState(10)
  
  // Delete dialog state
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    item: null as TimelineItem | null
  })
  
  // Sort state
  const [sortBy, setSortBy] = useState('order:asc')

  const fetchTimelineItems = async () => {
    try {
      setLoading(true)
      
      const response: TimelineItemsResponse = await timelineItemAPI.getTimelineItems({
        page: currentPage,
        limit: limit,
        sort: sortBy
      })
      
      if (response.success) {
        setTimelineItems(response.data)
        setTotalPages(response.pagination.pages)
        setTotalItems(response.pagination.total)
      } else {
        toast.error("Failed to fetch timeline items")
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTimelineItems()
  }, [currentPage, sortBy, refreshTrigger])

  const handleDelete = async () => {
    if (!deleteDialog.item) return

    try {
      setDeleteLoading(true)
      await timelineItemAPI.deleteTimelineItem(deleteDialog.item.id)
      
      toast.success("Timeline item deleted successfully")
      
      setDeleteDialog({ open: false, item: null })
      fetchTimelineItems()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete timeline item')
    } finally {
      setDeleteLoading(false)
    }
  }

  const openDeleteDialog = (item: TimelineItem) => {
    setDeleteDialog({ open: true, item })
  }

  if (loading && timelineItems.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-6 w-48 mb-3" />
                    <Skeleton className="h-16 w-full mb-3" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                  <Skeleton className="h-8 w-8 ml-4" />
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
          <h2 className="text-3xl font-bold tracking-tight">Company Timeline</h2>
          <p className="text-muted-foreground">
            Manage your company's journey and key milestones
          </p>
        </div>
        <Button onClick={onCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Timeline Item
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
          {totalItems} item{totalItems !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Timeline Items */}
      <div className="space-y-6">
        {timelineItems.map((item, index) => (
          <div key={item.id} className="relative">
            <Card className="group hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <Badge variant="outline" className="bg-primary/10">
                        <Calendar className="w-3 h-3 mr-1" />
                        {item.year}
                      </Badge>
                      <Badge variant="secondary">
                        Order: {item.order}
                      </Badge>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                    
                    <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Trophy className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-green-800 dark:text-green-200">
                          Key Achievement
                        </span>
                      </div>
                      <p className="text-green-700 dark:text-green-300 text-sm">
                        {item.achievement}
                      </p>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">
                      {item.description}
                    </p>
                    
                    {item.extendedDescription && (
                      <div className="bg-muted/50 rounded-lg p-4 mb-4">
                        <h4 className="text-sm font-medium mb-2">Extended Description</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {item.extendedDescription}
                        </p>
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground">
                      Created: {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(item)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => openDeleteDialog(item)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
            
            {/* Timeline connector */}
            {index < timelineItems.length - 1 && (
              <div className="flex justify-center my-4">
                <Separator orientation="vertical" className="h-8" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {timelineItems.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No timeline items</h3>
            <p className="text-muted-foreground mb-4 text-center">
              Get started by creating your first timeline milestone.
            </p>
            <Button onClick={onCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Timeline Item
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
        setDeleteDialog({ open, item: deleteDialog.item })
      }>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Timeline Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteDialog.item?.title}"? 
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