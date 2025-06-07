// components/blog/tags/constants/tag-constants.ts

// Default tag values
export const DEFAULT_TAG_VALUES = {
  name: "",
} as const

// Validation constants
export const TAG_VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  SLUG_MAX_LENGTH: 60,
} as const

// Table pagination options
export const TAG_TABLE_OPTIONS = {
  PAGE_SIZE_OPTIONS: [10, 20, 30, 40, 50],
  DEFAULT_PAGE_SIZE: 20,
} as const

// Popular tags threshold
export const POPULAR_TAG_THRESHOLD = 5

// Error messages
export const TAG_ERROR_MESSAGES = {
  FETCH_FAILED: "Failed to fetch tags",
  CREATE_FAILED: "Failed to create tag",
  UPDATE_FAILED: "Failed to update tag",
  DELETE_FAILED: "Failed to delete tag",
  NAME_REQUIRED: "Tag name is required",
  NAME_TOO_SHORT: `Tag name must be at least ${TAG_VALIDATION.NAME_MIN_LENGTH} characters`,
  NAME_TOO_LONG: `Tag name must be less than ${TAG_VALIDATION.NAME_MAX_LENGTH} characters`,
  NAME_DUPLICATE: "A tag with this name already exists",
} as const

// Success messages
export const TAG_SUCCESS_MESSAGES = {
  CREATED: "Tag created successfully",
  UPDATED: "Tag updated successfully",
  DELETED: "Tag deleted successfully",
  COPIED: "Copied to clipboard",
} as const

// Tag colors for different display contexts
export const TAG_COLORS = {
  DEFAULT: "bg-primary/10 text-primary border-primary/20",
  POPULAR: "bg-green-100 text-green-800 border-green-200",
  UNUSED: "bg-gray-100 text-gray-600 border-gray-200",
  NEW: "bg-blue-100 text-blue-800 border-blue-200",
} as const