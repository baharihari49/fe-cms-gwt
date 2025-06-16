// components/team-members/columns.tsx
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
import { ArrowUpDown, MoreHorizontal, Edit, Trash2, Eye, ExternalLink } from "lucide-react"
import { TeamMember } from "./types/team-member"

interface TeamMemberActionsProps {
  teamMember: TeamMember
  onEdit: (teamMember: TeamMember) => void
  onDelete: (teamMember: TeamMember) => void
  onView: (teamMember: TeamMember) => void
}

const TeamMemberActions = ({ teamMember, onEdit, onDelete, onView }: TeamMemberActionsProps) => {
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
        <DropdownMenuItem onClick={() => onView(teamMember)}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(teamMember)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        {teamMember.social.linkedin && (
          <DropdownMenuItem asChild>
            <a href={teamMember.social.linkedin} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              LinkedIn
            </a>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => onDelete(teamMember)}
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
  onEdit: (teamMember: TeamMember) => void,
  onDelete: (teamMember: TeamMember) => void,
  onView: (teamMember: TeamMember) => void
): ColumnDef<TeamMember>[] => [
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
          Member
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const teamMember = row.original
      return (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={teamMember.avatar} alt={teamMember.name} />
            <AvatarFallback>
              {teamMember.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{teamMember.name}</div>
            <div className="text-sm text-muted-foreground">{teamMember.position}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "department",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Department
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <Badge variant="secondary">{row.getValue("department")}</Badge>
    },
  },
  {
    accessorKey: "speciality",
    header: "Speciality",
    cell: ({ row }) => {
      const speciality = row.getValue("speciality") as string
      return (
        <Badge variant="outline">{speciality}</Badge>
      )
    },
  },
  {
    accessorKey: "experience",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Experience
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <span className="text-sm">{row.getValue("experience")}</span>
    },
  },
  {
    accessorKey: "skills",
    header: "Skills",
    cell: ({ row }) => {
      const skills = row.getValue("skills") as string[] | any
      
      // Handle case where skills might not be an array
      let skillsArray: string[] = []
      if (Array.isArray(skills)) {
        skillsArray = skills
      } else if (skills && typeof skills === 'object' && skills.length !== undefined) {
        // Handle case where skills might be array-like object
        skillsArray = Array.from(skills)
      } else if (typeof skills === 'string') {
        // Handle case where skills might be a stringified array
        try {
          const parsed = JSON.parse(skills)
          skillsArray = Array.isArray(parsed) ? parsed : []
        } catch {
          skillsArray = [skills] // Treat as single skill
        }
      }
      
      const displaySkills = skillsArray.slice(0, 3)
      const remainingCount = skillsArray.length - displaySkills.length
      
      if (skillsArray.length === 0) {
        return <span className="text-sm text-muted-foreground">No skills</span>
      }
      
      return (
        <div className="flex flex-wrap gap-1">
          {displaySkills.map((skill, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
          {remainingCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              +{remainingCount}
            </Badge>
          )}
        </div>
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
      const teamMember = row.original
      return (
        <TeamMemberActions
          teamMember={teamMember}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      )
    },
  },
]