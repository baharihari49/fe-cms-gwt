// components/authors/author-form.tsx
"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2 } from "lucide-react"
import { Author } from "./types/author"
import { authorAPI } from "@/lib/api/author"

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  bio: z.string().optional(),
  avatar: z.string().url("Invalid URL format").optional().or(z.literal("")),
})

type FormData = z.infer<typeof formSchema>

interface AuthorFormProps {
  author?: Author
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AuthorForm({ author, open, onOpenChange, onSuccess }: AuthorFormProps) {
  const [loading, setLoading] = useState(false)
  const isEdit = !!author

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      avatar: "",
    },
  })

  useEffect(() => {
    if (author) {
      form.reset({
        name: author.name,
        email: author.email,
        bio: author.bio || "",
        avatar: author.avatar || "",
      })
    } else {
      form.reset({
        name: "",
        email: "",
        bio: "",
        avatar: "",
      })
    }
  }, [author, form])

  const watchedAvatar = form.watch("avatar")
  const watchedName = form.watch("name")

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      if (isEdit && author) {
        await authorAPI.updateAuthor({
          id: author.id,
          ...data,
        })
      } else {
        await authorAPI.createAuthor(data)
      }
      
      onSuccess()
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Failed to save author:", error)
      toast.error("Failed to save author")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Author" : "Add New Author"}
          </DialogTitle>
          <DialogDescription>
            {isEdit 
              ? "Update the author information below." 
              : "Fill in the information below to add a new author."
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. John Doe" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="e.g. john.doe@example.com" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar URL</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input 
                        placeholder="https://example.com/avatar.jpg" 
                        {...field} 
                      />
                      {(watchedAvatar || watchedName) && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">Preview:</span>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={watchedAvatar} alt={watchedName} />
                            <AvatarFallback>
                              {watchedName.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief biography of the author..."
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? "Update" : "Create"} Author
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog> 
  )
}