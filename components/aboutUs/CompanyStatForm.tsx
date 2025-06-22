// components/aboutus/CompanyStatForm.tsx
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
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { companyStatAPI } from '@/lib/api/about'
import { CompanyStat, CreateCompanyStatRequest, UpdateCompanyStatRequest } from '@/components/aboutUs/types/aboutus'
import IconPicker from '@/lib/utils/IconPicker'

const formSchema = z.object({
  icon: z.string().min(1, 'Icon is required').max(50, 'Icon must not exceed 50 characters'),
  number: z.string().min(1, 'Number is required').max(20, 'Number must not exceed 20 characters'),
  label: z.string().min(2, 'Label must be at least 2 characters').max(100, 'Label must not exceed 100 characters'),
  order: z.number().min(0, 'Order must be 0 or greater'),
})

type FormData = z.infer<typeof formSchema>

interface CompanyStatFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  editingStat?: CompanyStat | null
}

export default function CompanyStatForm({
  open,
  onOpenChange,
  onSuccess,
  editingStat
}: CompanyStatFormProps) {
  const [loading, setLoading] = useState(false)
  const isEditing = !!editingStat

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      icon: '',
      number: '',
      label: '',
      order: 0,
    },
  })

  const watchedValues = form.watch()

  useEffect(() => {
    if (editingStat) {
      form.reset({
        icon: editingStat.icon,
        number: editingStat.number,
        label: editingStat.label,
        order: editingStat.order,
      })
    } else {
      form.reset({
        icon: '',
        number: '',
        label: '',
        order: 0,
      })
    }
  }, [editingStat, open, form])

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)

      if (isEditing && editingStat) {
        const updateData: UpdateCompanyStatRequest = {
          id: editingStat.id,
          ...data
        }
        await companyStatAPI.updateCompanyStat(updateData)
        toast.success('Company statistic updated successfully')
      } else {
        const createData: CreateCompanyStatRequest = data
        await companyStatAPI.createCompanyStat(createData)
        toast.success('Company statistic created successfully')
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Company Statistic' : 'Add Company Statistic'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the company statistic information below.'
              : 'Add a new statistic to showcase your company achievements.'
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
                      Use emoji or icon character
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

            {/* Number/Value */}
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number/Value</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 100+, 50K, 99.9%" {...field} />
                  </FormControl>
                  <FormDescription>
                    Can include numbers, symbols, and units (e.g., 100+, 50K, 99.9%)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Label */}
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Happy Clients, Projects Completed" {...field} />
                  </FormControl>
                  <FormDescription>
                    Descriptive label for the statistic
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preview */}
            <div className="space-y-2">
              <FormLabel>Preview</FormLabel>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary text-lg">
                        {watchedValues.icon || '?'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-3xl font-bold">
                        {watchedValues.number || '---'}
                      </div>
                      <div className="text-sm font-medium text-muted-foreground">
                        {watchedValues.label || 'Label'}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Order: {watchedValues.order}
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