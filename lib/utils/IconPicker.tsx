// lib/utils/IconPicker.tsx
'use client'

import React, { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { LucideIcon } from 'lucide-react'

// Import all icons dynamically
import * as LucideIcons from 'lucide-react'

interface IconPickerProps {
  value: string
  onValueChange: (name: string) => void
}

export default function IconPicker({ value, onValueChange }: IconPickerProps) {
  const [search, setSearch] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)

  // Get all available Lucide icons
  const allIcons = useMemo(() => {
    const icons: Array<{ name: string; component: LucideIcon }> = []
    
    // Get all keys from LucideIcons
    const allKeys = Object.keys(LucideIcons)
    const keysToUse = allKeys.slice(0, 1790)
    
    // Map through these keys and get the components
    keysToUse.forEach((keyName, index) => {
      const iconComponent = LucideIcons[keyName as keyof typeof LucideIcons]
      
      
      // Skip utility functions
      if (
        keyName === 'createLucideIcon' ||
        keyName === 'createElement' ||
        keyName === 'default'
      ) {
        // console.log(`Skipping utility: ${keyName}`)
        return
      }
      
      // Add the icon
      icons.push({
        name: keyName,
        component: iconComponent as LucideIcon
      })
      
      // console.log(`Added icon: ${keyName}`)
    })
    
    // console.log(`Total icons processed: ${icons.length}`)
    
    // Sort icons alphabetically
    return icons.sort((a, b) => a.name.localeCompare(b.name))
  }, [])

  const filteredIcons = useMemo(() => {
    if (!search.trim()) {
      // Tampilkan hanya 100 icon pertama saat tidak ada search untuk performance
      return allIcons.slice(0, 100)
    }
    const term = search.trim().toLowerCase()
    const filtered = allIcons.filter(({ name }) => 
      name.toLowerCase().includes(term)
    )
    // Batasi hasil search ke 50 untuk performance
    return filtered.slice(0, 50)
  }, [search, allIcons])

  // Get the selected icon component
  const selectedIcon = allIcons.find(icon => icon.name === value)
  const SelectedIcon = selectedIcon?.component

  const handleIconSelect = (iconName: string) => {
    onValueChange(iconName)
    setIsOpen(false)
  }

  const clearSearch = () => {
    setSearch('')
  }

  // Debug: log available icons count
  React.useEffect(() => {
    console.log(`Total icons loaded: ${allIcons.length}`)
    if (allIcons.length > 0) {
      console.log('First few icons:', allIcons.slice(0, 5).map(i => i.name))
    }
  }, [allIcons])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <div className="flex items-center gap-2">
            {SelectedIcon && <SelectedIcon className="h-4 w-4" />}
            <span className="truncate">{value || 'Select icon...'}</span>
          </div>
          <Search className="h-4 w-4 opacity-50 flex-shrink-0" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="start">
        {/* Search bar */}
        <div className="p-3 border-b flex items-center gap-2">
          <Search className="h-4 w-4 flex-shrink-0" />
          <Input
            autoFocus
            placeholder="Search icons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          {search && (
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={clearSearch}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Icon grid */}
        <ScrollArea className="h-64" scrollHideDelay={0}>
          {allIcons.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Loading icons...
            </div>
          ) : (
            <div className="grid grid-cols-6 gap-1 p-2">
              {filteredIcons.map(({ name, component: IconComponent }) => (
                <Button
                  key={name}
                  variant={value === name ? 'default' : 'ghost'}
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-accent transition-colors"
                  onClick={() => handleIconSelect(name)}
                  title={name}
                >
                  <IconComponent className="h-3 w-3" />
                </Button>
              ))}
              {filteredIcons.length === 0 && search && (
                <div className="col-span-6 text-center py-8 text-sm text-muted-foreground">
                  No icons found for "{search}"
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Footer info */}
        <div className="p-2 border-t text-xs text-muted-foreground text-center">
          {filteredIcons.length} of {allIcons.length} icons
          {!search && filteredIcons.length < allIcons.length && (
            <span className=" text-blue-600"> • Search to see more</span>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}