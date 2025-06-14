// components/faq/faq-view-dialog.tsx
"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { FAQ } from "./types/faq"

interface FAQViewDialogProps {
  faq: FAQ | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FAQViewDialog({ faq, open, onOpenChange }: FAQViewDialogProps) {
  if (!faq) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            FAQ Details
            {faq.popular && (
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            )}
          </DialogTitle>
          <DialogDescription>
            View FAQ information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Category</h4>
            <Badge variant="secondary" className="capitalize">
              {faq.faqCategory.name}
            </Badge>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Question</h4>
            <p className="text-sm font-medium">{faq.question}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Answer</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
              {faq.popular ? (
                <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
                  <Star className="mr-1 h-3 w-3 fill-white" />
                  Popular
                </Badge>
              ) : (
                <Badge variant="outline">Normal</Badge>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">ID</h4>
              <Badge variant="outline">#{faq.id}</Badge>
            </div>
          </div>

          <div className="text-xs text-muted-foreground pt-2 border-t">
            <p>Created: {new Date(faq.createdAt).toLocaleDateString()}</p>
            <p>Updated: {new Date(faq.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}