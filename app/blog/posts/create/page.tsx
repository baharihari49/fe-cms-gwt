// app/(dashboard)/blog/posts/create/page.tsx
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { ArrowLeft, Save, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FormCreate } from "../../../../components/blog/form-create"
import { blogAPI } from "@/lib/api/blog"
import { CreatePostRequest, Category, Tag } from "@/components/blog/types/blog"

const postFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  excerpt: z.string().min(1, "Excerpt is required").max(500, "Excerpt must be less than 500 characters"),
  content: z.string().min(1, "Content is required"),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  featured: z.boolean().optional(), // ← Tambahkan .optional()
  published: z.boolean().optional(), // ← Tambahkan .optional()
  categoryId: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional(), // ← Tambahkan .optional()
  readTime: z.string().min(1, "Read time is required"),
  authorId: z.string().min(1, "Author is required"),
})

type PostFormValues = z.infer<typeof postFormSchema>

// Mock authors data
const mockAuthors = [
  { id: "cmbhos12s0000wwo713vddath", name: "Bahari", email: "baharihari49@gmail.com" },
  { id: "2", name: "Jane Smith", email: "jane@example.com" },
  { id: "3", name: "Bob Johnson", email: "bob@example.com" },
]

export default function CreatePostPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [categories, setCategories] = React.useState<Category[]>([])
  const [tags, setTags] = React.useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = React.useState<string[]>([])
  const [tagSearch, setTagSearch] = React.useState("")

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      image: "",
      featured: false,
      published: false,
      categoryId: "",
      tags: [],
      readTime: "",
      authorId: "",
    },
  })

  // Fetch categories and tags
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          blogAPI.getCategories(),
          blogAPI.getTags(),
        ])

        if (categoriesRes.success) {
          setCategories(categoriesRes.categories)
        }
        if (tagsRes.success) {
          setTags(tagsRes.tags)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (values: PostFormValues) => {
    try {
      setLoading(true)
      const postData: CreatePostRequest = {
        ...values,
        tags: selectedTags,
      }

      await blogAPI.createPost(postData)
      toast.success("Post created successfully!")
      router.push("/blog/posts")
    } catch (error) {
      toast.error("Failed to create post")
      console.error("Error creating post:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAsDraft = async () => {
    const values = form.getValues()
    values.published = false
    await handleSubmit(values)
  }

  const handlePublish = async () => {
    const values = form.getValues()
    values.published = true
    await handleSubmit(values)
  }

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
    <div className="container mx-auto p-4 max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create New Post</h1>
            <p className="text-muted-foreground">Write and publish your blog post</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleSaveAsDraft}
            disabled={loading}
          >
            <Save className="h-4 w-4 mr-2" />
            Save as Draft
          </Button>
          <Button
            onClick={handlePublish}
            disabled={loading}
          >
            <Eye className="h-4 w-4 mr-2" />
            {loading ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>
      <FormCreate
        form={form}
        onSubmit={handleSubmit}
        categories={categories}
        tags={tags}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        tagSearch={tagSearch}
        setTagSearch={setTagSearch}
        mockAuthors={mockAuthors}
      />
    </div>
  )
}