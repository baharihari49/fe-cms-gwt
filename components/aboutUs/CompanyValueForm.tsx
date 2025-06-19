// components/aboutus/CompanyValueForm.tsx
'use client'

import React, { useState, useEffect } from 'react'
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
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { companyValueAPI } from '@/lib/api/about'
import { CompanyValue, CreateCompanyValueRequest, UpdateCompanyValueRequest } from '@/components/aboutUs/types/aboutus'
import { 
  getLucideIcon, 
  searchLucideIcons, 
  // getIconsByCategory, 
  // POPULAR_LUCIDE_ICONS 
} from '@/lib/utils/lucideIcons'
import * as LucideIcons from 'lucide-react'
import IconPicker from '@/lib/utils/IconPicker'
import { GradientColorFormField } from '@/components/GradientColorFormField'
import { gradientColorOptions } from '@/lib/config/gradientColors'

const formSchema = z.object({
  icon: z.string().min(1, 'Icon is required').max(50, 'Icon must not exceed 50 characters'),
  title: z.string().min(2, 'Title must be at least 2 characters').max(100, 'Title must not exceed 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must not exceed 500 characters'),
  color: z.string().min(1, 'Color is required'),
  order: z.number().min(0, 'Order must be 0 or greater'),
})

type FormData = z.infer<typeof formSchema>

interface CompanyValueFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  editingValue?: CompanyValue | null
}

export default function CompanyValueForm({ 
  open, 
  onOpenChange, 
  onSuccess, 
  editingValue 
}: CompanyValueFormProps) {
  const [loading, setLoading] = useState(false)
  const isEditing = !!editingValue

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      icon: '',
      title: '',
      description: '',
      color: gradientColorOptions[0].value,
      order: 0,
    },
  })

  const watchedValues = form.watch()
  const PreviewIcon = getLucideIcon(watchedValues.icon)

  useEffect(() => {
    if (editingValue) {
      form.reset({
        icon: editingValue.icon,
        title: editingValue.title,
        description: editingValue.description,
        color: editingValue.color,
        order: editingValue.order,
      })
    } else {
      form.reset({
        icon: '',
        title: '',
        description: '',
        color: gradientColorOptions[0].value,
        order: 0,
      })
    }
  }, [editingValue, open, form])

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)

      if (isEditing && editingValue) {
        const updateData: UpdateCompanyValueRequest = {
          id: editingValue.id,
          ...data
        }
        await companyValueAPI.updateCompanyValue(updateData)
        toast.success('Company value updated successfully')
      } else {
        const createData: CreateCompanyValueRequest = data
        await companyValueAPI.createCompanyValue(createData)
        toast.success('Company value created successfully')
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
            {isEditing ? 'Edit Company Value' : 'Add Company Value'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the company value information below.'
              : 'Add a new company value to showcase your principles.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Icon */}
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <IconPicker 
                        value={field.value} 
                        onValueChange={field.onChange} 
                      />
                    </FormControl>
                    <FormDescription>
                      Choose from Lucide React icons
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
                    <Input placeholder="Enter value title" {...field} />
                  </FormControl>
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
                      placeholder="Enter value description"
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

            {/* Color - Using Separated Component */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <GradientColorFormField
                  field={field}
                  label="Gradient Color Theme"
                  placeholder="Select a gradient color"
                  description="Choose from our curated collection of beautiful gradients"
                  showPreview={true}
                  showCategories={true}
                />
              )}
            />

            {/* Preview */}
            <div className="space-y-2">
              <FormLabel>Preview</FormLabel>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-xl ${watchedValues.color} flex items-center justify-center shadow-lg`}>
                      {PreviewIcon ? (
                        <PreviewIcon className="w-8 h-8 text-white" />
                      ) : (
                        <span className="text-white text-2xl">?</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      {watchedValues.title || 'Title'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {watchedValues.description || 'Description will appear here'}
                    </p>
                    <div className="mt-3">
                      <Badge variant="outline" className="text-xs">
                        Order: {watchedValues.order}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

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
                {loading && <LucideIcons.Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isEditing ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}