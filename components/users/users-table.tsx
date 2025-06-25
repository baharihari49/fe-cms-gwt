// components/users/users-table.tsx
"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { DataTable } from "@/components/ui/data-table"
import { UserForm } from "./user-form"
import { UserViewDialog } from "./user-view-dialog"
import { createColumns } from "./columns"
import { Plus, Trash2, RefreshCw } from "lucide-react"
import { User, UserFilters } from "@/components/users/types/user"
import { userAPI } from "@/lib/api/user"
import { useDebounce } from "@/hooks/useDebounce"

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | undefined>()
  const [viewUser, setViewUser] = useState<User | null>(null)
  const [deleteUser, setDeleteUser] = useState<User | null>(null)
  const [selectedRows, setSelectedRows] = useState<User[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showView, setShowView] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false)

  // Filters and pagination
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 10,
    search: '',
    role: '', // This will be handled as "all" in the UI
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  })

  // Debounce search to avoid excessive API calls
  const debouncedSearch = useDebounce(filters.search, 500)

  // Load users
  const loadUsers = async (newFilters?: Partial<UserFilters>) => {
    setLoading(true)
    try {
      const queryFilters = { ...filters, ...newFilters }
      // Ensure empty role is sent as empty string to backend
      if (queryFilters.role === 'all') {
        queryFilters.role = ''
      }
      
      const response = await userAPI.getUsers(queryFilters)
      
      if (response.success && response.data) {
        setUsers(response.data as User[])
        if (response.pagination) {
          setPagination(response.pagination)
        }
      } else {
        setUsers([])
      }
    } catch (error) {
      console.error("Failed to load users:", error)
      toast.error("Failed to load users")
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  // Load users when filters change (excluding search since DataTable handles it)
  useEffect(() => {
    loadUsers()
  }, [filters.role, filters.page, filters.limit, filters.sortBy, filters.sortOrder])

  // Handlers
  const handleCreate = () => {
    setSelectedUser(undefined)
    setShowForm(true)
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setShowForm(true)
  }

  const handleView = (user: User) => {
    setViewUser(user)
    setShowView(true)
  }

  const handleDelete = (user: User) => {
    setDeleteUser(user)
    setShowDeleteDialog(true)
  }

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      toast.error("Please select users to delete")
      return
    }
    setShowBulkDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!deleteUser) return
    
    try {
      await userAPI.deleteUser(deleteUser.id)
      toast.success("User deleted successfully")
      loadUsers()
      setShowDeleteDialog(false)
      setDeleteUser(null)
    } catch (error: any) {
      console.error("Failed to delete user:", error)
      toast.error(error.message || "Failed to delete user")
    }
  }

  const confirmBulkDelete = async () => {
    if (selectedRows.length === 0) return
    
    try {
      const ids = selectedRows.map(user => user.id)
      await userAPI.bulkDeleteUsers(ids)
      toast.success(`${selectedRows.length} user(s) deleted successfully`)
      loadUsers()
      setShowBulkDeleteDialog(false)
      setSelectedRows([])
    } catch (error: any) {
      console.error("Failed to bulk delete users:", error)
      toast.error(error.message || "Failed to delete users")
    }
  }

  const handleFormSuccess = () => {
    loadUsers()
    toast.success(selectedUser ? "User updated successfully" : "User created successfully")
  }

  // Handle search - will be handled by DataTable's internal search
  // No need for handleSearchChange since DataTable handles it internally

  // Handle role filter
  const handleRoleChange = (value: string) => {
    const roleValue = value === "all" ? "" : value;
    setFilters(prev => ({ ...prev, role: roleValue, page: 1 }))
  }

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }))
  }

  const handleLimitChange = (newLimit: number) => {
    setFilters(prev => ({ ...prev, limit: newLimit, page: 1 }))
  }

  const columns = createColumns(handleEdit, handleDelete, handleView)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Users Management</CardTitle>
              <CardDescription>
                Manage user accounts and permissions
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {selectedRows.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete {selectedRows.length} user(s)
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => loadUsers()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Data Table */}
          <DataTable
            columns={columns}
            data={users || []}
            searchKey="name"
            searchPlaceholder="Search users..."
            loading={loading}
            onRowSelectionChange={setSelectedRows}
          />

          {/* Custom Pagination */}
          {/* {pagination.total > 0 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                {pagination.total} result(s).
              </div>
              <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">Rows per page</p>
                  <Select
                    value={`${pagination.limit}`}
                    onValueChange={(value) => handleLimitChange(Number(value))}
                  >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue placeholder={pagination.limit} />
                    </SelectTrigger>
                    <SelectContent side="top">
                      {[10, 20, 30, 40, 50].map((pageSize) => (
                        <SelectItem key={pageSize} value={`${pageSize}`}>
                          {pageSize}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                  Page {pagination.page} of {pagination.totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => handlePageChange(1)}
                    disabled={!pagination.hasPrev}
                  >
                    <span className="sr-only">Go to first page</span>
                    ⟪
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrev}
                  >
                    <span className="sr-only">Go to previous page</span>
                    ⟨
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNext}
                  >
                    <span className="sr-only">Go to next page</span>
                    ⟩
                  </Button>
                  <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => handlePageChange(pagination.totalPages)}
                    disabled={!pagination.hasNext}
                  >
                    <span className="sr-only">Go to last page</span>
                    ⟫
                  </Button>
                </div>
              </div>
            </div>
          )} */}
        </CardContent>
      </Card>

      {/* Create/Edit Form Dialog */}
      <UserForm
        user={selectedUser}
        open={showForm}
        onOpenChange={setShowForm}
        onSuccess={handleFormSuccess}
      />

      {/* View User Dialog */}
      <UserViewDialog
        user={viewUser}
        open={showView}
        onOpenChange={setShowView}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              &quot;{deleteUser?.name}&quot; and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Multiple Users</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedRows.length} selected user(s)? 
              This action cannot be undone and will permanently remove all selected users and their associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete {selectedRows.length} User(s)
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}