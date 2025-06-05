// components/projects/columns.tsx
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
import { Project, ProjectStatus } from "@/components/portfolio/types"
import { format } from "date-fns"

interface ProjectActionsProps {
  project: Project
  onEdit: (project: Project) => void
  onDelete: (project: Project) => void
  onView: (project: Project) => void
}

const ProjectActions = ({ project, onEdit, onDelete, onView }: ProjectActionsProps) => {
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
        <DropdownMenuItem onClick={() => onView(project)}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(project)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        {project.links?.live && (
          <DropdownMenuItem onClick={() => window.open(project.links?.live, '_blank')}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Live Site
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => onDelete(project)}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const StatusBadge = ({ status }: { status: ProjectStatus }) => {
  const variants = {
    [ProjectStatus.DEVELOPMENT]: 'secondary',
    [ProjectStatus.BETA]: 'outline',
    [ProjectStatus.LIVE]: 'default',
    [ProjectStatus.ARCHIVED]: 'destructive',
    [ProjectStatus.MAINTENANCE]: 'secondary',
  } as const

  return (
    <Badge variant={variants[status] || 'secondary'}>
      {status}
    </Badge>
  )
}

export const createColumns = (
  onEdit: (project: Project) => void,
  onDelete: (project: Project) => void,
  onView: (project: Project) => void
): ColumnDef<Project>[] => [
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
      const project = row.original
      return (
        <div className="flex items-center space-x-3">
          {project.image && (
            <img 
              src={project.image} 
              alt={project.title}
              className="h-10 w-10 rounded object-cover"
            />
          )}
          <div>
            <div className="font-medium">{project.title}</div>
            <div className="text-sm text-muted-foreground">{project.subtitle}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "category.label",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <Badge variant="outline">{row.original.category.label}</Badge>
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      return <span className="text-sm">{row.getValue("type")}</span>
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <StatusBadge status={row.getValue("status")} />
    },
  },
  {
    accessorKey: "technologies",
    header: "Technologies",
    cell: ({ row }) => {
      const technologies: string[] = row.getValue("technologies")
      return (
        <div className="flex flex-wrap gap-1">
          {technologies.slice(0, 3).map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
          {technologies.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{technologies.length - 3}
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "client",
    header: "Client",
    cell: ({ row }) => {
      const client = row.getValue("client") as string
      return client ? (
        <span className="text-sm">{client}</span>
      ) : (
        <span className="text-sm text-muted-foreground">-</span>
      )
    },
  },
  {
    accessorKey: "year",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Year
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const year = row.getValue("year") as string
      return year ? (
        <span className="text-sm">{year}</span>
      ) : (
        <span className="text-sm text-muted-foreground">-</span>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <span className="text-sm">
          {format(new Date(row.getValue("createdAt")), "MMM dd, yyyy")}
        </span>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const project = row.original
      return (
        <ProjectActions
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      )
    },
  },
]