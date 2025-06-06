// components/ui/table-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface TableSkeletonProps {
  columns: number
  rows?: number
  showHeader?: boolean
  showActions?: boolean
}

export function TableSkeleton({ 
  columns, 
  rows = 10, 
  showHeader = true,
  showActions = true 
}: TableSkeletonProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="rounded-md border">
          <Table>
            {showHeader && (
              <TableHeader>
                <TableRow>
                  {Array.from({ length: columns }).map((_, index) => (
                    <TableHead key={index} className="px-4">
                      <Skeleton className="h-4 w-20" />
                    </TableHead>
                  ))}
                  {showActions && (
                    <TableHead className="px-4">
                      <Skeleton className="h-4 w-16" />
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
            )}
            <TableBody>
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Array.from({ length: columns }).map((_, colIndex) => (
                    <TableCell key={colIndex} className="px-4">
                      {colIndex === 0 ? (
                        // First column - checkbox
                        <Skeleton className="h-4 w-4" />
                      ) : colIndex === 1 ? (
                        // Second column - title with excerpt
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-48" />
                          <Skeleton className="h-3 w-72" />
                          <div className="flex space-x-2">
                            <Skeleton className="h-5 w-16" />
                            <Skeleton className="h-5 w-20" />
                          </div>
                        </div>
                      ) : colIndex === 2 ? (
                        // Third column - author
                        <div className="flex items-center space-x-2">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div className="space-y-1">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </div>
                      ) : colIndex === 3 ? (
                        // Fourth column - category
                        <Skeleton className="h-5 w-20" />
                      ) : colIndex === 4 ? (
                        // Fifth column - tags
                        <div className="flex space-x-1">
                          <Skeleton className="h-5 w-16" />
                          <Skeleton className="h-5 w-12" />
                        </div>
                      ) : colIndex === 5 ? (
                        // Sixth column - stats
                        <div className="space-y-1">
                          <div className="flex space-x-4">
                            <Skeleton className="h-3 w-12" />
                            <Skeleton className="h-3 w-12" />
                          </div>
                          <div className="flex space-x-4">
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-3 w-12" />
                          </div>
                        </div>
                      ) : (
                        // Other columns
                        <Skeleton className="h-4 w-20" />
                      )}
                    </TableCell>
                  ))}
                  {showActions && (
                    <TableCell className="px-4">
                      <Skeleton className="h-8 w-8" />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

// Statistics loading skeleton
export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </div>
            <Skeleton className="h-8 w-12" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Filter section skeleton
export function FiltersSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Search bar skeleton */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          
          {/* Filter controls skeleton */}
          <div className="flex flex-wrap items-center gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-9 w-32" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}