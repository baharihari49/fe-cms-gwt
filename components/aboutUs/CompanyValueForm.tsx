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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
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

const colorOptions = [
  { label: 'Blue to Purple', value: 'bg-gradient-to-r from-blue-500 to-purple-600' },
  { label: 'Green to Blue', value: 'bg-gradient-to-r from-green-500 to-blue-600' },
  { label: 'Purple to Pink', value: 'bg-gradient-to-r from-purple-500 to-pink-600' },
  { label: 'Orange to Red', value: 'bg-gradient-to-r from-orange-500 to-red-600' },
  { label: 'Teal to Green', value: 'bg-gradient-to-r from-teal-500 to-green-600' },
  { label: 'Indigo to Blue', value: 'bg-gradient-to-r from-indigo-500 to-blue-600' },
  { label: 'Rose to Pink', value: 'bg-gradient-to-r from-rose-500 to-pink-600' },
  { label: 'Amber to Orange', value: 'bg-gradient-to-r from-amber-500 to-orange-600' },
]

// Icon Picker Component
interface IconPickerProps {
  value: string
  onValueChange: (value: string) => void
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
      color: colorOptions[0].value,
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
        color: colorOptions[0].value,
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
      <DialogContent className="sm:max-w-[600px]">
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

            {/* Color */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color Theme</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a color theme" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colorOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded ${option.value}`} />
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preview */}
            <div className="space-y-2">
              <FormLabel>Preview</FormLabel>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-lg ${watchedValues.color} flex items-center justify-center`}>
                      {PreviewIcon ? (
                        <PreviewIcon className="w-6 h-6 text-white" />
                      ) : (
                        <span className="text-white text-lg">?</span>
                      )}
                    </div>
                    <h3 className="font-semibold mb-2">
                      {watchedValues.title || 'Title'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {watchedValues.description || 'Description will appear here'}
                    </p>
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