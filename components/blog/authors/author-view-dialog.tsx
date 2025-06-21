// components/authors/author-view-dialog.tsx
"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Author } from "./types/author"

interface AuthorViewDialogProps {
  author: Author | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthorViewDialog({ author, open, onOpenChange }: AuthorViewDialogProps) {
  if (!author) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback>
                {author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {author.name}
          </DialogTitle>
          <DialogDescription>
            Author Details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Name</h4>
            <p className="text-sm">{author.name}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Email</h4>
            <p className="text-sm">{author.email}</p>
          </div>

          {author.bio && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Bio</h4>
              <p className="text-sm text-muted-foreground">{author.bio}</p>
            </div>
          )}

          {author.avatar && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Avatar</h4>
              <div className="flex items-center gap-2">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={author.avatar} alt={author.name} />
                  <AvatarFallback>
                    {author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Posts Count</h4>
            <Badge variant="secondary">{author._count.posts} posts</Badge>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">ID</h4>
            <Badge variant="outline">#{author.id.slice(-8)}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Created At</h4>
              <p className="text-sm">{new Date(author.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Updated At</h4>
              <p className="text-sm">{new Date(author.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}