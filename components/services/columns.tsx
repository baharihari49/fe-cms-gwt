// components/services/columns.tsx
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
import * as LucideIcons from "lucide-react"
import { Service } from "@/components/services/types/services"
import { format } from "date-fns"

// Remove emoji mapping since data is already lucide icon names
interface ServiceActionsProps {
  service: Service
  onEdit: (service: Service) => void
  onDelete: (service: Service) => void
  onView: (service: Service) => void
}

const ServiceActions = ({ service, onEdit, onDelete, onView }: ServiceActionsProps) => {
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
        <DropdownMenuItem onClick={() => onView(service)}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(service)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => onDelete(service)}
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
  onEdit: (service: Service) => void,
  onDelete: (service: Service) => void,
  onView: (service: Service) => void
): ColumnDef<Service>[] => [
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
    accessorKey: "icon",
    header: "Icon",
    cell: ({ row }) => {
      const iconName = row.getValue("icon") as string
      
      // Pastikan iconName ada dan tidak kosong
      if (!iconName) {
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted">
            <span className="text-xs text-muted-foreground">?</span>
          </div>
        )
      }
      
      // Coba ambil icon dari lucide
      const IconComponent = (LucideIcons as any)[iconName]
      
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted">
          {IconComponent ? (
            <IconComponent className="h-4 w-4" />
          ) : (
            <div className="text-xs text-center">
              <div>{iconName}</div>
              <div className="text-muted-foreground">Not found</div>
            </div>
          )}
        </div>
      )
    },
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
      const service = row.original
      return (
        <div>
          <div className="font-medium">{service.title}</div>
          <div className="text-sm text-muted-foreground">{service.subtitle}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string
      return (
        <div className="max-w-[300px]">
          <p className="text-sm text-muted-foreground truncate">
            {description}
          </p>
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
        <div className="flex items-center gap-2">
          <div 
            className={`w-4 h-4 rounded-full ${color}`}
            title={color}
          />
          <span className="text-xs text-muted-foreground">{color}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "features",
    header: "Features",
    cell: ({ row }) => {
      const features = row.original.features || []
      if (features.length === 0) {
        return <span className="text-xs text-muted-foreground">No features</span>
      }
      return (
        <div className="flex flex-wrap gap-1">
          {features.slice(0, 2).map((feature) => (
            <Badge key={feature.id} variant="secondary" className="text-xs">
              {feature.name}
            </Badge>
          ))}
          {features.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{features.length - 2} more
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "technologies",
    header: "Technologies",
    cell: ({ row }) => {
      const technologies = row.original.technologies || []
      if (technologies.length === 0) {
        return <span className="text-xs text-muted-foreground">No technologies</span>
      }
      return (
        <div className="flex flex-wrap gap-1">
          {technologies.slice(0, 2).map((tech) => (
            <Badge key={tech.id} variant="outline" className="text-xs">
              {tech.technology?.name || 'Unknown'}
            </Badge>
          ))}
          {technologies.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{technologies.length - 2} more
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const service = row.original
      return (
        <ServiceActions
          service={service}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      )
    },
  },
]