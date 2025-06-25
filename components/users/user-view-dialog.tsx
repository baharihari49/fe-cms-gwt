// components/users/user-view-dialog.tsx
"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { UserCircle2, Mail, Shield, Calendar, Clock } from "lucide-react"
import { User } from "@/components/users/types/user"
import { format } from "date-fns"

interface UserViewDialogProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const getRoleVariant = (role: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (role) {
    case 'ADMIN':
      return 'destructive'
    case 'USER':
      return 'secondary'
    default:
      return 'outline'
  }
}

const getRoleColor = (role: string): string => {
  switch (role) {
    case 'ADMIN':
      return 'text-red-600'
    case 'USER':
      return 'text-blue-600'
    default:
      return 'text-gray-600'
  }
}

export function UserViewDialog({ user, open, onOpenChange }: UserViewDialogProps) {
  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserCircle2 className="h-5 w-5" />
            <span>User Details</span>
          </DialogTitle>
          <DialogDescription>
            Viewing information for user #{user.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Avatar & Basic Info */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <UserCircle2 className="h-16 w-16 text-gray-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="mt-2">
                <Badge variant={getRoleVariant(user.role)} className={getRoleColor(user.role)}>
                  {user.role}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Detailed Information */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Account Information
              </h4>
              
              {/* User ID */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center p-0">
                    #
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">User ID</p>
                  <p className="text-sm text-muted-foreground">#{user.id}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Mail className="h-8 w-8 p-2 bg-blue-100 text-blue-600 rounded-full" />
                </div>
                <div>
                  <p className="text-sm font-medium">Email Address</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Shield className="h-8 w-8 p-2 bg-purple-100 text-purple-600 rounded-full" />
                </div>
                <div>
                  <p className="text-sm font-medium">Role</p>
                  <p className="text-sm text-muted-foreground">
                    {user.role === 'ADMIN' ? 'Administrator' : 'Regular User'}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Timestamps */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Timestamps
              </h4>

              {/* Created At */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Calendar className="h-8 w-8 p-2 bg-green-100 text-green-600 rounded-full" />
                </div>
                <div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(user.createdAt), 'PPP')} at {format(new Date(user.createdAt), 'p')}
                  </p>
                </div>
              </div>

              {/* Updated At */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Clock className="h-8 w-8 p-2 bg-orange-100 text-orange-600 rounded-full" />
                </div>
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(user.updatedAt), 'PPP')} at {format(new Date(user.updatedAt), 'p')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}