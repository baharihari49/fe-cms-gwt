// components/projects/tabs/ReviewsTab.tsx
"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Star, Plus, X, User } from "lucide-react"

interface ReviewsTabProps {
  currentReviews: any[]
  onReviewsChange: (reviews: any[]) => void
}

export function ReviewsTab({ currentReviews, onReviewsChange }: ReviewsTabProps) {
  const [reviewInput, setReviewInput] = useState({ 
    author: "", 
    role: "", 
    company: "", 
    content: "", 
    rating: 5 
  })

  const addReview = () => {
    if (reviewInput.author.trim() && reviewInput.content.trim()) {
      const newReview = {
        author: reviewInput.author,
        role: reviewInput.role || undefined,
        company: reviewInput.company || undefined,
        content: reviewInput.content,
        rating: reviewInput.rating
      }
      onReviewsChange([...currentReviews, newReview])
      setReviewInput({ author: "", role: "", company: "", content: "", rating: 5 })
    }
  }

  const removeReview = (index: number) => {
    const filtered = currentReviews.filter((_, i) => i !== index)
    onReviewsChange(filtered)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Client Reviews & Testimonials
          <Badge variant="secondary">{currentReviews.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Review Form */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Author name *"
              value={reviewInput.author}
              onChange={(e) => setReviewInput(prev => ({ ...prev, author: e.target.value }))}
            />
            <Input
              placeholder="Role (e.g., CEO, CTO)"
              value={reviewInput.role}
              onChange={(e) => setReviewInput(prev => ({ ...prev, role: e.target.value }))}
            />
            <Input
              placeholder="Company"
              value={reviewInput.company}
              onChange={(e) => setReviewInput(prev => ({ ...prev, company: e.target.value }))}
            />
          </div>
          <Textarea
            placeholder="Review content *"
            value={reviewInput.content}
            onChange={(e) => setReviewInput(prev => ({ ...prev, content: e.target.value }))}
            className="min-h-[80px]"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Rating:</label>
              <Select 
                value={reviewInput.rating.toString()} 
                onValueChange={(value) => setReviewInput(prev => ({ ...prev, rating: parseInt(value) }))}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 ⭐</SelectItem>
                  <SelectItem value="4">4 ⭐</SelectItem>
                  <SelectItem value="3">3 ⭐</SelectItem>
                  <SelectItem value="2">2 ⭐</SelectItem>
                  <SelectItem value="1">1 ⭐</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="button" onClick={addReview} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Review
            </Button>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {currentReviews.map((review, index) => (
            <div key={index} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{review.author}</span>
                    {review.role && (
                      <Badge variant="outline" className="text-xs">
                        {review.role}
                      </Badge>
                    )}
                    {review.company && (
                      <span className="text-sm text-muted-foreground">
                        at {review.company}
                      </span>
                    )}
                    <div className="flex">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 italic">
                    &quot;{review.content}&quot;
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeReview(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {currentReviews.length === 0 && (
            <p className="text-muted-foreground text-sm text-center py-8">
              No reviews added yet. Add client testimonials to showcase your work.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}