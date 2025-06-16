// components/team-members/team-member-form.tsx
"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Plus, X, Award, ExternalLink } from "lucide-react"
import { TeamMember } from "./types/team-member"
import { teamMemberAPI } from "@/lib/api/team-member"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  position: z.string().min(2, "Position is required").max(100, "Position too long"),
  department: z.string().min(2, "Department is required").max(100, "Department too long"),
  bio: z.string().min(10, "Bio must be at least 10 characters").max(2000, "Bio too long"),
  avatar: z.string().url("Must be a valid URL"),
  skills: z.array(z.string().min(1, "Skill cannot be empty")).min(1, "At least one skill is required"),
  experience: z.string().min(1, "Experience is required").max(50, "Experience too long"),
  projects: z.string().min(10, "Projects description is required").max(1000, "Projects description too long"),
  speciality: z.string().min(2, "Speciality is required").max(100, "Speciality too long"),
  social: z.object({
    linkedin: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    twitter: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    github: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    email: z.string().email("Must be a valid email").optional().or(z.literal("")),
    website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  }),
  gradient: z.string().min(3, "Gradient is required").max(100, "Gradient too long"),
  icon: z.string().min(1, "Icon is required").max(50, "Icon too long"),
  achievements: z.array(z.object({
    title: z.string().min(1, "Achievement title is required"),
    description: z.string().min(1, "Achievement description is required"),
    date: z.string().min(1, "Achievement date is required"),
    type: z.enum(['award', 'certification', 'project', 'recognition']).optional(),
  })).optional(),
})

type FormData = z.infer<typeof formSchema>

interface TeamMemberFormProps {
  teamMember?: TeamMember
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function TeamMemberForm({ teamMember, open, onOpenChange, onSuccess }: TeamMemberFormProps) {
  const [loading, setLoading] = useState(false)
  const [newSkill, setNewSkill] = useState("")
  const [departments, setDepartments] = useState<string[]>([])
  const [positions, setPositions] = useState<string[]>([])
  const [specialities, setSpecialities] = useState<string[]>([])
  const isEdit = !!teamMember

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      position: "",
      department: "",
      bio: "",
      avatar: "",
      skills: [],
      experience: "",
      projects: "",
      speciality: "",
      social: {
        linkedin: "",
        twitter: "",
        github: "",
        email: "",
        website: "",
      },
      gradient: "",
      icon: "",
      achievements: [],
    },
  })

  const { fields: achievementFields, append: appendAchievement, remove: removeAchievement } = useFieldArray({
    control: form.control,
    name: "achievements",
  })

  // Load metadata
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [deptResponse, posResponse, specResponse] = await Promise.all([
          teamMemberAPI.getDepartments(),
          teamMemberAPI.getPositions(),
          teamMemberAPI.getSpecialities(),
        ])
        
        if (deptResponse.success) setDepartments(deptResponse.data)
        if (posResponse.success) setPositions(posResponse.data)
        if (specResponse.success) setSpecialities(specResponse.data)
      } catch (error) {
        console.error("Failed to load metadata:", error)
      }
    }

    if (open) {
      loadMetadata()
    }
  }, [open])

  useEffect(() => {
    if (teamMember) {
      // Parse skills safely
      let skillsArray: string[] = []
      if (Array.isArray(teamMember.skills)) {
        skillsArray = teamMember.skills.filter(skill => typeof skill === 'string')
      } else if (typeof teamMember.skills === 'string') {
        try {
          const parsed = JSON.parse(teamMember.skills)
          skillsArray = Array.isArray(parsed) ? parsed.filter(skill => typeof skill === 'string') : []
        } catch {
          skillsArray = [teamMember.skills]
        }
      }

      // Parse social links safely
      let socialLinks: any = {}
      if (typeof teamMember.social === 'object' && teamMember.social !== null && !Array.isArray(teamMember.social)) {
        socialLinks = teamMember.social
      } else if (typeof teamMember.social === 'string') {
        try {
          const parsed = JSON.parse(teamMember.social)
          socialLinks = typeof parsed === 'object' && parsed !== null ? parsed : {}
        } catch {
          socialLinks = {}
        }
      }

      // Parse achievements safely
      let achievementsArray: any[] = []
      if (Array.isArray(teamMember.achievements)) {
        achievementsArray = teamMember.achievements.filter(achievement => 
          achievement && 
          typeof achievement === 'object' && 
          achievement.title && 
          achievement.description
        )
      } else if (typeof teamMember.achievements === 'string') {
        try {
          const parsed = JSON.parse(teamMember.achievements)
          achievementsArray = Array.isArray(parsed) ? parsed.filter(achievement => 
            achievement && 
            typeof achievement === 'object' && 
            achievement.title && 
            achievement.description
          ) : []
        } catch {
          achievementsArray = []
        }
      }

      form.reset({
        name: teamMember.name,
        position: teamMember.position,
        department: teamMember.department,
        bio: teamMember.bio,
        avatar: teamMember.avatar,
        skills: skillsArray,
        experience: teamMember.experience,
        projects: teamMember.projects,
        speciality: teamMember.speciality,
        social: {
          linkedin: socialLinks?.linkedin || "",
          twitter: socialLinks?.twitter || "",
          github: socialLinks?.github || "",
          email: socialLinks?.email || "",
          website: socialLinks?.website || "",
        },
        gradient: teamMember.gradient,
        icon: teamMember.icon,
        achievements: achievementsArray,
      })
    } else {
      form.reset({
        name: "",
        position: "",
        department: "",
        bio: "",
        avatar: "",
        skills: [],
        experience: "",
        projects: "",
        speciality: "",
        social: {
          linkedin: "",
          twitter: "",
          github: "",
          email: "",
          website: "",
        },
        gradient: "",
        icon: "",
        achievements: [],
      })
    }
  }, [teamMember, form])

  const addSkill = () => {
    if (newSkill.trim()) {
      const currentSkills = form.getValues("skills")
      if (!currentSkills.includes(newSkill.trim())) {
        form.setValue("skills", [...currentSkills, newSkill.trim()])
        setNewSkill("")
      }
    }
  }

  const removeSkill = (index: number) => {
    const currentSkills = form.getValues("skills")
    form.setValue("skills", currentSkills.filter((_, i) => i !== index))
  }

  const addAchievement = () => {
    appendAchievement({
      title: "",
      description: "",
      date: "",
      type: "award"
    })
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      // Clean up social links - remove empty strings
      const cleanSocial = Object.fromEntries(
        Object.entries(data.social).filter(([_, value]) => value && value.trim() !== "")
      )

      const submitData = {
        ...data,
        social: cleanSocial,
        achievements: data.achievements?.filter(a => a.title && a.description && a.date) || []
      }

      if (isEdit && teamMember) {
        await teamMemberAPI.updateTeamMember({
          id: teamMember.id,
          ...submitData,
        })
      } else {
        await teamMemberAPI.createTeamMember(submitData)
      }
      
      onSuccess()
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Failed to save team member:", error)
      toast.error("Failed to save team member")
    } finally {
      setLoading(false)
    }
  }

  const watchedAvatar = form.watch("avatar")
  const watchedName = form.watch("name")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Team Member" : "Add New Team Member"}
          </DialogTitle>
          <DialogDescription>
            {isEdit 
              ? "Update the team member information below." 
              : "Fill in the information below to add a new team member."
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avatar URL *</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/avatar.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                      {watchedAvatar && (
                        <div className="flex items-center gap-2 mt-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={watchedAvatar} alt="Preview" />
                            <AvatarFallback>
                              {watchedName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'NA'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">Preview</span>
                        </div>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position *</FormLabel>
                      <Select onValueChange={(value) => {
                        if (value === "custom") {
                          field.onChange("custom")
                        } else {
                          field.onChange(value)
                        }
                      }} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {positions.map((position) => (
                            <SelectItem key={position} value={position}>
                              {position}
                            </SelectItem>
                          ))}
                          <SelectItem value="custom">Custom...</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                      {field.value === "custom" && (
                        <Input
                          placeholder="Enter custom position"
                          onChange={(e) => field.onChange(e.target.value)}
                          className="mt-2"
                        />
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department *</FormLabel>
                      <Select onValueChange={(value) => {
                        if (value === "custom") {
                          field.onChange("custom")
                        } else {
                          field.onChange(value)
                        }
                      }} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                          <SelectItem value="custom">Custom...</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                      {field.value === "custom" && (
                        <Input
                          placeholder="Enter custom department"
                          onChange={(e) => field.onChange(e.target.value)}
                          className="mt-2"
                        />
                      )}
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="speciality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Speciality *</FormLabel>
                      <Select onValueChange={(value) => {
                        if (value === "custom") {
                          field.onChange("custom")
                        } else {
                          field.onChange(value)
                        }
                      }} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select speciality" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {specialities.map((spec) => (
                            <SelectItem key={spec} value={spec}>
                              {spec}
                            </SelectItem>
                          ))}
                          <SelectItem value="custom">Custom...</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                      {field.value === "custom" && (
                        <Input
                          placeholder="Enter custom speciality"
                          onChange={(e) => field.onChange(e.target.value)}
                          className="mt-2"
                        />
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 5+ years" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 💻 or lucide icon name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="gradient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gradient *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. from-blue-500 to-purple-600" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us about this team member..."
                        rows={4}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projects"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Projects *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe key projects and contributions..."
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Skills */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Skills</h3>
              
              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills *</FormLabel>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter a skill"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        />
                        <Button type="button" onClick={addSkill} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {field.value.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {skill}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 hover:bg-transparent"
                              onClick={() => removeSkill(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Social Links</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="social.linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn</FormLabel>
                      <FormControl>
                        <Input placeholder="https://linkedin.com/in/username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="social.github"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub</FormLabel>
                      <FormControl>
                        <Input placeholder="https://github.com/username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="social.twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter</FormLabel>
                      <FormControl>
                        <Input placeholder="https://twitter.com/username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="social.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="social.website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="https://website.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Achievements */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Achievements</h3>
                <Button type="button" onClick={addAchievement} size="sm" variant="outline">
                  <Award className="mr-2 h-4 w-4" />
                  Add Achievement
                </Button>
              </div>

              {achievementFields.map((field, index) => (
                <div key={field.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Achievement {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAchievement(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`achievements.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Achievement title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`achievements.${index}.type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || "award"}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="award">Award</SelectItem>
                              <SelectItem value="certification">Certification</SelectItem>
                              <SelectItem value="project">Project</SelectItem>
                              <SelectItem value="recognition">Recognition</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`achievements.${index}.date`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 2024-01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`achievements.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the achievement..."
                            rows={2}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? "Update" : "Create"} Team Member
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog> 
  )
}