// components/technologies/technology-form.tsx
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
import { Loader2 } from "lucide-react"
import { Technology } from "./types/technology"
import { technologyAPI } from "@/lib/api/technology"

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  icon: z.string().optional(),
  description: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

interface TechnologyFormProps {
  technology?: Technology
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function TechnologyForm({ technology, open, onOpenChange, onSuccess }: TechnologyFormProps) {
  const [loading, setLoading] = useState(false)
  const isEdit = !!technology

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      icon: "",
      description: "",
    },
  })

  useEffect(() => {
    if (technology) {
      form.reset({
        name: technology.name,
        icon: technology.icon || "",
        description: technology.description || "",
      })
    } else {
      form.reset({
        name: "",
        icon: "",
        description: "",
      })
    }
  }, [technology, form])

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      if (isEdit && technology) {
        await technologyAPI.updateTechnology({
          id: technology.id,
          ...data,
        })
      } else {
        await technologyAPI.createTechnology(data)
      }
      
      onSuccess()
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Failed to save technology:", error)
      toast.error("Failed to save technology")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Technology" : "Add New Technology"}
          </DialogTitle>
          <DialogDescription>
            {isEdit 
              ? "Update the technology information below." 
              : "Fill in the information below to add a new technology."
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
                      placeholder="e.g. React, TypeScript, Node.js" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. lucide icon name or URL" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description of the technology..."
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
                {isEdit ? "Update" : "Create"} Technology
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog> 
  )
}