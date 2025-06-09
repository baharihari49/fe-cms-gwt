// components/services/services-table.tsx
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
import { ServiceForm } from "./service-form"
import { ServiceViewDialog } from "./service-view-dialog"
import { createColumns } from "./columns"
import { Plus, Trash2, RefreshCw, Settings } from "lucide-react"
import { Service } from "@/components/services/types/services"
import { serviceAPI } from "@/lib/api/services"

export function ServicesTable() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState<Service | undefined>()
  const [viewService, setViewService] = useState<Service | null>(null)
  const [deleteService, setDeleteService] = useState<Service | null>(null)
  const [selectedRows, setSelectedRows] = useState<Service[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showView, setShowView] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false)

  // Load services
  const loadServices = async () => {
    setLoading(true)
    try {
      const response = await serviceAPI.getServices({
        include: 'technologies,features'
      })
      if (response.success && response.data) {
        setServices(response.data)
      } else {
        setServices([])
      }
    } catch (error) {
      console.error("Failed to load services:", error)
      toast.error("Failed to load services")
      setServices([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadServices()
  }, [])

  // Handlers
  const handleCreate = () => {
    setSelectedService(undefined)
    setShowForm(true)
  }

  const handleEdit = (service: Service) => {
    setSelectedService(service)
    setShowForm(true)
  }

  const handleView = (service: Service) => {
    setViewService(service)
    setShowView(true)
  }

  const handleDelete = (service: Service) => {
    setDeleteService(service)
    setShowDeleteDialog(true)
  }

  const handleBulkDelete = () => {
    if (selectedRows.length > 0) {
      setShowBulkDeleteDialog(true)
    }
  }

  const confirmDelete = async () => {
    if (!deleteService) return

    try {
      await serviceAPI.deleteService(deleteService.id)
      toast.success("Service deleted successfully")
      loadServices()
    } catch (error) {
      console.error("Failed to delete service:", error)
      toast.error("Failed to delete service")
    } finally {
      setShowDeleteDialog(false)
      setDeleteService(null)
    }
  }

  const confirmBulkDelete = async () => {
    try {
      await Promise.all(
        selectedRows.map(service => serviceAPI.deleteService(service.id))
      )
      toast.success(`${selectedRows.length} services deleted successfully`)
      loadServices()
      setSelectedRows([])
    } catch (error) {
      console.error("Failed to delete services:", error)
      toast.error("Failed to delete services")
    } finally {
      setShowBulkDeleteDialog(false)
    }
  }

  const handleFormSuccess = () => {
    loadServices()
    toast.success(selectedService ? "Service updated successfully" : "Service created successfully")
  }

  const columns = createColumns(handleEdit, handleDelete, handleView)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Services
              </CardTitle>
              <CardDescription>
                Manage your portfolio services and offerings
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
                  Delete {selectedRows.length} items
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={loadServices}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Add Service
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={services || []}
            searchKey="title"
            searchPlaceholder="Search services..."
            loading={loading}
            onRowSelectionChange={setSelectedRows}
          />
        </CardContent>
      </Card>

      {/* Create/Edit Form Dialog */}
      <ServiceForm
        service={selectedService}
        open={showForm}
        onOpenChange={setShowForm}
        onSuccess={handleFormSuccess}
      />

      {/* View Service Dialog */}
      <ServiceViewDialog
        service={viewService}
        open={showView}
        onOpenChange={setShowView}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the service
              &quot;{deleteService?.title}&quot; and remove all associated data including
              features and technology associations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
            <AlertDialogTitle>Delete Multiple Services</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedRows.length} services? 
              This action cannot be undone and will permanently remove all selected services and their associated data including features and technology associations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete {selectedRows.length} Services
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}