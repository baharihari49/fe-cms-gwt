// components/contacts/types/contact.ts
export interface Contact {
  id: number;
  title: string;
  details: string[];
  color: string;
  href: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// API Request/Response types
export interface CreateContactRequest {
  title: string;
  details: string[];
  color: string;
  href?: string | null;
}

export interface UpdateContactRequest {
  id: number;
  title?: string;
  details?: string[];
  color?: string;
  href?: string | null;
}

// API Response types
export interface ContactResponse {
  success: boolean;
  message: string;
  data: Contact;
}

export interface ContactsResponse {
  success: boolean;
  data: Contact[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface DeleteContactResponse {
  success: boolean;
  message: string;
}