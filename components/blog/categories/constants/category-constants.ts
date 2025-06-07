// components/blog/categories/constants/category-constants.ts

// Available Lucide React icons for categories
export const CATEGORY_ICONS = [
  "Code", "Globe", "Smartphone", "TrendingUp", "Shield", "Cloud", 
  "Link", "Palette", "Database", "Brain", "Settings", "Zap",
  "Monitor", "Server", "Terminal", "Layers", "Package", "Tool",
  "Rocket", "Target", "Award", "BookOpen", "FileText", "Lightbulb",
  "Coffee", "Heart", "Star", "Users", "Camera", "Music",
  "Video", "Image", "Mic", "Headphones", "Gamepad2", "Puzzle",
  "Briefcase", "GraduationCap", "Home", "Car", "Plane", "Ship"
] as const

// Available gradient color combinations
export const CATEGORY_COLORS = [
  { name: "Blue to Cyan", value: "from-blue-500 to-cyan-400" },
  { name: "Green to Emerald", value: "from-green-500 to-emerald-400" },
  { name: "Purple to Pink", value: "from-purple-500 to-pink-400" },
  { name: "Red to Pink", value: "from-red-500 to-pink-400" },
  { name: "Orange to Red", value: "from-orange-500 to-red-400" },
  { name: "Yellow to Orange", value: "from-yellow-500 to-orange-400" },
  { name: "Sky to Blue", value: "from-sky-500 to-blue-400" },
  { name: "Indigo to Purple", value: "from-indigo-500 to-purple-400" },
  { name: "Violet to Purple", value: "from-violet-500 to-purple-400" },
  { name: "Pink to Rose", value: "from-pink-500 to-rose-400" },
  { name: "Teal to Cyan", value: "from-teal-500 to-cyan-400" },
  { name: "Lime to Green", value: "from-lime-500 to-green-400" },
  { name: "Amber to Yellow", value: "from-amber-500 to-yellow-400" },
  { name: "Rose to Pink", value: "from-rose-500 to-pink-400" },
  { name: "Slate to Gray", value: "from-slate-500 to-gray-400" },
] as const

// Default category values
export const DEFAULT_CATEGORY_VALUES = {
  name: "",
  description: "",
  icon: "Code",
  color: "from-blue-500 to-cyan-400",
} as const

// Validation constants
export const CATEGORY_VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MIN_LENGTH: 10,
  DESCRIPTION_MAX_LENGTH: 500,
  SLUG_MAX_LENGTH: 120,
} as const

// Table pagination options
export const CATEGORY_TABLE_OPTIONS = {
  PAGE_SIZE_OPTIONS: [10, 20, 30, 40, 50],
  DEFAULT_PAGE_SIZE: 20,
} as const

// Popular categories threshold
export const POPULAR_CATEGORY_THRESHOLD = 10

// Error messages
export const CATEGORY_ERROR_MESSAGES = {
  FETCH_FAILED: "Failed to fetch categories",
  CREATE_FAILED: "Failed to create category",
  UPDATE_FAILED: "Failed to update category",
  DELETE_FAILED: "Failed to delete category",
  NAME_REQUIRED: "Category name is required",
  NAME_TOO_SHORT: `Category name must be at least ${CATEGORY_VALIDATION.NAME_MIN_LENGTH} characters`,
  NAME_TOO_LONG: `Category name must be less than ${CATEGORY_VALIDATION.NAME_MAX_LENGTH} characters`,
  NAME_DUPLICATE: "A category with this name already exists",
  DESCRIPTION_REQUIRED: "Category description is required",
  DESCRIPTION_TOO_SHORT: `Category description must be at least ${CATEGORY_VALIDATION.DESCRIPTION_MIN_LENGTH} characters`,
  DESCRIPTION_TOO_LONG: `Category description must be less than ${CATEGORY_VALIDATION.DESCRIPTION_MAX_LENGTH} characters`,
  ICON_REQUIRED: "Category icon is required",
  COLOR_REQUIRED: "Category color is required",
} as const

// Success messages
export const CATEGORY_SUCCESS_MESSAGES = {
  CREATED: "Category created successfully",
  UPDATED: "Category updated successfully",
  DELETED: "Category deleted successfully",
  COPIED: "Copied to clipboard",
} as const