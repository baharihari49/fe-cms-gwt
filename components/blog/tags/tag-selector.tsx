// // Example: Using tags in a blog post form
// // components/blog/post-form.tsx
"use client"

import { useState } from "react"
import { useTags } from "@/hooks/use-tags"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X, Hash } from "lucide-react"

interface TagSelectorProps {
    selectedTags: string[]
    onTagsChange: (tags: string[]) => void
}

export function TagSelector({ selectedTags, onTagsChange }: TagSelectorProps) {
    const { tags, searchTags } = useTags()
    const [searchQuery, setSearchQuery] = useState("")
    const [showSuggestions, setShowSuggestions] = useState(false)

    const filteredTags = searchTags(searchQuery)
    const availableTags = filteredTags.filter(tag => !selectedTags.includes(tag.id))

    const addTag = (tagId: string) => {
        onTagsChange([...selectedTags, tagId])
        setSearchQuery("")
        setShowSuggestions(false)
    }

    const removeTag = (tagId: string) => {
        onTagsChange(selectedTags.filter(id => id !== tagId))
    }

    const selectedTagObjects = tags.filter(tag => selectedTags.includes(tag.id))

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
                {selectedTagObjects.map(tag => (
                    <Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
                        <Hash className="h-3 w-3" />
                        {tag.name}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => removeTag(tag.id)}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </Badge>
                ))}
            </div>

            <div className="relative">
                <Input
                    placeholder="Search and select tags..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setShowSuggestions(true)
                    }}
                    onFocus={() => setShowSuggestions(true)}
                />
                <p className="text-sm mt-2 text-gray-500">Search and click to add tags to your post</p>


                {showSuggestions && searchQuery && availableTags.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-40 overflow-y-auto">
                        {availableTags.slice(0, 10).map(tag => (
                            <button
                                key={tag.id}
                                className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                                onClick={() => addTag(tag.id)}
                            >
                                <Hash className="h-3 w-3 text-gray-400" />
                                {tag.name}
                                <span className="text-xs text-gray-500">
                                    ({tag._count?.posts || tag.postCount || 0} posts)
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}