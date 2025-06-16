// components/aboutus/CompanyInfoList.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Building2, Calendar, Image as ImageIcon, MoreHorizontal } from 'lucide-react'
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
import { Separator } from '@/components/ui/separator'
import { companyInfoAPI } from '@/lib/api/about'
import { CompanyInfo, CompanyInfosResponse } from '@/components/aboutUs/types/aboutus'

interface CompanyInfoListProps {
  onEdit: (info: CompanyInfo) => void
  onCreate: () => void
  refreshTrigger: number
}

export default function CompanyInfoList({ 
  onEdit, 
  onCreate, 
  refreshTrigger 
}: CompanyInfoListProps) {
  const [companyInfos, setCompanyInfos] = useState<CompanyInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [limit] = useState(5)
  
  // Delete dialog state
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    info: null as CompanyInfo | null
  })
  
  // Sort state
  const [sortBy, setSortBy] = useState('createdAt:desc')

  const fetchCompanyInfos = async () => {
    try {
      setLoading(true)
      
      const response: CompanyInfosResponse = await companyInfoAPI.getCompanyInfos({
        page: currentPage,
        limit: limit,
        sort: sortBy
      })
      
      if (response.success) {
        setCompanyInfos(response.data)
        setTotalPages(response.pagination.pages)
        setTotalItems(response.pagination.total)
      } else {
        // toast({
        //   title: "Error",
        //   description: "Failed to fetch company information",
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
    fetchCompanyInfos()
  }, [currentPage, sortBy, refreshTrigger])

  const handleDelete = async () => {
    if (!deleteDialog.info) return

    try {
      setDeleteLoading(true)
      await companyInfoAPI.deleteCompanyInfo(deleteDialog.info.id)
      
      // toast({
      //   title: "Success",
      //   description: "Company information deleted successfully",
      // })
      
      setDeleteDialog({ open: false, info: null })
      fetchCompanyInfos()
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: error instanceof Error ? error.message : 'Failed to delete company information',
      //   variant: "destructive",
      // })
    } finally {
      setDeleteLoading(false)
    }
  }

  const openDeleteDialog = (info: CompanyInfo) => {
    setDeleteDialog({ open: true, info })
  }

  const truncateText = (text: string, maxLength: number): string => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  if (loading && companyInfos.length === 0) {
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
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <Skeleton className="w-16 h-16 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-8" />
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
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
          <h2 className="text-3xl font-bold tracking-tight">Company Information</h2>
          <p className="text-muted-foreground">
            Manage your company's basic information and corporate story
          </p>
        </div>
        <Button onClick={onCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Company Info
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
              <SelectItem value="createdAt:desc">Newest First</SelectItem>
              <SelectItem value="createdAt:asc">Oldest First</SelectItem>
              <SelectItem value="id:asc">ID (Ascending)</SelectItem>
              <SelectItem value="id:desc">ID (Descending)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Badge variant="secondary">
          {totalItems} record{totalItems !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Company Info Cards */}
      <div className="space-y-6">
        {companyInfos.map((info) => (
          <Card key={info.id} className="group hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              {/* Header with image and basic info */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4 flex-1">
                  {info.heroImageUrl ? (
                    <img
                      src={info.heroImageUrl}
                      alt={info.companyName}
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold truncate">
                        {info.companyName}
                      </h3>
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{info.foundedYear}</span>
                      </Badge>
                    </div>
                    
                    {info.previousName && (
                      <p className="text-sm text-muted-foreground mb-2">
                        Previously: {info.previousName}
                      </p>
                    )}
                    
                    <div className="text-xs text-muted-foreground">
                      Created: {new Date(info.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(info)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => openDeleteDialog(info)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Separator className="mb-6" />

              {/* About Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card className="bg-blue-50/50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">About Header</h4>
                    <p className="text-blue-800 dark:text-blue-200 text-sm">
                      {truncateText(info.aboutHeader, 100)}
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-50/50 dark:bg-green-950/50 border-green-200 dark:border-green-800">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Journey Title</h4>
                    <p className="text-green-800 dark:text-green-200 text-sm">
                      {info.journeyTitle || 'Not set'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* About Subheader */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">About Subheader</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {truncateText(info.aboutSubheader, 200)}
                </p>
              </div>

              {/* Mission & Vision */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card className="bg-purple-50/50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Mission</h4>
                    <p className="text-purple-800 dark:text-purple-200 text-sm leading-relaxed">
                      {truncateText(info.mission, 150)}
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-orange-50/50 dark:bg-orange-950/50 border-orange-200 dark:border-orange-800">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">Vision</h4>
                    <p className="text-orange-800 dark:text-orange-200 text-sm leading-relaxed">
                      {truncateText(info.vision, 150)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Story Text */}
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Company Story</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {truncateText(info.storyText, 300)}
                  </p>
                  {info.storyText.length > 300 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2 h-auto p-0 text-xs"
                      onClick={() => onEdit(info)}
                    >
                      Read more...
                    </Button>
                  )}
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {companyInfos.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No company information</h3>
            <p className="text-muted-foreground mb-4 text-center">
              Get started by adding your company's information and story.
            </p>
            <Button onClick={onCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Add Company Information
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
        setDeleteDialog({ open, info: deleteDialog.info })
      }>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Company Information</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the information for "{deleteDialog.info?.companyName}"? 
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