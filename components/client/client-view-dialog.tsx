// components/clients/client-view-dialog.tsx
"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Client } from "@/components/client/types/clients"
import { format } from "date-fns"

interface ClientViewDialogProps {
  client: Client | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ClientViewDialog({ client, open, onOpenChange }: ClientViewDialogProps) {
  if (!client) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {client.image && (
              <img 
                src={client.image} 
                alt={client.name}
                className="h-8 w-8 rounded object-cover"
              />
            )}
            {client.name}
          </DialogTitle>
          <DialogDescription>
            Client Details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Name</h4>
            <p className="text-sm">{client.name}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Industry</h4>
            <Badge variant="outline">{client.industry}</Badge>
          </div>

          {client.image && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Logo</h4>
              <div className="flex items-center gap-3">
                <img 
                  src={client.image} 
                  alt={client.name}
                  className="h-16 w-16 rounded border object-cover"
                />
                <div className="text-xs text-muted-foreground break-all">
                  {client.image}
                </div>
              </div>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
            <Badge variant={client.isActive ? "default" : "secondary"}>
              {client.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">ID</h4>
            <Badge variant="outline">#{client.id}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Created</h4>
              <p className="text-sm">{format(new Date(client.createdAt), "MMM dd, yyyy")}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Updated</h4>
              <p className="text-sm">{format(new Date(client.updatedAt), "MMM dd, yyyy")}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}