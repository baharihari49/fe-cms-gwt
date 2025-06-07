// components/blog/tags/delete-tag-dialog.tsx
"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tag } from "./types/tags"
import { Hash } from "lucide-react"

interface DeleteTagDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tag: Tag | null
  onConfirm: () => Promise<void>
  loading?: boolean
}

export function DeleteTagDialog({
  open,
  onOpenChange,
  tag,
  onConfirm,
  loading = false,
}: DeleteTagDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = async () => {
    setIsDeleting(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } finally {
      setIsDeleting(false)
    }
  }

  if (!tag) return null

  const postCount = tag._count?.posts || tag.postCount || 0

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Tag</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                Are you sure you want to delete this tag? This action cannot be undone.
              </p>
              
              <div className="border rounded-lg p-3 bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Hash className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">{tag.name}</div>
                    <div className="text-sm text-muted-foreground">
                      #{tag.slug}
                    </div>
                  </div>
                </div>
              </div>

              {postCount > 0 && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
                  <strong>Warning:</strong> This tag is used in {postCount} post{postCount !== 1 ? 's' : ''}. 
                  Deleting this tag will remove it from those posts.
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting || loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete Tag"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}