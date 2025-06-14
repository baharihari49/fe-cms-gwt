// components/faq/faq-form.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import { FAQ } from "./types/faq"
import { faqAPI } from "@/lib/api/faq"
import { faqCategoryAPI } from "@/lib/api/faq-category"
import { FAQCategory } from "@/components/faq/category/types/faq-category"

const formSchema = z.object({
  category: z.string().min(1, "Category is required"),
  question: z.string().min(1, "Question is required").max(500, "Question too long"),
  answer: z.string().min(1, "Answer is required"),
  popular: z.boolean(),
})

type FormData = z.infer<typeof formSchema>

interface FAQFormProps {
  faq?: FAQ
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function FAQForm({ faq, open, onOpenChange, onSuccess }: FAQFormProps) {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<FAQCategory[]>([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const isEdit = !!faq

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      question: "",
      answer: "",
      popular: false,
    },
  })

  // Load categories from API
  const loadCategories = async () => {
    setLoadingCategories(true)
    try {
      const response = await faqCategoryAPI.getFAQCategories()
      if (response.success && response.data) {
        setCategories(response.data)
      } else {
        setCategories([])
        toast.error("Failed to load categories")
      }
    } catch (error) {
      console.error("Failed to load categories:", error)
      toast.error("Failed to load categories")
      setCategories([])
    } finally {
      setLoadingCategories(false)
    }
  }

  // Load categories when dialog opens
  useEffect(() => {
    if (open) {
      loadCategories()
    }
  }, [open])

  useEffect(() => {
    if (faq) {
      form.reset({
        category: faq.category,
        question: faq.question,
        answer: faq.answer,
        popular: faq.popular,
      })
    } else {
      form.reset({
        category: "",
        question: "",
        answer: "",
        popular: false,
      })
    }
  }, [faq, form])

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      if (isEdit && faq) {
        await faqAPI.updateFAQ({
          id: faq.id,
          ...data,
        })
      } else {
        await faqAPI.createFAQ(data)
      }
      
      onSuccess()
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Failed to save FAQ:", error)
      toast.error("Failed to save FAQ")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit FAQ" : "Add New FAQ"}
          </DialogTitle>
          <DialogDescription>
            {isEdit 
              ? "Update the FAQ information below." 
              : "Fill in the information below to add a new FAQ."
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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

            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter the frequently asked question" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter the answer to the question..."
                      rows={5}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="popular"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Mark as Popular
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Popular FAQs will be highlighted and shown first
                    </p>
                  </div>
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
                {isEdit ? "Update" : "Create"} FAQ
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog> 
  )
}