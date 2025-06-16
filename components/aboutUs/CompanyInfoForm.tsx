// components/aboutus/CompanyInfoForm.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Loader2, Upload, Image as ImageIcon } from 'lucide-react'
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
// import { toast } from '@/components/ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { companyInfoAPI } from '@/lib/api/about'
import { CompanyInfo, CreateCompanyInfoRequest, UpdateCompanyInfoRequest } from '@/components/aboutUs/types/aboutus'

const formSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').max(100, 'Company name must not exceed 100 characters'),
  previousName: z.string().max(100, 'Previous name must not exceed 100 characters').optional(),
  foundedYear: z.string().min(1, 'Founded year is required').max(4, 'Founded year must not exceed 4 characters'),
  mission: z.string().min(10, 'Mission must be at least 10 characters').max(2000, 'Mission must not exceed 2000 characters'),
  vision: z.string().min(10, 'Vision must be at least 10 characters').max(2000, 'Vision must not exceed 2000 characters'),
  aboutHeader: z.string().min(10, 'About header must be at least 10 characters').max(200, 'About header must not exceed 200 characters'),
  aboutSubheader: z.string().min(10, 'About subheader must be at least 10 characters').max(500, 'About subheader must not exceed 500 characters'),
  journeyTitle: z.string().max(100, 'Journey title must not exceed 100 characters').optional(),
  storyText: z.string().min(50, 'Story text must be at least 50 characters').max(5000, 'Story text must not exceed 5000 characters'),
  heroImageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
})

type FormData = z.infer<typeof formSchema>

interface CompanyInfoFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  editingInfo?: CompanyInfo | null
}

export default function CompanyInfoForm({ 
  open, 
  onOpenChange, 
  onSuccess, 
  editingInfo 
}: CompanyInfoFormProps) {
  const [loading, setLoading] = useState(false)
  const isEditing = !!editingInfo

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      previousName: '',
      foundedYear: '',
      mission: '',
      vision: '',
      aboutHeader: '',
      aboutSubheader: '',
      journeyTitle: '',
      storyText: '',
      heroImageUrl: '',
    },
  })

  const watchedStoryText = form.watch('storyText')

  useEffect(() => {
    if (editingInfo) {
      form.reset({
        companyName: editingInfo.companyName,
        previousName: editingInfo.previousName || '',
        foundedYear: editingInfo.foundedYear,
        mission: editingInfo.mission,
        vision: editingInfo.vision,
        aboutHeader: editingInfo.aboutHeader,
        aboutSubheader: editingInfo.aboutSubheader,
        journeyTitle: editingInfo.journeyTitle || '',
        storyText: editingInfo.storyText,
        heroImageUrl: editingInfo.heroImageUrl || '',
      })
    } else {
      form.reset({
        companyName: '',
        previousName: '',
        foundedYear: '',
        mission: '',
        vision: '',
        aboutHeader: '',
        aboutSubheader: '',
        journeyTitle: '',
        storyText: '',
        heroImageUrl: '',
      })
    }
  }, [editingInfo, open, form])

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)

      const submitData = {
        ...data,
        heroImageUrl: data.heroImageUrl || null
      }

      if (isEditing && editingInfo) {
        const updateData: UpdateCompanyInfoRequest = {
          id: editingInfo.id,
          ...submitData
        }
        await companyInfoAPI.updateCompanyInfo(updateData)
        // toast({
        //   title: "Success",
        //   description: "Company information updated successfully",
        // })
      } else {
        const createData: CreateCompanyInfoRequest = submitData
        await companyInfoAPI.createCompanyInfo(createData)
        // toast({
        //   title: "Success",
        //   description: "Company information created successfully",
        // })
      }

      onSuccess()
      onOpenChange(false)
      form.reset()
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: error instanceof Error ? error.message : 'An error occurred',
      //   variant: "destructive",
      // })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Company Information' : 'Add Company Information'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update your company information and story below.'
              : 'Add comprehensive information about your company.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="previousName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Previous Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Former company name (optional)" {...field} />
                      </FormControl>
                      <FormDescription>
                        If your company was previously known by another name
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="foundedYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Founded Year *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2020" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="journeyTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Journey Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Our Journey" {...field} />
                      </FormControl>
                      <FormDescription>
                        Title for your company journey section
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="heroImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hero Image URL</FormLabel>
                    <FormControl>
                      <Input 
                        type="url" 
                        placeholder="https://example.com/image.jpg" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      URL of the main image for your company (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* About Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">About Section</h3>
              
              <FormField
                control={form.control}
                name="aboutHeader"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About Header *</FormLabel>
                    <FormControl>
                      <Input placeholder="Main heading for about section" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="aboutSubheader"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About Subheader *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Supporting text for about section"
                        className="resize-none"
                        rows={2}
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
            </div>

            {/* Mission and Vision */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Mission & Vision</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="mission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mission *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Your company's mission statement"
                          className="resize-none"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0}/2000 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vision"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vision *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Your company's vision for the future"
                          className="resize-none"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0}/2000 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Company Story */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Company Story</h3>
              
              <FormField
                control={form.control}
                name="storyText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Story Text *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell your company's complete story - your origins, journey, challenges overcome, and what makes you unique..."
                        className="resize-none"
                        rows={8}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {watchedStoryText?.length || 0}/5000 characters - Tell the complete story of your company
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="border-t pt-6">
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