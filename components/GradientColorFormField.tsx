// components/ui/GradientColorFormField.tsx

import React from 'react'
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { gradientColorOptions, getGradientsByCategory, getAllCategories, type GradientColorOption } from '@/lib/config/gradientColors'

interface GradientColorFormFieldProps {
  // React Hook Form field props
  field: {
    value: string
    onChange: (value: string) => void
    onBlur: () => void
    name: string
  }
  
  // Customization props
  label?: string
  placeholder?: string
  description?: string
  showPreview?: boolean
  showCategories?: boolean
  categoryFilter?: string[]
  className?: string
  
  // Optional custom options
  customOptions?: GradientColorOption[]
}

export const GradientColorFormField: React.FC<GradientColorFormFieldProps> = ({
  field,
  label = "Gradient Color",
  placeholder = "Select a gradient color",
  description,
  showPreview = true,
  showCategories = false,
  categoryFilter,
  className = "",
  customOptions
}) => {
  // Determine which options to use
  const options = React.useMemo(() => {
    if (customOptions) return customOptions
    
    if (categoryFilter && categoryFilter.length > 0) {
      return gradientColorOptions.filter(option => 
        categoryFilter.includes(option.category)
      )
    }
    
    return gradientColorOptions
  }, [customOptions, categoryFilter])

  // Debug: Check for duplicates in development
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const seenValues = new Set<string>()
      const duplicates: string[] = []
      
      options.forEach(option => {
        if (seenValues.has(option.value)) {
          duplicates.push(option.value)
        } else {
          seenValues.add(option.value)
        }
      })
      
      if (duplicates.length > 0) {
        console.warn('Duplicate gradient values detected:', duplicates)
      }
    }
  }, [options])

  // Group options by category if showCategories is true
  const groupedOptions = React.useMemo(() => {
    if (!showCategories) return { 'All': options }
    
    const groups: Record<string, GradientColorOption[]> = {}
    options.forEach(option => {
      if (!groups[option.category]) {
        groups[option.category] = []
      }
      groups[option.category].push(option)
    })
    return groups
  }, [options, showCategories])

  const selectedOption = options.find(option => option.value === field.value)

  return (
    <FormItem className={className}>
      <FormLabel>{label}</FormLabel>
      <Select onValueChange={field.onChange} value={field.value}>
        <FormControl>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder={placeholder}>
              {selectedOption && (
                <div className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded ${selectedOption.value}`} />
                  <span>{selectedOption.label}</span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
        </FormControl>
        <SelectContent className="max-h-[400px]">
          {showCategories ? (
            // Grouped by categories
            Object.entries(groupedOptions).map(([category, categoryOptions]) => (
              <div key={category}>
                {category !== 'All' && (
                  <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground bg-muted/50 sticky top-0">
                    {category}
                  </div>
                )}
                {categoryOptions.map((option, index) => (
                  <SelectItem key={`${category}-${option.id}-${index}`} value={option.value}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded ${option.value} border`} />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </div>
            ))
          ) : (
            // Flat list
            options.map((option, index) => (
              <SelectItem key={`${option.id}-${index}`} value={option.value}>
                <div className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded ${option.value} border`} />
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      
      {/* Preview */}
      {showPreview && field.value && (
        <div className="mt-2 space-y-2">
          <div className={`w-full h-8 rounded-lg ${field.value} border`} />
          {selectedOption && (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="font-mono text-xs">
                {selectedOption.category}
              </Badge>
              <Badge variant="outline" className="font-mono text-xs">
                {selectedOption.label}
              </Badge>
            </div>
          )}
        </div>
      )}
      
      {/* Description */}
      {description && <FormDescription>{description}</FormDescription>}
      {!description && (
        <FormDescription>
          Choose from {options.length} beautiful gradient combinations
        </FormDescription>
      )}
      
      <FormMessage />
    </FormItem>
  )
}

// Simplified version without categories
export const SimpleGradientColorFormField: React.FC<Omit<GradientColorFormFieldProps, 'showCategories'>> = (props) => {
  return <GradientColorFormField {...props} showCategories={false} />
}

// Category-based version
export const CategorizedGradientColorFormField: React.FC<Omit<GradientColorFormFieldProps, 'showCategories'>> = (props) => {
  return <GradientColorFormField {...props} showCategories={true} />
}

// Popular gradients only
export const PopularGradientColorFormField: React.FC<Omit<GradientColorFormFieldProps, 'customOptions'>> = (props) => {
  return <GradientColorFormField {...props} customOptions={gradientColorOptions.slice(0, 16)} />
}

export default GradientColorFormField