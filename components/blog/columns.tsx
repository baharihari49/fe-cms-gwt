// components/blog/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, EyeOff, MoreHorizontal, Edit, Trash2 } from "lucide-react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BlogPost } from "@/components/blog/types/blog"
import { formatDistanceToNow } from "date-fns"

interface ColumnActionsProps {
  onEdit: (post: BlogPost) => void
  onDelete: (post: BlogPost) => void
  onTogglePublish: (post: BlogPost) => void
}

export const createColumns = ({
  onEdit,
  onDelete,
  onTogglePublish,
}: ColumnActionsProps): ColumnDef<BlogPost>[] => [
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
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 -ml-2"
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const post = row.original
      return (
        <div className="max-w-[300px]">
          <div className="font-medium truncate">{post.title}</div>
          <div className="text-sm text-muted-foreground truncate mt-1">
            {post.excerpt}
          </div>
          <div className="flex items-center gap-1 mt-2">
            {post.featured && (
              <Badge variant="secondary" className="text-xs px-1">
                Featured
              </Badge>
            )}
            <Badge
              variant={post.published ? "default" : "outline"}
              className="text-xs px-1"
            >
              {post.published ? "Published" : "Draft"}
            </Badge>
          </div>
        </div>
      )
    },
    size: 300,
  },
  {
    accessorKey: "author",
    header: "Author",
    cell: ({ row }) => {
      const author = row.original.author
      return (
        <div className="flex items-center gap-2 max-w-[120px]">
          <Avatar className="h-6 w-6 flex-shrink-0">
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback className="text-xs">
              {author.name.split(" ").map(n => n[0]).join("").toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="font-medium text-sm truncate">{author.name}</div>
          </div>
        </div>
      )
    },
    size: 120,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.original.category
      return (
        <Badge variant="outline" className="text-xs whitespace-nowrap">
          {category.name}
        </Badge>
      )
    },
    size: 100,
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => {
      const tags = row.original.tags
      return (
        <div className="flex flex-wrap gap-1 max-w-[100px]">
          {tags.slice(0, 1).map((tagRelation) => (
            <Badge
              key={tagRelation.tag.id}
              variant="secondary"
              className="text-xs px-1"
            >
              {tagRelation.tag.name}
            </Badge>
          ))}
          {tags.length > 1 && (
            <Badge variant="secondary" className="text-xs px-1">
              +{tags.length - 1}
            </Badge>
          )}
        </div>
      )
    },
    size: 100,
  },
  {
    accessorKey: "stats",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 -ml-2"
        >
          Views
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const stats = row.original.stats
      return (
        <div className="text-sm font-medium">
          {stats?.views || 0}
        </div>
      )
    },
    sortingFn: (rowA, rowB) => {
      return rowA.original.stats.views - rowB.original.stats.views
    },
    size: 80,
  },
  {
    accessorKey: "readTime",
    header: "Read Time",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs whitespace-nowrap">
        {row.getValue("readTime")}
      </Badge>
    ),
    size: 90,
  },
  {
    accessorKey: "publishedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 -ml-2"
        >
          Published
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue("publishedAt") as string
      return (
        <div className="text-sm whitespace-nowrap">
          {date ? formatDistanceToNow(new Date(date), { addSuffix: true }) : "Not published"}
        </div>
      )
    },
    size: 120,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const post = row.original

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
              onClick={() => navigator.clipboard.writeText(post.id)}
            >
              Copy post ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(post.slug)}
            >
              Copy slug
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(post)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit post
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onTogglePublish(post)}>
              {post.published ? (
                <EyeOff className="mr-2 h-4 w-4" />
              ) : (
                <Eye className="mr-2 h-4 w-4" />
              )}
              {post.published ? "Unpublish" : "Publish"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(post)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete post
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    size: 50,
  },
]