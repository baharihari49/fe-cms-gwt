// components/faq/columns.tsx
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
import { ArrowUpDown, MoreHorizontal, Edit, Trash2, Eye, Star } from "lucide-react"
import { FAQ } from "./types/faq"

interface FAQActionsProps {
  faq: FAQ
  onEdit: (faq: FAQ) => void
  onDelete: (faq: FAQ) => void
  onView: (faq: FAQ) => void
}

const FAQActions = ({ faq, onEdit, onDelete, onView }: FAQActionsProps) => {
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
        <DropdownMenuItem onClick={() => onView(faq)}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(faq)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => onDelete(faq)}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const createColumns = (
  onEdit: (faq: FAQ) => void,
  onDelete: (faq: FAQ) => void,
  onView: (faq: FAQ) => void
): ColumnDef<FAQ>[] => [
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
  },
  {
    accessorKey: "question",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Question
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const faq = row.original
      return (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="font-medium max-w-[300px] truncate">{faq.question}</div>
            {faq.popular && (
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            )}
          </div>
          <div className="text-sm text-muted-foreground truncate max-w-[300px]">
            {faq.answer}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "faqCategory",
    header: "Category",
    cell: ({ row }) => {
      const category = row.original.faqCategory
      return (
        <Badge variant="secondary" className="capitalize">
          {category.name}
        </Badge>
      )
    },
  },
  {
    accessorKey: "popular",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Popular
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const popular = row.getValue("popular") as boolean
      return popular ? (
        <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
          <Star className="mr-1 h-3 w-3 fill-white" />
          Popular
        </Badge>
      ) : (
        <Badge variant="outline">Normal</Badge>
      )
    },
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <Badge variant="outline">#{row.getValue("id")}</Badge>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const faq = row.original
      return (
        <FAQActions
          faq={faq}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      )
    },
  },
]