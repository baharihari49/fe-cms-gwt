// components/aboutus/CompanyStatsList.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, BarChart3, TrendingUp, MoreHorizontal } from 'lucide-react'
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
// import { toast } from '@/components/ui/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import { companyStatAPI } from '@/lib/api/about'
import { CompanyStat, CompanyStatsResponse } from '@/components/aboutUs/types/aboutus'

interface CompanyStatsListProps {
  onEdit: (stat: CompanyStat) => void
  onCreate: () => void
  refreshTrigger: number
}

export default function CompanyStatsList({ 
  onEdit, 
  onCreate, 
  refreshTrigger 
}: CompanyStatsListProps) {
  const [companyStats, setCompanyStats] = useState<CompanyStat[]>([])
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
    stat: null as CompanyStat | null
  })
  
  // Sort state
  const [sortBy, setSortBy] = useState('order:asc')

  const fetchCompanyStats = async () => {
    try {
      setLoading(true)
      
      const response: CompanyStatsResponse = await companyStatAPI.getCompanyStats({
        page: currentPage,
        limit: limit,
        sort: sortBy
      })
      
      if (response.success) {
        setCompanyStats(response.data)
        setTotalPages(response.pagination.pages)
        setTotalItems(response.pagination.total)
      } else {
        // toast({
        //   title: "Error",
        //   description: "Failed to fetch company statistics",
        //   variant: "destructive",
        // })
      }
    } catch (err) {
      // toast({
      //   title: "Error",
      //   description: err instanceof Error ? err.message : 'An error occurred',
      //   variant: "destructive",
      // })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompanyStats()
  }, [currentPage, sortBy, refreshTrigger])

  const handleDelete = async () => {
    if (!deleteDialog.stat) return

    try {
      setDeleteLoading(true)
      await companyStatAPI.deleteCompanyStat(deleteDialog.stat.id)
      
      // toast({
      //   title: "Success",
      //   description: "Company statistic deleted successfully",
      // })
      
      setDeleteDialog({ open: false, stat: null })
      fetchCompanyStats()
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: error instanceof Error ? error.message : 'Failed to delete company statistic',
      //   variant: "destructive",
      // })
    } finally {
      setDeleteLoading(false)
    }
  }

  const openDeleteDialog = (stat: CompanyStat) => {
    setDeleteDialog({ open: true, stat })
  }

  if (loading && companyStats.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="text-center space-y-3">
                  <Skeleton className="h-12 w-12 rounded-full mx-auto" />
                  <Skeleton className="h-8 w-16 mx-auto" />
                  <Skeleton className="h-4 w-24 mx-auto" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 flex-1" />
                    <Skeleton className="h-8 flex-1" />
                  </div>
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
          <h2 className="text-3xl font-bold tracking-tight">Company Statistics</h2>
          <p className="text-muted-foreground">
            Showcase your company's achievements and key metrics
          </p>
        </div>
        <Button onClick={onCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Statistic
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
          {totalItems} statistic{totalItems !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {companyStats.map((stat) => (
          <Card key={stat.id} className="group hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                {/* Icon */}
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary text-lg">{stat.icon}</span>
                </div>
                
                {/* Number */}
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-foreground">
                    {stat.number}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
                
                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                  <Badge variant="outline" className="text-xs">
                    Order: {stat.order}
                  </Badge>
                  <span>{new Date(stat.createdAt).toLocaleDateString()}</span>
                </div>
                
                {/* Actions */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center">
                      <DropdownMenuItem onClick={() => onEdit(stat)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => openDeleteDialog(stat)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {companyStats.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No statistics</h3>
            <p className="text-muted-foreground mb-4 text-center">
              Get started by adding your first company statistic.
            </p>
            <Button onClick={onCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Statistic
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
        setDeleteDialog({ open, stat: deleteDialog.stat })
      }>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Company Statistic</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this statistic "{deleteDialog.stat?.label}"? 
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