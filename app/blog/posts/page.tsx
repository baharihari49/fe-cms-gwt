// app/(dashboard)/blog/posts/page.tsx
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { EnhancedDataTable } from "@/components/blog/data-table"
import { createColumns } from "@/components/blog/columns"
import { blogAPI } from "@/lib/api/blog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  BlogPost,
  PostFilters,
} from "@/components/blog/types/blog"
import {PartialUpdatePostRequest} from "@/components/blog/types/blog"

export default function BlogPostsPage() {
  const router = useRouter()
  const [posts, setPosts] = React.useState<BlogPost[]>([])
  // const [categories, setCategories] = React.useState<Category[]>([])
  // const [tags, setTags] = React.useState<Tag[]>([])
  const [loading, setLoading] = React.useState(false)
  const [formLoading, setFormLoading] = React.useState(false)
  const [totalCount, setTotalCount] = React.useState(0)
  
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  
  const [filters, setFilters] = React.useState<PostFilters>({
    page: 1,
    limit: 10,
    orderBy: "publishedAt",
    order: "desc",
  })
  
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const [postToDelete, setPostToDelete] = React.useState<BlogPost | null>(null)

  const fetchPosts = React.useCallback(async () => {
    try {
      setLoading(true)
      const response = await blogAPI.getPosts(filters)
      setPosts(response.posts)
      setTotalCount(response.pagination.total)
    } catch {
      toast.error("Failed to fetch posts")
    } finally {
      setLoading(false)
    }
  }, [filters])

  const fetchCategories = React.useCallback(async () => {
    try {
      const response = await blogAPI.getCategories()
      if (response.success) {
        // setCategories(response.categories)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }, [])

  const fetchTags = React.useCallback(async () => {
    try {
      const response = await blogAPI.getTags()
      if (response.success) {
        // setTags(response.tags)
      }
    } catch (error) {
      console.error("Error fetching tags:", error)
    }
  }, [])

  React.useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  React.useEffect(() => {
    fetchCategories()
    fetchTags()
  }, [fetchCategories, fetchTags])

  const handlePaginationChange = React.useCallback(
    (newPagination: { pageIndex: number; pageSize: number }) => {
      setPagination(newPagination)
      setFilters(prev => ({
        ...prev,
        page: newPagination.pageIndex + 1,
        limit: newPagination.pageSize,
      }))
    },
    []
  )

  const handleGlobalFilterChange = React.useCallback((search: string) => {
    if (search) {
      const searchPosts = async () => {
        try {
          setLoading(true)
          const response = await blogAPI.searchPosts(search, {
            page: 1,
            limit: filters.limit,
          })
          setPosts(response.posts)
          setTotalCount(response.pagination.total)
          setPagination(prev => ({ ...prev, pageIndex: 0 }))
        } catch {
          toast.error("Failed to search posts")
        } finally {
          setLoading(false)
        }
      }
      searchPosts()
    } else {
      setFilters(prev => ({ ...prev, page: 1 }))
      setPagination(prev => ({ ...prev, pageIndex: 0 }))
    }
  }, [filters.limit])

  const handleCreateNew = React.useCallback(() => {
    router.push("/blog/posts/new")
  }, [router])

  const handleEdit = React.useCallback((post: BlogPost) => {
    router.push(`/blog/posts/${post.id}/edit`)
  }, [router])

  const handleDelete = React.useCallback((post: BlogPost) => {
    setPostToDelete(post)
    setShowDeleteDialog(true)
  }, [])

  const handleTogglePublish = React.useCallback(async (post: BlogPost) => {
  try {
    setFormLoading(true)
    await blogAPI.updatePost({
      id: post.id,
      published: !post.published,
    } as PartialUpdatePostRequest) // ← Gunakan interface yang tepat
    toast.success(`Post ${post.published ? 'unpublished' : 'published'} successfully`)
    fetchPosts()
  } catch{
    toast.error("Failed to update post status")
  } finally {
    setFormLoading(false)
  }
}, [fetchPosts])

  const confirmDelete = React.useCallback(async () => {
    if (!postToDelete) return

    try {
      setFormLoading(true)
      await blogAPI.deletePost(postToDelete.id)
      toast.success("Post deleted successfully")
      fetchPosts()
      setShowDeleteDialog(false)
      setPostToDelete(null)
    } catch {
      toast.error("Failed to delete post")
    } finally {
      setFormLoading(false)
    }
  }, [postToDelete, fetchPosts])

  const columns = React.useMemo(
    () =>
      createColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        onTogglePublish: handleTogglePublish,
      }),
    [handleEdit, handleDelete, handleTogglePublish]
  )

  return (
    <div className="container mx-auto p-4">
      <EnhancedDataTable
        columns={columns}
        data={posts}
        totalCount={totalCount}
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        onPaginationChange={handlePaginationChange}
        onGlobalFilterChange={handleGlobalFilterChange}
        onCreateNew={handleCreateNew}
        loading={loading}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the post
              &quot;{postToDelete?.title}&quot; and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={formLoading}
            >
              {formLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}