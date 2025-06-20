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
  { value: 'WhatsApp', label: 'WhatsApp', placeholder: 'https://wa.me/628123456789' },
  { value: 'GitHub', label: 'GitHub', placeholder: 'https://github.com/your-company' },
  { value: 'LinkedIn', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/your-company' },
  { value: 'Instagram', label: 'Instagram', placeholder: 'https://instagram.com/your-company' },
  { value: 'Facebook', label: 'Facebook', placeholder: 'https://facebook.com/your-company' },
  { value: 'Twitter', label: 'Twitter', placeholder: 'https://twitter.com/your-company' },
  { value: 'YouTube', label: 'YouTube', placeholder: 'https://youtube.com/@your-company' },
  { value: 'TikTok', label: 'TikTok', placeholder: 'https://tiktok.com/@your-company' },
  { value: 'Email', label: 'Email', placeholder: 'mailto:contact@your-company.com' },
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

  // Get placeholder based on selected platform
  const selectedPlatform = form.watch('name')
  const getCurrentPlaceholder = () => {
    const option = socialMediaOptions.find(opt => opt.value === selectedPlatform)
    return option?.placeholder || 'https://example.com/your-profile'
  }

  // Get URL format helper text based on selected platform
  const getUrlFormatHelper = () => {
    switch (selectedPlatform) {
      case 'WhatsApp':
        return 'Use format: https://wa.me/[country_code][phone_number] (e.g., https://wa.me/628123456789)'
      case 'Email':
        return 'Use format: mailto:[email] (e.g., mailto:contact@company.com)'
      case 'GitHub':
        return 'Use format: https://github.com/[username] or https://github.com/[organization]'
      case 'LinkedIn':
        return 'Use format: https://linkedin.com/in/[profile] or https://linkedin.com/company/[company]'
      case 'Instagram':
        return 'Use format: https://instagram.com/[username]'
      case 'Facebook':
        return 'Use format: https://facebook.com/[page] or https://facebook.com/[profile]'
      case 'Twitter':
        return 'Use format: https://twitter.com/[username] or https://x.com/[username]'
      case 'YouTube':
        return 'Use format: https://youtube.com/@[channel] or https://youtube.com/c/[channel]'
      case 'TikTok':
        return 'Use format: https://tiktok.com/@[username]'
      default:
        return 'Enter the full URL to your social media profile or page.'
    }
  }

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
                    placeholder={getCurrentPlaceholder()}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {getUrlFormatHelper()}
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
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 space-y-0">
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

          {/* Preview section */}
          {selectedPlatform && form.watch('url') && (
            <div className="p-4 bg-muted rounded-lg">
              <FormLabel className="text-sm font-medium">Preview</FormLabel>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Platform:</span>
                <span className="text-sm font-medium">{selectedPlatform}</span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">URL:</span>
                <span className="text-sm font-mono break-all">{form.watch('url')}</span>
              </div>
            </div>
          )}

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