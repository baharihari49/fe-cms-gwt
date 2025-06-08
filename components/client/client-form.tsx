// components/clients/client-form.tsx
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
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"
import { Client } from "@/components/client/types/clients"
import { clientAPI } from "@/lib/api/client"

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  industry: z.string().min(1, "Industry is required").max(100, "Industry too long"),
  image: z.string().url("Invalid URL").optional().or(z.literal("")),
  isActive: z.boolean(),
})

type FormData = z.infer<typeof formSchema>

interface ClientFormProps {
  client?: Client
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function ClientForm({ client, open, onOpenChange, onSuccess }: ClientFormProps) {
  const [loading, setLoading] = useState(false)
  const isEdit = !!client

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      industry: "",
      image: "",
      isActive: true,
    },
  })

  useEffect(() => {
    if (client) {
      form.reset({
        name: client.name,
        industry: client.industry,
        image: client.image || "",
        isActive: client.isActive,
      })
    } else {
      form.reset({
        name: "",
        industry: "",
        image: "",
        isActive: true,
      })
    }
  }, [client, form])

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const submitData = {
        ...data,
        image: data.image || undefined, // Convert empty string to undefined
      }

      if (isEdit && client) {
        await clientAPI.updateClient({
          id: client.id,
          ...submitData,
        })
      } else {
        await clientAPI.createClient(submitData)
      }
      
      onSuccess()
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Failed to save client:", error)
      toast.error("Failed to save client")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Client" : "Add New Client"}
          </DialogTitle>
          <DialogDescription>
            {isEdit 
              ? "Update the client information below." 
              : "Fill in the information below to add a new client."
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
                      placeholder="e.g. Google, Microsoft, Apple" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Technology, Healthcare, Finance" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/logo.png" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Active Status
                    </FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Enable this client to show in active listings
                    </div>
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
                {isEdit ? "Update" : "Create"} Client
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}