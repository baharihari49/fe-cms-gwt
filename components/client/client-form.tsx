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
import SimpleFileUpload from "../SimpleFileUpload"

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
        image: data.image || "", // Ensure image is always a string
      }

      if (isEdit && client) {
        await clientAPI.updateClient({
          id: client.id,
          ...submitData,
        })
        toast.success("Client updated successfully")
      } else {
        await clientAPI.createClient(submitData)
        toast.success("Client created successfully")
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

  const watchedImage = form.watch("image")
  const watchedName = form.watch("name")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">


            {/* Logo Upload */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Logo</FormLabel>
                  <FormControl>
                    <SimpleFileUpload
                      value={field.value}
                      onChange={field.onChange}
                      previewType="logo"
                      previewName={watchedName}
                      accept="image/*"
                      maxSize="10MB"
                      helpText="Upload company logo - JPG, PNG, or SVG (max 10MB)"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name *</FormLabel>
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
            </div>

            {/* Active Status */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-gray-50">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-medium">
                      Active Status
                    </FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Enable this client to show in active listings and portfolio
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

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
                className="min-w-[80px]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="min-w-[120px]"
              >
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