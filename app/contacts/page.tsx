"use client"

import { ContactsTable } from "@/components/contacts/contacts-table"

export default function ContactsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Contacts</h2>
          <p className="text-muted-foreground">
            Manage your contact information and communication details.
          </p>
        </div>
      </div>
      
      <ContactsTable />
    </div>
  )
}