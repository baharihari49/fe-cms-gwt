// components/faq-category/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
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
import { ArrowUpDown, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { FAQCategory } from "./types/faq-category"
import * as Icons from "lucide-react"

interface FAQCategoryActionsProps {
  category: FAQCategory
  onEdit: (category: FAQCategory) => void
  onDelete: (category: FAQCategory) => void
  onView: (category: FAQCategory) => void
}

export const createColumns = (
  onEdit: (category: FAQCategory) => void,
  onDelete: (category: FAQCategory) => void,
  onView: (category: FAQCategory) => void
): ColumnDef<FAQCategory>[] => [
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
      const category = row.original
      const IconComponent = Icons[category.icon as keyof typeof Icons] as any
      
      return (
        <div className="flex items-center gap-3 max-w-[250px]">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            {IconComponent && <IconComponent className="h-4 w-4" />}
          </div>
          <div className="min-w-0">
            <div className="font-medium truncate">{category.name}</div>
            <div className="text-sm text-muted-foreground truncate">
              {category.count} FAQ{category.count !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      )
    },
    size: 250,
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <Badge variant="outline">{row.getValue("id")}</Badge>
    },
  },
  {
    accessorKey: "icon",
    header: "Icon",
    cell: ({ row }) => {
      const icon = row.getValue("icon") as string
      const IconComponent = Icons[icon as keyof typeof Icons] as any
      
      return (
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
            {IconComponent && <IconComponent className="h-4 w-4" />}
          </div>
          <span className="text-sm text-muted-foreground font-mono">{icon}</span>
        </div>
      )
    },
    size: 120,
  },
  {
    accessorKey: "count",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 -ml-2"
        >
          FAQ Count
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const count = row.getValue("count") as number
      return (
        <div className="text-center">
          <Badge variant={count > 0 ? "default" : "secondary"}>
            {count}
          </Badge>
        </div>
      )
    },
    size: 100,
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
      const date = new Date(row.getValue("createdAt"))
      return (
        <div className="text-sm whitespace-nowrap">
          {date.toLocaleDateString()}
        </div>
      )
    },
    size: 120,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const category = row.original
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
              onClick={() => navigator.clipboard.writeText(category.id)}
            >
              Copy category ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onView(category)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(category)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit category
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(category)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete category
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    size: 50,
  },
]