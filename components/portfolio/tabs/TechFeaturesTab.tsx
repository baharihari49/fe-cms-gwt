// components/projects/tabs/TechFeaturesTab.tsx
"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X } from "lucide-react"

interface TechFeaturesTabProps {
  currentTechnologies: string[]
  currentFeatures: string[]
  onTechnologiesChange: (technologies: string[]) => void
  onFeaturesChange: (features: string[]) => void
}

export function TechFeaturesTab({ 
  currentTechnologies, 
  currentFeatures, 
  onTechnologiesChange, 
  onFeaturesChange 
}: TechFeaturesTabProps) {
  const [techInput, setTechInput] = useState("")
  const [featureInput, setFeatureInput] = useState("")

  const addTechnology = () => {
    if (techInput.trim() && !currentTechnologies.includes(techInput.trim())) {
      onTechnologiesChange([...currentTechnologies, techInput.trim()])
      setTechInput("")
    }
  }

  const removeTechnology = (tech: string) => {
    onTechnologiesChange(currentTechnologies.filter(t => t !== tech))
  }

  const addFeature = () => {
    if (featureInput.trim() && !currentFeatures.includes(featureInput.trim())) {
      onFeaturesChange([...currentFeatures, featureInput.trim()])
      setFeatureInput("")
    }
  }

  const removeFeature = (feature: string) => {
    onFeaturesChange(currentFeatures.filter(f => f !== feature))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Technologies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Technologies</span>
            <Badge variant="secondary">{currentTechnologies.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add technology (e.g., React, Node.js)"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addTechnology()
                }
              }}
            />
            <Button type="button" onClick={addTechnology} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[100px] max-h-[200px] overflow-y-auto">
            {currentTechnologies.map((tech, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {tech}
                <button
                  type="button"
                  onClick={() => removeTechnology(tech)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {currentTechnologies.length === 0 && (
              <p className="text-muted-foreground text-sm">No technologies added yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Key Features</span>
            <Badge variant="outline">{currentFeatures.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add feature (e.g., Real-time chat)"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addFeature()
                }
              }}
            />
            <Button type="button" onClick={addFeature} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[100px] max-h-[200px] overflow-y-auto">
            {currentFeatures.map((feature, index) => (
              <Badge key={index} variant="outline" className="gap-1">
                {feature}
                <button
                  type="button"
                  onClick={() => removeFeature(feature)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {currentFeatures.length === 0 && (
              <p className="text-muted-foreground text-sm">No features added yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}