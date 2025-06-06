"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { ArrowLeft, Save, Eye, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { FormEdit } from "@/components/blog/form-edit"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { blogAPI } from "@/lib/api/blog"
import { UpdatePostRequest, BlogPost, Category, Tag } from "@/components/blog/types/blog"

const postFormSchema = z.object({
  id: z.string().min(1, "ID is required"),
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  excerpt: z.string().min(1, "Excerpt is required").max(500, "Excerpt must be less than 500 characters"),
  content: z.string().min(1, "Content is required"),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  categoryId: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional(),
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

interface EditPostPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [initialLoading, setInitialLoading] = React.useState(true)
  const [categories, setCategories] = React.useState<Category[]>([])
  const [tags, setTags] = React.useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = React.useState<string[]>([])
  const [tagSearch, setTagSearch] = React.useState("")
  const [post, setPost] = React.useState<BlogPost | null>(null)
  const [postId, setPostId] = React.useState<string>("")

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      id: "",
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

  // Resolve params and set postId
  React.useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params
      setPostId(resolvedParams.id)
    }
    resolveParams()
  }, [params])

  // Fetch post data and other data
  React.useEffect(() => {
    const fetchData = async () => {
      if (!postId) return
      
      try {
        setInitialLoading(true)
        const [postRes, categoriesRes, tagsRes] = await Promise.all([
          blogAPI.getPost(postId),
          blogAPI.getCategories(),
          blogAPI.getTags(),
        ])

        if (postRes.success && postRes.post) {
          const postData = postRes.post
          setPost(postData)

          // Set form values
          form.reset({
            title: postData.title,
            excerpt: postData.excerpt,
            content: postData.content,
            image: postData.image || "",
            featured: postData.featured,
            published: postData.published,
            categoryId: postData.categoryId,
            readTime: postData.readTime,
            authorId: postData.authorId,
          })

          // Set selected tags
          const tagIds = postData.tags.map(t => t.tagId)
          setSelectedTags(tagIds)
          form.setValue("tags", tagIds)
        }

        if (categoriesRes.success) {
          setCategories(categoriesRes.categories)
        }
        if (tagsRes.success) {
          setTags(tagsRes.tags)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load post data")
        router.push("/blog/posts")
      } finally {
        setInitialLoading(false)
      }
    }

    fetchData()
  }, [postId, form, router])

  const handleSubmit = async (values: PostFormValues) => {
    try {
      setLoading(true)
      const { id, ...restValues } = values
      const updateData: UpdatePostRequest = {
        id: postId,
        ...restValues,
        tags: selectedTags,
      }

      await blogAPI.updatePost(updateData)
      toast.success("Post updated successfully!")
      router.push("/blog/posts")
    } catch (error) {
      toast.error("Failed to update post")
      console.error("Error updating post:", error)
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

  const handleDelete = async () => {
    try {
      setLoading(true)
      await blogAPI.deletePost(postId)
      toast.success("Post deleted successfully!")
      router.push("/blog/posts")
    } catch (error) {
      toast.error("Failed to delete post")
      console.error("Error deleting post:", error)
    } finally {
      setLoading(false)
    }
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

  if (initialLoading || !postId) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading post...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Post not found</h1>
          <p className="text-muted-foreground mt-2">The post you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push("/blog/posts")} className="mt-4">
            Back to Posts
          </Button>
        </div>
      </div>
    )
  }

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
            <h1 className="text-2xl font-bold tracking-tight">Edit Post</h1>
            <p className="text-muted-foreground">Update your blog post</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the post
                  &quot;{post.title}&quot; and remove all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete Post
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

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
            {loading ? "Updating..." : post.published ? "Update & Publish" : "Publish"}
          </Button>
        </div>
      </div>
      <FormEdit
        form={form}
        onSubmit={handleSubmit}
        categories={categories}
        tags={tags}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        tagSearch={tagSearch}
        setTagSearch={setTagSearch}
        mockAuthors={mockAuthors}
        post={post}
      />
    </div>
  )
}