// components/authors/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { Author } from "./types/author"

interface AuthorActionsProps {
  author: Author
  onEdit: (author: Author) => void
  onDelete: (author: Author) => void
  onView: (author: Author) => void
}

const AuthorActions = ({ author, onEdit, onDelete, onView }: AuthorActionsProps) => {
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
        <DropdownMenuItem onClick={() => onView(author)}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(author)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => onDelete(author)}
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
  onEdit: (author: Author) => void,
  onDelete: (author: Author) => void,
  onView: (author: Author) => void
): ColumnDef<Author>[] => [
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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const author = row.original
      return (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback>
              {author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{author.name}</div>
            <div className="text-sm text-muted-foreground">{author.email}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "bio",
    header: "Bio",
    cell: ({ row }) => {
      const bio = row.getValue("bio") as string
      return bio ? (
        <span className="text-sm text-muted-foreground truncate max-w-[300px] block">
          {bio}
        </span>
      ) : (
        <span className="text-sm text-muted-foreground">-</span>
      )
    },
  },
  {
    accessorKey: "_count.posts",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Posts
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const count = row.original._count.posts
      return <Badge variant="secondary">{count} posts</Badge>
    },
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const id = row.getValue("id") as string
      return <Badge variant="outline">#{id.slice(-8)}</Badge>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const author = row.original
      return (
        <AuthorActions
          author={author}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      )
    },
  },
]