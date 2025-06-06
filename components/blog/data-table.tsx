// components/blog/enhanced-data-table.tsx
"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  // PaginationState,
} from "@tanstack/react-table"
import { 
  ChevronDown, 
  Plus, 
  Search, 
  // Filter, 
  Download, 
  RefreshCw, 
  Settings,
  X,
  FileText,
  Eye,
  Calendar
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BlogPost, Category, Tag } from "@/components/blog/types/blog"
import { exportPostsToCSV, downloadCSV } from "@/utils/blog"

interface EnhancedDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  totalCount: number
  pageIndex: number
  pageSize: number
  onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => void
  onGlobalFilterChange: (filter: string) => void
  onCreateNew: () => void
  categories?: Category[]
  tags?: Tag[]
  onCategoryFilter?: (categoryId: string | null) => void
  onTagFilter?: (tagId: string | null) => void
  onPublishedFilter?: (published: boolean | null) => void
  onFeaturedFilter?: (featured: boolean | null) => void
  onRefresh?: () => void
  loading?: boolean
  title?: string
  description?: string
}

export function EnhancedDataTable<TData, TValue>({
  columns,
  data,
  totalCount,
  pageIndex,
  pageSize,
  onPaginationChange,
  onGlobalFilterChange,
  onCreateNew,
  categories = [],
  tags = [],
  onCategoryFilter,
  onTagFilter,
  onPublishedFilter,
  onFeaturedFilter,
  onRefresh,
  loading = false,
  title = "Blog Posts",
  description = "Manage your blog posts and content",
}: EnhancedDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  
  // Active filters state
  const [activeFilters, setActiveFilters] = React.useState<{
    category: string | null
    tag: string | null
    published: boolean | null
    featured: boolean | null
  }>({
    category: null,
    tag: null,
    published: null,
    featured: null,
  })

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    pageCount: Math.max(1, Math.ceil(totalCount / pageSize)),
    manualPagination: true,
  })

  // Handle search with debounce
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onGlobalFilterChange(globalFilter)
    }, 300)

    return () => clearTimeout(timeout)
  }, [globalFilter, onGlobalFilterChange])

  const selectedRows = table.getFilteredSelectedRowModel().rows

  // Filter handlers
  const handleCategoryFilter = (categoryId: string) => {
    const value = categoryId === "all" ? null : categoryId
    setActiveFilters(prev => ({ ...prev, category: value }))
    onCategoryFilter?.(value)
  }

  const handleTagFilter = (tagId: string) => {
    const value = tagId === "all" ? null : tagId
    setActiveFilters(prev => ({ ...prev, tag: value }))
    onTagFilter?.(value)
  }

  const handlePublishedFilter = (published: string) => {
    let value: boolean | null = null
    if (published === "published") value = true
    else if (published === "draft") value = false
    setActiveFilters(prev => ({ ...prev, published: value }))
    onPublishedFilter?.(value)
  }

  const handleFeaturedFilter = (featured: string) => {
    let value: boolean | null = null
    if (featured === "featured") value = true
    else if (featured === "regular") value = false
    setActiveFilters(prev => ({ ...prev, featured: value }))
    onFeaturedFilter?.(value)
  }

  const clearAllFilters = () => {
    setActiveFilters({
      category: null,
      tag: null,
      published: null,
      featured: null,
    })
    setGlobalFilter("")
    onCategoryFilter?.(null)
    onTagFilter?.(null)
    onPublishedFilter?.(null)
    onFeaturedFilter?.(null)
  }

  const hasActiveFilters = Object.values(activeFilters).some(v => v !== null) || globalFilter

  const handleExport = () => {
    if (selectedRows.length > 0) {
      const selectedData = selectedRows.map(row => row.original as BlogPost)
      const csvContent = exportPostsToCSV(selectedData)
      downloadCSV(csvContent, `selected-posts-${new Date().toISOString().split('T')[0]}.csv`)
    } else {
      const csvContent = exportPostsToCSV(data as BlogPost[])
      downloadCSV(csvContent, `all-posts-${new Date().toISOString().split('T')[0]}.csv`)
    }
  }

  // Quick stats
  const publishedCount = (data as BlogPost[]).filter(post => post.published).length
  const draftCount = (data as BlogPost[]).filter(post => !post.published).length
  const featuredCount = (data as BlogPost[]).filter(post => post.featured).length

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
          <Button onClick={onCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{publishedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{draftCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <Badge className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{featuredCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col space-y-4">
            {/* Search Bar */}
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts by title, content, or author..."
                  value={globalFilter ?? ""}
                  onChange={(event) => setGlobalFilter(String(event.target.value))}
                  className="pl-9"
                />
              </div>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="px-3"
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Category Filter */}
              {onCategoryFilter && categories.length > 0 && (
                <Select onValueChange={handleCategoryFilter} value={activeFilters.category || "all"}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Tag Filter */}
              {onTagFilter && tags.length > 0 && (
                <Select onValueChange={handleTagFilter} value={activeFilters.tag || "all"}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Tags" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tags</SelectItem>
                    {tags.map((tag) => (
                      <SelectItem key={tag.id} value={tag.id}>
                        {tag.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Published Filter */}
              {onPublishedFilter && (
                <Select onValueChange={handlePublishedFilter} value={
                  activeFilters.published === true ? "published" :
                  activeFilters.published === false ? "draft" : "all"
                }>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {/* Featured Filter */}
              {onFeaturedFilter && (
                <Select onValueChange={handleFeaturedFilter} value={
                  activeFilters.featured === true ? "featured" :
                  activeFilters.featured === false ? "regular" : "all"
                }>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {/* Column Visibility */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    View
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      )
                    })}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Export */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Export options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleExport}>
                    {selectedRows.length > 0 
                      ? `Export ${selectedRows.length} selected` 
                      : "Export all posts"
                    }
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                {globalFilter && (
                  <Badge variant="secondary">
                    Search: {globalFilter}
                  </Badge>
                )}
                {activeFilters.category && (
                  <Badge variant="secondary">
                    Category: {categories.find(c => c.id === activeFilters.category)?.name}
                  </Badge>
                )}
                {activeFilters.tag && (
                  <Badge variant="secondary">
                    Tag: {tags.find(t => t.id === activeFilters.tag)?.name}
                  </Badge>
                )}
                {activeFilters.published !== null && (
                  <Badge variant="secondary">
                    Status: {activeFilters.published ? 'Published' : 'Draft'}
                  </Badge>
                )}
                {activeFilters.featured !== null && (
                  <Badge variant="secondary">
                    Type: {activeFilters.featured ? 'Featured' : 'Regular'}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Selection Info */}
      {selectedRows.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-sm">
                  {selectedRows.length} selected
                </Badge>
                <span className="text-sm text-muted-foreground">
                  out of {table.getFilteredRowModel().rows.length} filtered posts
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRowSelection({})}
                >
                  Clear selection
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="px-4">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: pageSize }).map((_, index) => (
                    <TableRow key={index}>
                      {columns.map((_, colIndex) => (
                        <TableCell key={colIndex} className="px-4">
                          <div className="h-8 bg-muted animate-pulse rounded" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-muted/50"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="px-4">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <div className="text-lg font-medium">No posts found</div>
                        <div className="text-sm text-muted-foreground">
                          {hasActiveFilters 
                            ? "Try adjusting your filters or search terms" 
                            : "Get started by creating your first blog post"
                          }
                        </div>
                        {!hasActiveFilters && (
                          <Button onClick={onCreateNew} className="mt-2">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Post
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex-1 text-sm text-muted-foreground">
              {selectedRows.length > 0 ? (
                <>
                  {selectedRows.length} of {table.getFilteredRowModel().rows.length} row(s) selected
                </>
              ) : (
                <>
                  Showing {Math.min((pageIndex * pageSize) + 1, totalCount)} to{" "}
                  {Math.min((pageIndex + 1) * pageSize, totalCount)} of {totalCount} posts
                </>
              )}
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Rows per page</p>
                <Select
                  value={`${pageSize}`}
                  onValueChange={(value) => {
                    onPaginationChange({
                      pageIndex: 0,
                      pageSize: Number(value),
                    })
                  }}
                  disabled={loading}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={pageSize} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[5, 10, 20, 30, 40, 50].map((size) => (
                      <SelectItem key={size} value={`${size}`}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {pageIndex + 1} of{" "}
                {Math.max(1, Math.ceil(totalCount / pageSize))}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => onPaginationChange({ pageIndex: 0, pageSize })}
                  disabled={pageIndex === 0 || loading}
                >
                  <span className="sr-only">Go to first page</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => onPaginationChange({ pageIndex: pageIndex - 1, pageSize })}
                  disabled={pageIndex === 0 || loading}
                >
                  <span className="sr-only">Go to previous page</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => onPaginationChange({ pageIndex: pageIndex + 1, pageSize })}
                  disabled={pageIndex >= Math.ceil(totalCount / pageSize) - 1 || loading}
                >
                  <span className="sr-only">Go to next page</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => onPaginationChange({ 
                    pageIndex: Math.ceil(totalCount / pageSize) - 1, 
                    pageSize 
                  })}
                  disabled={pageIndex >= Math.ceil(totalCount / pageSize) - 1 || loading}
                >
                  <span className="sr-only">Go to last page</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}