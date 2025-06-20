// components/contacts/contacts-table.tsx
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
import { ContactForm } from "./contact-form"
import { ContactViewDialog } from "./contact-view-dialog"
import { createColumns } from "./columns"
import { Plus, Trash2, RefreshCw, Phone } from "lucide-react"
import { Contact } from "./types/contact"
import { contactAPI } from "@/lib/api/contact"

export function ContactsTable() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>()
  const [viewContact, setViewContact] = useState<Contact | null>(null)
  const [deleteContact, setDeleteContact] = useState<Contact | null>(null)
  const [selectedRows, setSelectedRows] = useState<Contact[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showView, setShowView] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false)

  // Load contacts
  const loadContacts = async () => {
    setLoading(true)
    try {
      const response = await contactAPI.getContacts()
      if (response.success && response.data) {
        setContacts(response.data)
      } else {
        setContacts([])
      }
    } catch (error) {
      console.error("Failed to load contacts:", error)
      toast.error("Failed to load contacts")
      setContacts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContacts()
  }, [])

  // Handlers
  const handleCreate = () => {
    setSelectedContact(undefined)
    setShowForm(true)
  }

  const handleEdit = (contact: Contact) => {
    setSelectedContact(contact)
    setShowForm(true)
  }

  const handleView = (contact: Contact) => {
    setViewContact(contact)
    setShowView(true)
  }

  const handleDelete = (contact: Contact) => {
    setDeleteContact(contact)
    setShowDeleteDialog(true)
  }

  const handleBulkDelete = () => {
    if (selectedRows.length > 0) {
      setShowBulkDeleteDialog(true)
    }
  }

  const confirmDelete = async () => {
    if (!deleteContact) return

    try {
      await contactAPI.deleteContact(deleteContact.id)
      toast.success("Contact deleted successfully")
      loadContacts()
    } catch (error) {
      console.error("Failed to delete contact:", error)
      toast.error("Failed to delete contact")
    } finally {
      setShowDeleteDialog(false)
      setDeleteContact(null)
    }
  }

  const confirmBulkDelete = async () => {
    try {
      await Promise.all(
        selectedRows.map(contact => contactAPI.deleteContact(contact.id))
      )
      toast.success(`${selectedRows.length} contacts deleted successfully`)
      loadContacts()
      setSelectedRows([])
    } catch (error) {
      console.error("Failed to delete contacts:", error)
      toast.error("Failed to delete contacts")
    } finally {
      setShowBulkDeleteDialog(false)
    }
  }

  const handleFormSuccess = () => {
    loadContacts()
    toast.success(selectedContact ? "Contact updated successfully" : "Contact created successfully")
  }

  const columns = createColumns(handleEdit, handleDelete, handleView)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contacts
              </CardTitle>
              <CardDescription>
                Manage your contact information and details
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
              <Button variant="outline" size="sm" onClick={loadContacts}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={contacts || []}
            searchKey="title"
            searchPlaceholder="Search contacts..."
            loading={loading}
            onRowSelectionChange={setSelectedRows}
          />
        </CardContent>
      </Card>

      {/* Create/Edit Form Dialog */}
      <ContactForm
        contact={selectedContact}
        open={showForm}
        onOpenChange={setShowForm}
        onSuccess={handleFormSuccess}
      />

      {/* View Contact Dialog */}
      <ContactViewDialog
        contact={viewContact}
        open={showView}
        onOpenChange={setShowView}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the contact
              &quot;{deleteContact?.title}&quot; and remove all associated data.
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
            <AlertDialogTitle>Delete Multiple Contacts</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedRows.length} contacts? 
              This action cannot be undone and will permanently remove all selected contacts and their associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete {selectedRows.length} Contacts
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}