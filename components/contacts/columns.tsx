// components/contacts/columns.tsx
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
import { ArrowUpDown, MoreHorizontal, Edit, Trash2, Eye, ExternalLink } from "lucide-react"
import { Contact } from "./types/contact"

interface ContactActionsProps {
  contact: Contact
  onEdit: (contact: Contact) => void
  onDelete: (contact: Contact) => void
  onView: (contact: Contact) => void
}

const ContactActions = ({ contact, onEdit, onDelete, onView }: ContactActionsProps) => {
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
        <DropdownMenuItem onClick={() => onView(contact)}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        {contact.href && (
          <DropdownMenuItem onClick={() => window.open(contact.href!, '_blank')}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Link
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => onEdit(contact)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => onDelete(contact)}
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
  onEdit: (contact: Contact) => void,
  onDelete: (contact: Contact) => void,
  onView: (contact: Contact) => void
): ColumnDef<Contact>[] => [
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
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const contact = row.original
      return (
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${contact.color}`}></div>
          <div>
            <div className="font-medium">{contact.title}</div>
            <div className="text-sm text-muted-foreground">
              {contact.details.length} detail{contact.details.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "details",
    header: "Details",
    cell: ({ row }) => {
      const details = row.getValue("details") as string[]
      return (
        <div className="space-y-1">
          {details.slice(0, 2).map((detail, index) => (
            <div key={index} className="text-sm text-muted-foreground">
              {detail}
            </div>
          ))}
          {details.length > 2 && (
            <div className="text-xs text-muted-foreground">
              +{details.length - 2} more...
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => {
      const color = row.getValue("color") as string
      return (
        <div className="flex items-center space-x-2">
          <div className={`w-6 h-6 rounded bg-gradient-to-r ${color} border`}></div>
          <Badge variant="outline" className="text-xs">
            {color.replace('from-', '').replace('to-', '').split(' ')[0]}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "href",
    header: "Link",
    cell: ({ row }) => {
      const href = row.getValue("href") as string | null
      return href ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(href, '_blank')}
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      ) : (
        <span className="text-sm text-muted-foreground">-</span>
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
      const contact = row.original
      return (
        <ContactActions
          contact={contact}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      )
    },
  },
]