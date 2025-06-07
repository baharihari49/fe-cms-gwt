// components/blog/tags/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Edit, Trash2, Hash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tag } from "./types/tags"
import { formatDistanceToNow } from "date-fns"

interface ColumnActionsProps {
  onEdit: (tag: Tag) => void
  onDelete: (tag: Tag) => void
}

export const createTagColumns = ({
  onEdit,
  onDelete,
}: ColumnActionsProps): ColumnDef<Tag>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 -ml-2"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const tag = row.original
      
      return (
        <div className="flex items-center gap-3 max-w-[300px]">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Hash className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="font-medium truncate">{tag.name}</div>
            <div className="text-sm text-muted-foreground">
              #{tag.slug}
            </div>
          </div>
        </div>
      )
    },
    size: 300,
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-mono text-xs">
        {row.getValue("slug")}
      </Badge>
    ),
    size: 150,
  },
  {
    accessorKey: "postCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 -ml-2"
        >
          Posts
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const postCount = row.original._count?.posts || row.original.postCount || 0
      return (
        <div className="text-center">
          <Badge variant={postCount > 0 ? "default" : "secondary"}>
            {postCount}
          </Badge>
        </div>
      )
    },
    sortingFn: (rowA, rowB) => {
      const countA = rowA.original._count?.posts || rowA.original.postCount || 0
      const countB = rowB.original._count?.posts || rowB.original.postCount || 0
      return countA - countB
    },
    size: 80,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 -ml-2"
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string
      return (
        <div className="text-sm whitespace-nowrap">
          {formatDistanceToNow(new Date(date), { addSuffix: true })}
        </div>
      )
    },
    size: 120,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const tag = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(tag.id)}
            >
              Copy tag ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(tag.slug)}
            >
              Copy slug
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(tag)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit tag
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(tag)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete tag
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    size: 50,
  },
]