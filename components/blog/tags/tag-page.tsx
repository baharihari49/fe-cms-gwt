"use client"

import { useState } from "react"
import { useTags } from "@/hooks/use-tags"
import { TagDataTable } from "@/components/blog/tags/tag-data-table"
import { createTagColumns } from "@/components/blog/tags/columns"
import { TagFormDialog } from "@/components/blog/tags/tag-form-dialog"
import { DeleteTagDialog } from "@/components/blog/tags/delete-tag-dialog"
import { Tag, CreateTagRequest, UpdateTagRequest } from "@/components/blog/tags/types/tags"

export default function CustomTagsPage() {
  const {
    tags,
    loading,
    actionLoading,
    createTag,
    updateTag,
    deleteTag,
  } = useTags()

  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null)

  // Handle form submission
  const handleFormSubmit = async (data: CreateTagRequest | UpdateTagRequest) => {
    if (selectedTag) {
      await updateTag(selectedTag.id, data)
    } else {
      await createTag(data as CreateTagRequest)
    }
  }

  // Handle edit tag
  const handleEditTag = (tag: Tag) => {
    setSelectedTag(tag)
    setFormDialogOpen(true)
  }

  // Handle delete tag click
  const handleDeleteTagClick = (tag: Tag) => {
    setSelectedTag(tag)
    setDeleteDialogOpen(true)
  }

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (selectedTag) {
      await deleteTag(selectedTag.id)
    }
  }

  // Handle create new tag
  const handleCreateNew = () => {
    setSelectedTag(null)
    setFormDialogOpen(true)
  }

  // Create columns with actions
  const columns = createTagColumns({
    onEdit: handleEditTag,
    onDelete: handleDeleteTagClick,
  })

  return (
    <div className="container mx-auto p-4">
      <TagDataTable
        columns={columns}
        data={tags}
        loading={loading}
        onCreateNew={handleCreateNew}
      />

      <TagFormDialog
        open={formDialogOpen}
        onOpenChange={(open) => {
          setFormDialogOpen(open)
          if (!open) {
            setSelectedTag(null)
          }
        }}
        tag={selectedTag}
        onSubmit={handleFormSubmit}
        loading={actionLoading}
      />

      <DeleteTagDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open)
          if (!open) {
            setSelectedTag(null)
          }
        }}
        tag={selectedTag}
        onConfirm={handleDeleteConfirm}
        loading={actionLoading}
      />
    </div>
  )
}