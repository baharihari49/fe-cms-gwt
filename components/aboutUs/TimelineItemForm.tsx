// components/aboutus/TimelineItemForm.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { timelineItemAPI } from '@/lib/api/about'
import { TimelineItem, CreateTimelineItemRequest, UpdateTimelineItemRequest } from '@/components/aboutUs/types/aboutus'

const formSchema = z.object({
  year: z.string().min(4, 'Year must be at least 4 characters').max(20, 'Year must not exceed 20 characters'),
  title: z.string().min(2, 'Title must be at least 2 characters').max(100, 'Title must not exceed 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must not exceed 500 characters'),
  achievement: z.string().min(2, 'Achievement must be at least 2 characters').max(100, 'Achievement must not exceed 100 characters'),
  extendedDescription: z.string().min(20, 'Extended description must be at least 20 characters').max(1000, 'Extended description must not exceed 1000 characters'),
  order: z.number().min(0, 'Order must be 0 or greater'),
})

type FormData = z.infer<typeof formSchema>

interface TimelineItemFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  editingItem?: TimelineItem | null
}

export default function TimelineItemForm({ 
  open, 
  onOpenChange, 
  onSuccess, 
  editingItem 
}: TimelineItemFormProps) {
  const [loading, setLoading] = useState(false)
  const isEditing = !!editingItem

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      year: '',
      title: '',
      description: '',
      achievement: '',
      extendedDescription: '',
      order: 0,
    },
  })

  useEffect(() => {
    if (editingItem) {
      form.reset({
        year: editingItem.year,
        title: editingItem.title,
        description: editingItem.description,
        achievement: editingItem.achievement,
        extendedDescription: editingItem.extendedDescription,
        order: editingItem.order,
      })
    } else {
      form.reset({
        year: '',
        title: '',
        description: '',
        achievement: '',
        extendedDescription: '',
        order: 0,
      })
    }
  }, [editingItem, open, form])

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)

      if (isEditing && editingItem) {
        const updateData: UpdateTimelineItemRequest = {
          id: editingItem.id,
          ...data
        }
        await timelineItemAPI.updateTimelineItem(updateData)
        toast.success('Timeline item updated successfully')
      } else {
        const createData: CreateTimelineItemRequest = data
        await timelineItemAPI.createTimelineItem(createData)
        toast.success('Timeline item created successfully')
      }

      onSuccess()
      onOpenChange(false)
      form.reset()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Timeline Item' : 'Add Timeline Item'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the timeline milestone information below.'
              : 'Add a new milestone to your company timeline.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Year */}
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 2020, Q1 2021" {...field} />
                    </FormControl>
                    <FormDescription>
                      The year or period of this milestone
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Order */}
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Order for display sequence
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter milestone title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Achievement */}
            <FormField
              control={form.control}
              name="achievement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key Achievement</FormLabel>
                  <FormControl>
                    <Input placeholder="Main accomplishment for this milestone" {...field} />
                  </FormControl>
                  <FormDescription>
                    The main achievement or highlight of this milestone
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of this milestone"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length || 0}/500 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Extended Description */}
            <FormField
              control={form.control}
              name="extendedDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Extended Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description with more context and background"
                      className="resize-none"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length || 0}/1000 characters - Provide detailed context and background information
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isEditing ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}