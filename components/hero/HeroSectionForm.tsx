// components/hero/HeroSectionForm.tsx
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
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { heroAPI } from '@/lib/api/hero'
import { HeroSection, CreateHeroSectionRequest, UpdateHeroSectionRequest } from '@/components/hero/types/hero'

const formSchema = z.object({
  welcomeText: z
    .string()
    .min(2, 'Welcome text must be at least 2 characters long')
    .max(100, 'Welcome text must not exceed 100 characters'),
  mainTitle: z
    .string()
    .min(2, 'Main title must be at least 2 characters long')
    .max(100, 'Main title must not exceed 100 characters'),
  highlightText: z
    .string()
    .min(2, 'Highlight text must be at least 2 characters long')
    .max(100, 'Highlight text must not exceed 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters long')
    .max(1000, 'Description must not exceed 1000 characters'),
  logo: z
    .string()
    .url('Logo must be a valid URL')
    .optional()
    .or(z.literal('')),
  image: z
    .string()
    .url('Image must be a valid URL')
    .optional()
    .or(z.literal('')),
  altText: z
    .string()
    .max(200, 'Alt text must not exceed 200 characters')
    .optional()
    .or(z.literal('')),
  isActive: z.boolean(),
})

type FormData = z.infer<typeof formSchema>

interface HeroSectionFormProps {
  heroSection?: HeroSection
  onSuccess?: () => void
  onCancel?: () => void
}

export function HeroSectionForm({ heroSection, onSuccess, onCancel }: HeroSectionFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      welcomeText: heroSection?.welcomeText || 'Welcome to GWT',
      mainTitle: heroSection?.mainTitle || 'Growth With',
      highlightText: heroSection?.highlightText || 'Technology',
      description: heroSection?.description || '',
      logo: heroSection?.logo || '',
      image: heroSection?.image || '',
      altText: heroSection?.altText || '',
      isActive: heroSection?.isActive ?? true,
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      // Convert empty strings to undefined for optional fields
      const processedData: CreateHeroSectionRequest = {
        welcomeText: data.welcomeText,
        mainTitle: data.mainTitle,
        highlightText: data.highlightText,
        description: data.description,
        logo: data.logo || undefined,
        image: data.image || undefined,
        altText: data.altText || undefined,
        isActive: data.isActive,
      }

      if (heroSection) {
        // Update existing hero section
        const updateData: UpdateHeroSectionRequest = {
          id: heroSection.id,
          ...processedData,
        }
        await heroAPI.updateHeroSection(updateData)
        toast.success('Hero section updated successfully')
      } else {
        // Create new hero section
        await heroAPI.createHeroSection(processedData)
        toast.success('Hero section created successfully')
      }

      onSuccess?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="welcomeText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Welcome Text</FormLabel>
                <FormControl>
                  <Input placeholder="Welcome to GWT" {...field} />
                </FormControl>
                <FormDescription>
                  The welcome message displayed above the main title.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="mainTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Growth With" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="highlightText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Highlight Text</FormLabel>
                  <FormControl>
                    <Input placeholder="Technology" {...field} />
                  </FormControl>
                  <FormDescription>
                    The highlighted part of the title.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="We empower businesses to thrive in the digital era..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  A detailed description of your company or services.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/logo.png" {...field} />
                  </FormControl>
                  <FormDescription>
                    URL to your company logo (optional).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/hero-image.jpg" {...field} />
                  </FormControl>
                  <FormDescription>
                    URL to the main hero image (optional).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="altText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image Alt Text</FormLabel>
                <FormControl>
                  <Input placeholder="GWT Team working together" {...field} />
                </FormControl>
                <FormDescription>
                  Alternative text for the hero image (for accessibility).
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
                    Set this hero section as active. Only one hero section can be active at a time.
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
              {isLoading ? 'Saving...' : heroSection ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}