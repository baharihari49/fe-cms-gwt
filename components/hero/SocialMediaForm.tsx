// components/hero/SocialMediaForm.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
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
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { heroAPI } from '@/lib/api/hero'
import { SocialMedia, CreateSocialMediaRequest, UpdateSocialMediaRequest } from '@/components/hero/types/hero'

const formSchema = z.object({
  name: z
    .string()
    .min(2, 'Social media name must be at least 2 characters long')
    .max(50, 'Social media name must not exceed 50 characters'),
  url: z
    .string()
    .url('Must be a valid URL')
    .min(1, 'URL is required'),
  isActive: z.boolean(),
  order: z.number().int().min(0, 'Order must be 0 or greater'),
})

type FormData = z.infer<typeof formSchema>

interface SocialMediaFormProps {
  socialMedia?: SocialMedia
  onSuccess?: () => void
  onCancel?: () => void
}

const socialMediaOptions = [
  { value: 'GitHub', label: 'GitHub' },
  { value: 'LinkedIn', label: 'LinkedIn' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Facebook', label: 'Facebook' },
  { value: 'Twitter', label: 'Twitter' },
  { value: 'YouTube', label: 'YouTube' },
  { value: 'TikTok', label: 'TikTok' },
  { value: 'Email', label: 'Email' },
]

export function SocialMediaForm({ socialMedia, onSuccess, onCancel }: SocialMediaFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: socialMedia?.name || '',
      url: socialMedia?.url || '',
      isActive: socialMedia?.isActive ?? true,
      order: socialMedia?.order ?? 0,
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      const processedData: CreateSocialMediaRequest = {
        name: data.name,
        url: data.url,
        isActive: data.isActive,
        order: data.order,
      }

      if (socialMedia) {
        // Update existing social media
        const updateData: UpdateSocialMediaRequest = {
          id: socialMedia.id,
          ...processedData,
        }
        await heroAPI.updateSocialMedia(updateData)
        toast.success('Social media updated successfully')
      } else {
        // Create new social media
        await heroAPI.createSocialMedia(processedData)
        toast.success('Social media created successfully')
      }

      onSuccess?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Platform Name</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a platform" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {socialMediaOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the social media platform.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://github.com/your-company"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The full URL to your social media profile or page.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>
                  The order in which this social media link appears (0 = first).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg p-4 space-y-0">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active</FormLabel>
                  <FormDescription>
                    Display this social media link on the website.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex gap-4 justify-end">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : socialMedia ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}