// pages/admin/about-us/index.tsx or app/admin/about-us/page.tsx
'use client'

import React, { useState } from 'react'
import { Building2, Heart, Clock, BarChart3 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Import all components
import CompanyValuesList from '@/components/aboutUs/CompanyValuesList'
import CompanyValueForm from '@/components/aboutUs/CompanyValueForm'
import TimelineItemsList from '@/components/aboutUs/TimelineItemsList'
import TimelineItemForm from '@/components/aboutUs/TimelineItemForm'
import CompanyStatsList from '@/components/aboutUs/CompanyStatsList'
import CompanyStatForm from '@/components/aboutUs/CompanyStatForm'
import CompanyInfoList from '@/components/aboutUs/CompanyInfoList'
import CompanyInfoForm from '@/components/aboutUs/CompanyInfoForm'

// Import types
import { 
  CompanyValue, 
  TimelineItem, 
  CompanyStat, 
  CompanyInfo 
} from '@/components/aboutUs/types/aboutus'

export default function AboutUsManagement() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Company Values State
  const [valueFormOpen, setValueFormOpen] = useState(false)
  const [editingValue, setEditingValue] = useState<CompanyValue | null>(null)

  // Timeline Items State
  const [timelineFormOpen, setTimelineFormOpen] = useState(false)
  const [editingTimeline, setEditingTimeline] = useState<TimelineItem | null>(null)

  // Company Stats State
  const [statFormOpen, setStatFormOpen] = useState(false)
  const [editingStat, setEditingStat] = useState<CompanyStat | null>(null)

  // Company Info State
  const [infoFormOpen, setInfoFormOpen] = useState(false)
  const [editingInfo, setEditingInfo] = useState<CompanyInfo | null>(null)

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  // Company Values Handlers
  const handleCreateValue = () => {
    setEditingValue(null)
    setValueFormOpen(true)
  }

  const handleEditValue = (value: CompanyValue) => {
    setEditingValue(value)
    setValueFormOpen(true)
  }

  // Timeline Items Handlers
  const handleCreateTimeline = () => {
    setEditingTimeline(null)
    setTimelineFormOpen(true)
  }

  const handleEditTimeline = (item: TimelineItem) => {
    setEditingTimeline(item)
    setTimelineFormOpen(true)
  }

  // Company Stats Handlers
  const handleCreateStat = () => {
    setEditingStat(null)
    setStatFormOpen(true)
  }

  const handleEditStat = (stat: CompanyStat) => {
    setEditingStat(stat)
    setStatFormOpen(true)
  }

  // Company Info Handlers
  const handleCreateInfo = () => {
    setEditingInfo(null)
    setInfoFormOpen(true)
  }

  const handleEditInfo = (info: CompanyInfo) => {
    setEditingInfo(info)
    setInfoFormOpen(true)
  }

  // Form Success Handlers
  const handleFormSuccess = () => {
    triggerRefresh()
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">About Us Management</h1>
        <p className="text-lg text-muted-foreground">
          Manage your company's story, values, timeline, and key information
        </p>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="values" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="values" className="flex items-center space-x-2">
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">Company Values</span>
            <span className="sm:hidden">Values</span>
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span className="hidden sm:inline">Timeline</span>
            <span className="sm:hidden">Timeline</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Statistics</span>
            <span className="sm:hidden">Stats</span>
          </TabsTrigger>
          <TabsTrigger value="info" className="flex items-center space-x-2">
            <Building2 className="w-4 h-4" />
            <span className="hidden sm:inline">Company Info</span>
            <span className="sm:hidden">Info</span>
          </TabsTrigger>
        </TabsList>

        {/* Company Values Tab */}
        <TabsContent value="values" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>Company Values</span>
              </CardTitle>
              <CardDescription>
                Define and manage your company's core values and principles that guide your organization.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CompanyValuesList
                onEdit={handleEditValue}
                onCreate={handleCreateValue}
                refreshTrigger={refreshTrigger}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Company Timeline</span>
              </CardTitle>
              <CardDescription>
                Chronicle your company's journey with key milestones, achievements, and important moments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TimelineItemsList
                onEdit={handleEditTimeline}
                onCreate={handleCreateTimeline}
                refreshTrigger={refreshTrigger}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="stats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Company Statistics</span>
              </CardTitle>
              <CardDescription>
                Showcase your company's achievements and key metrics with compelling statistics.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CompanyStatsList
                onEdit={handleEditStat}
                onCreate={handleCreateStat}
                refreshTrigger={refreshTrigger}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Info Tab */}
        <TabsContent value="info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="w-5 h-5" />
                <span>Company Information</span>
              </CardTitle>
              <CardDescription>
                Manage your company's basic information, mission, vision, and story.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CompanyInfoList
                onEdit={handleEditInfo}
                onCreate={handleCreateInfo}
                refreshTrigger={refreshTrigger}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CompanyValueForm
        open={valueFormOpen}
        onOpenChange={setValueFormOpen}
        onSuccess={handleFormSuccess}
        editingValue={editingValue}
      />

      <TimelineItemForm
        open={timelineFormOpen}
        onOpenChange={setTimelineFormOpen}
        onSuccess={handleFormSuccess}
        editingItem={editingTimeline}
      />

      <CompanyStatForm
        open={statFormOpen}
        onOpenChange={setStatFormOpen}
        onSuccess={handleFormSuccess}
        editingStat={editingStat}
      />

      <CompanyInfoForm
        open={infoFormOpen}
        onOpenChange={setInfoFormOpen}
        onSuccess={handleFormSuccess}
        editingInfo={editingInfo}
      />
    </div>
  )
}