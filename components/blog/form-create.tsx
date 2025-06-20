// components/blog/form-create.tsx
"use client"

import * as React from "react"
import { UseFormReturn } from "react-hook-form"
import dynamic from 'next/dynamic'
import { TagSelector } from "./tags/tag-selector"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Category, Tag, CreatePostRequest } from "@/components/blog/types/blog"

// Dynamic import to avoid SSR issues
const AdvancedTextEditor = dynamic(() => import('@/components/ui/advanced-text-editor.tsx'), {
  ssr: false,
  loading: () => <div className="border rounded-md p-4 min-h-[200px] bg-muted animate-pulse" />
})

interface FormCreateProps {
  form: UseFormReturn<CreatePostRequest>
  onSubmit: (values: CreatePostRequest) => Promise<void>
  categories: Category[]
  tags: Tag[]
  selectedTags: string[]
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>
  tagSearch: string
  setTagSearch: React.Dispatch<React.SetStateAction<string>>
  mockAuthors: Array<{ id: string; name: string; email: string }>
}

export const FormCreate: React.FC<FormCreateProps> = ({
  form,
  onSubmit,
  categories,
  tags,
  selectedTags,
  setSelectedTags,
  tagSearch,
  setTagSearch,
  mockAuthors
}) => {
  // const addTag = (tagId: string) => {
  //   if (!selectedTags.includes(tagId)) {
  //     const newTags = [...selectedTags, tagId]
  //     setSelectedTags(newTags)
  //     form.setValue("tags", newTags)
  //   }
  //   setTagSearch("")
  // }

  // const removeTag = (tagId: string) => {
  //   const newTags = selectedTags.filter(id => id !== tagId)
  //   setSelectedTags(newTags)
  //   form.setValue("tags", newTags)
  // }

  // const filteredTags = tags.filter(tag =>
  //   tag.name.toLowerCase().includes(tagSearch.toLowerCase()) &&
  //   !selectedTags.includes(tag.id)
  // )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter post title..."
                          className="text-lg font-medium"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Excerpt */}
                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of the post..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A short summary that appears in post previews (max 500 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Advanced Content Editor */}
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <AdvancedTextEditor
                          content={field.value}
                          onChange={field.onChange}
                          placeholder="Start writing your blog post..."
                          className="min-h-[400px]"
                        />
                      </FormControl>
                      <FormDescription>
                        Use the rich text editor to format your content, add code blocks, images, and more
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <TagSelector
                  selectedTags={selectedTags}
                  onTagsChange={setSelectedTags}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Post Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Post Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Category */}
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Author */}
                <FormField
                  control={form.control}
                  name="authorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select an author" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockAuthors.map((author) => (
                            <SelectItem key={author.id} value={author.id}>
                              {author.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Read Time */}
                <FormField
                  control={form.control}
                  name="readTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Read Time</FormLabel>
                      <FormControl>
                        <Input placeholder="5 min read" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* SEO Title */}
                <FormField
                  control={form.control}
                  name="seoTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Optimized title for search engines..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Title that appears in search results (max 60 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* SEO Description */}
                <FormField
                  control={form.control}
                  name="seoDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Meta description for search engines..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Description that appears in search results (max 160 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter a URL for the featured image
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("image") && (
                  <div className="mt-4">
                    <img
                      src={form.watch("image")}
                      alt="Featured image preview"
                      className="w-full h-32 object-cover rounded-md"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Post Options */}
            <Card>
              <CardHeader>
                <CardTitle>Post Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Featured Post</FormLabel>
                        <FormDescription>
                          Mark this post as featured
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

                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Published</FormLabel>
                        <FormDescription>
                          Make this post visible to the public
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
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  )
}