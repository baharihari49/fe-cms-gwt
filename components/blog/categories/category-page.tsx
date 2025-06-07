// components/blog/categories/category-page.tsx
"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { CategoryDataTable } from "./category-data-table"
import { createCategoryColumns } from "./columns"
import { CategoryFormDialog } from "./category-form-dialog"
import { DeleteCategoryDialog } from "./delete-category-dialog"
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from "./types/categories"
import { blogCategoryAPI } from "@/lib/api/blog-category"

export function CategoryPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [formDialogOpen, setFormDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [actionLoading, setActionLoading] = useState(false)

    // Fetch categories
    const fetchCategories = async () => {
        try {
            setLoading(true)
            const response = await blogCategoryAPI.getAllCategories()
            if (response.success) {
                setCategories(response.categories)
            }
        } catch (error) {
            toast.error("Failed to fetch categories")
            console.error("Error fetching categories:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    // Handle create category
    const handleCreateCategory = async (data: CreateCategoryRequest) => {
        try {
            setActionLoading(true)
            const response = await blogCategoryAPI.createCategory(data)
            if (response.success) {
                setCategories(prev => [...prev, response.category])
                toast.success("Category created successfully")
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to create category")
            throw error
        } finally {
            setActionLoading(false)
        }
    }

    // Handle update category
    const handleUpdateCategory = async (data: UpdateCategoryRequest) => {
        if (!selectedCategory) return

        try {
            setActionLoading(true)
            const response = await blogCategoryAPI.updateCategory(selectedCategory.id, data)
            if (response.success) {
                setCategories(prev =>
                    prev.map(cat =>
                        cat.id === selectedCategory.id ? response.category : cat
                    )
                )
                toast.success("Category updated successfully")
                setSelectedCategory(null)
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to update category")
            throw error
        } finally {
            setActionLoading(false)
        }
    }

    // Handle delete category
    const handleDeleteCategory = async () => {
        if (!selectedCategory) return

        try {
            setActionLoading(true)
            const response = await blogCategoryAPI.deleteCategory(selectedCategory.id)
            if (response.success) {
                setCategories(prev => prev.filter(cat => cat.id !== selectedCategory.id))
                toast.success("Category deleted successfully")
                setSelectedCategory(null)
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to delete category")
            throw error
        } finally {
            setActionLoading(false)
        }
    }

    // Handle form submission
    const handleFormSubmit = async (
        data: CreateCategoryRequest | UpdateCategoryRequest
    ) => {
        if (selectedCategory) {
            // data disini kita tahu pasti Update
            await handleUpdateCategory(data as UpdateCategoryRequest)
        } else {
            // data dijamin Create
            await handleCreateCategory(data as CreateCategoryRequest)
        }
    }


    // Handle edit category
    const handleEditCategory = (category: Category) => {
        setSelectedCategory(category)
        setFormDialogOpen(true)
    }

    // Handle delete category click
    const handleDeleteCategoryClick = (category: Category) => {
        setSelectedCategory(category)
        setDeleteDialogOpen(true)
    }

    // Handle create new category
    const handleCreateNew = () => {
        setSelectedCategory(null)
        setFormDialogOpen(true)
    }

    // Create columns with actions
    const columns = createCategoryColumns({
        onEdit: handleEditCategory,
        onDelete: handleDeleteCategoryClick,
    })

    return (
        <div className="container mx-auto p-4">
            <CategoryDataTable
                columns={columns}
                data={categories}
                loading={loading}
                onCreateNew={handleCreateNew}
            />

            <CategoryFormDialog
                open={formDialogOpen}
                onOpenChange={(open) => {
                    setFormDialogOpen(open)
                    if (!open) {
                        setSelectedCategory(null)
                    }
                }}
                category={selectedCategory}
                onSubmit={handleFormSubmit}
                loading={actionLoading}
            />

            <DeleteCategoryDialog
                open={deleteDialogOpen}
                onOpenChange={(open) => {
                    setDeleteDialogOpen(open)
                    if (!open) {
                        setSelectedCategory(null)
                    }
                }}
                category={selectedCategory}
                onConfirm={handleDeleteCategory}
                loading={actionLoading}
            />
        </div>
    )
}