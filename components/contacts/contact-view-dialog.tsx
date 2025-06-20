// components/contacts/contact-view-dialog.tsx
"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Copy } from "lucide-react"
import { Contact } from "./types/contact"
import { toast } from "sonner"

interface ContactViewDialogProps {
  contact: Contact | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContactViewDialog({ contact, open, onOpenChange }: ContactViewDialogProps) {
  if (!contact) return null

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  const openLink = () => {
    if (contact.href) {
      window.open(contact.href, '_blank')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${contact.color}`}></div>
            {contact.title}
          </DialogTitle>
          <DialogDescription>
            Contact Information Details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Title</h4>
            <p className="text-sm font-medium">{contact.title}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Details</h4>
            <div className="space-y-2">
              {contact.details.map((detail, index) => (
                <div key={index} className="flex items-center justify-between group">
                  <p className="text-sm">{detail}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(detail)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Color</h4>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded bg-gradient-to-r ${contact.color} border`}></div>
              <Badge variant="secondary" className="font-mono text-xs">
                {contact.color}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(contact.color)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {contact.href && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Link</h4>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground break-all flex-1">
                  {contact.href}
                </p>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(contact.href!)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={openLink}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">ID</h4>
            <Badge variant="outline">#{contact.id}</Badge>
          </div>

          {contact.href && (
            <div className="pt-4 border-t">
              <Button onClick={openLink} className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Link
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}