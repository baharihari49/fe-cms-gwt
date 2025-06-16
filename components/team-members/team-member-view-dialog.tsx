// components/team-members/team-member-view-dialog.tsx
"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  ExternalLink, 
  Mail, 
  Globe, 
  Linkedin, 
  Github, 
  Twitter,
  Award,
  Briefcase,
  GraduationCap,
  Star,
  Calendar
} from "lucide-react"
import { TeamMember } from "./types/team-member"

interface TeamMemberViewDialogProps {
  teamMember: TeamMember | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TeamMemberViewDialog({ teamMember, open, onOpenChange }: TeamMemberViewDialogProps) {
  if (!teamMember) return null

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin': return <Linkedin className="h-4 w-4" />
      case 'github': return <Github className="h-4 w-4" />
      case 'twitter': return <Twitter className="h-4 w-4" />
      case 'email': return <Mail className="h-4 w-4" />
      case 'website': return <Globe className="h-4 w-4" />
      default: return <ExternalLink className="h-4 w-4" />
    }
  }

  const getAchievementIcon = (type?: string) => {
    switch (type) {
      case 'award': return <Award className="h-4 w-4 text-yellow-500" />
      case 'certification': return <GraduationCap className="h-4 w-4 text-blue-500" />
      case 'project': return <Briefcase className="h-4 w-4 text-green-500" />
      case 'recognition': return <Star className="h-4 w-4 text-purple-500" />
      default: return <Award className="h-4 w-4 text-gray-500" />
    }
  }

  const getAchievementBadgeVariant = (type?: string) => {
    switch (type) {
      case 'award': return 'default'
      case 'certification': return 'secondary'
      case 'project': return 'outline'
      case 'recognition': return 'destructive'
      default: return 'outline'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={teamMember.avatar} alt={teamMember.name} />
              <AvatarFallback>
                {teamMember.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                {teamMember.icon && <span className="text-lg">{teamMember.icon}</span>}
                {teamMember.name}
              </div>
              <div className="text-sm text-muted-foreground font-normal">
                {teamMember.position} • {teamMember.department}
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            Team Member Details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Department</h4>
              <Badge variant="secondary">{teamMember.department}</Badge>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Speciality</h4>
              <Badge variant="outline">{teamMember.speciality}</Badge>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Experience</h4>
              <span className="text-sm">{teamMember.experience}</span>
            </div>
          </div>

          <Separator />

          {/* Bio */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">About</h4>
            <p className="text-sm leading-relaxed">{teamMember.bio}</p>
          </div>

          <Separator />

          {/* Skills */}
          {teamMember.skills && (() => {
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
            } else if (teamMember.skills && typeof teamMember.skills === 'object' && teamMember.skills.length !== undefined) {
              skillsArray = Array.from(teamMember.skills).filter(skill => typeof skill === 'string')
            }
            
            return skillsArray.length > 0 ? (
              <>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {skillsArray.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator />
              </>
            ) : null
          })()}

          {/* Projects */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Projects & Contributions</h4>
            <p className="text-sm leading-relaxed">{teamMember.projects}</p>
          </div>

          <Separator />

          {/* Social Links */}
          {teamMember.social && (() => {
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
            
            const hasValidLinks = Object.values(socialLinks).some(link => link && typeof link === 'string')
            
            return hasValidLinks ? (
              <>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Social Links</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(socialLinks).map(([platform, url]) => {
                      if (!url || typeof url !== 'string') return null
                      return (
                        <Button
                          key={platform}
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            {getSocialIcon(platform)}
                            {platform.charAt(0).toUpperCase() + platform.slice(1)}
                          </a>
                        </Button>
                      )
                    })}
                  </div>
                </div>
                <Separator />
              </>
            ) : null
          })()}

          {/* Achievements */}
          {teamMember.achievements && (() => {
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
            
            return achievementsArray.length > 0 ? (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Achievements</h4>
                <div className="space-y-3">
                  {achievementsArray.map((achievement, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {getAchievementIcon(achievement.type)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="font-medium">{achievement.title}</h5>
                            {achievement.type && (
                              <Badge variant={getAchievementBadgeVariant(achievement.type)} className="text-xs">
                                {achievement.type}
                              </Badge>
                            )}
                            {achievement.date && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {achievement.date}
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null
          })()}

          {/* Metadata */}
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div>
              <span className="font-medium">Member ID:</span> #{teamMember.id}
            </div>
            <div>
              <span className="font-medium">Gradient:</span> {teamMember.gradient}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}