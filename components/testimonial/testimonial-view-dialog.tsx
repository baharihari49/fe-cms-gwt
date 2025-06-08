// components/testimonials/testimonial-view-dialog.tsx
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
import { Testimonial } from "@/components/testimonial/types/testimonial"
import { format } from "date-fns"
import { Star } from "lucide-react"

interface TestimonialViewDialogProps {
  testimonial: Testimonial | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const RatingDisplay = ({ rating }: { rating?: number }) => {
  if (!rating) return <span className="text-sm text-muted-foreground">No rating</span>
  
  const stars = Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`h-4 w-4 ${
        i < Math.floor(rating) 
          ? "fill-yellow-400 text-yellow-400" 
          : rating > i 
          ? "fill-yellow-400/50 text-yellow-400" 
          : "text-gray-300"
      }`}
    />
  ))
  
  return (
    <div className="flex items-center gap-1">
      {stars}
      <span className="ml-2 text-sm font-medium">({rating})</span>
    </div>
  )
}

export function TestimonialViewDialog({ testimonial, open, onOpenChange }: TestimonialViewDialogProps) {
  if (!testimonial) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
              <AvatarFallback>
                {testimonial.author.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{testimonial.author}</div>
              {testimonial.role && (
                <div className="text-sm text-muted-foreground">
                  {testimonial.role}
                  {testimonial.company && ` at ${testimonial.company}`}
                </div>
              )}
            </div>
          </DialogTitle>
          <DialogDescription>
            Testimonial Details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Content */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Content</h4>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm leading-relaxed italic">"{testimonial.content}"</p>
            </div>
          </div>

          {/* Rating */}
          {testimonial.rating && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Rating</h4>
              <RatingDisplay rating={testimonial.rating} />
            </div>
          )}

          {/* Relations */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Project</h4>
              {testimonial.project ? (
                <Badge variant="outline">
                  #{testimonial.project.id} - {testimonial.project.title}
                </Badge>
              ) : (
                <span className="text-sm text-muted-foreground">No project linked</span>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Client</h4>
              {testimonial.client ? (
                <Badge variant="outline">
                  #{testimonial.client.id} - {testimonial.client.name}
                </Badge>
              ) : (
                <span className="text-sm text-muted-foreground">No client linked</span>
              )}
            </div>
          </div>

          {/* Author Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Author</h4>
              <p className="text-sm">{testimonial.author}</p>
            </div>

            {testimonial.role && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Role</h4>
                <p className="text-sm">{testimonial.role}</p>
              </div>
            )}
          </div>

          {testimonial.company && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Company</h4>
              <p className="text-sm">{testimonial.company}</p>
            </div>
          )}

          {/* Meta Info */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
              <div>
                <span className="font-medium">ID:</span> #{testimonial.id}
              </div>
              <div>
                <span className="font-medium">Created:</span> {format(new Date(testimonial.createdAt), "MMM dd, yyyy")}
              </div>
              <div>
                <span className="font-medium">Updated:</span> {format(new Date(testimonial.updatedAt), "MMM dd, yyyy")}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}