// components/contacts/contact-form.tsx
"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
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
import { Loader2, Plus, X } from "lucide-react"
import { Contact } from "./types/contact"
import { contactAPI } from "@/lib/api/contact"
import GradientColorFormField from "../GradientColorFormField"

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  details: z.array(z.object({
    value: z.string().min(1, "Detail cannot be empty")
  })).min(1, "At least one detail is required"),
  color: z.string().min(1, "Color is required"),
  href: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

interface ContactFormProps {
  contact?: Contact
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function ContactForm({ contact, open, onOpenChange, onSuccess }: ContactFormProps) {
  const [loading, setLoading] = useState(false)
  const isEdit = !!contact

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      details: [{ value: "" }],
      color: "",
      href: "",
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "details"
  })

  useEffect(() => {
    if (contact) {
      form.reset({
        title: contact.title,
        details: contact.details.map(detail => ({ value: detail })),
        color: contact.color,
        href: contact.href || "",
      })
    } else {
      form.reset({
        title: "",
        details: [{ value: "" }],
        color: "",
        href: "",
      })
    }
  }, [contact, form])

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const submitData = {
        title: data.title,
        details: data.details.map(d => d.value),
        color: data.color,
        href: data.href || null,
      }

      if (isEdit && contact) {
        await contactAPI.updateContact({
          id: contact.id,
          ...submitData,
        })
      } else {
        await contactAPI.createContact(submitData)
      }

      onSuccess()
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Failed to save contact:", error)
      toast.error("Failed to save contact")
    } finally {
      setLoading(false)
    }
  }

  const addDetail = () => {
    append({ value: "" })
  }

  const removeDetail = (index: number) => {
    if (fields.length > 1) {
      remove(index)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Contact" : "Add New Contact"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the contact information below."
              : "Fill in the information below to add a new contact."
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Call Us, Email Us, Visit Us"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormLabel>Details *</FormLabel>
              {fields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`details.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Input
                            placeholder={`Detail ${index + 1}`}
                            {...field}
                          />
                        </FormControl>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeDetail(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addDetail}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Detail
              </Button>
            </div>

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <GradientColorFormField
                  field={field}
                  label="Gradient Color"
                  placeholder="Select a gradient color"
                  description="Choose from beautiful gradient combinations"
                  showPreview={false} // We'll show preview below
                  showCategories={true}
                />
              )}
            />

            <FormField
              control={form.control}
              name="href"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. tel:+1234567890, mailto:contact@example.com, https://maps.google.com/..."
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
                {isEdit ? "Update" : "Create"} Contact
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}