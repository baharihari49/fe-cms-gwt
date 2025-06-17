// components/hero/HeroDisplay.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { heroAPI } from '@/lib/api/hero'
import { HeroData } from '@/components/hero/types/hero'
import { Button } from '@/components/ui/button'
import { 
  Github, 
  Linkedin, 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube, 
  Mail,
  ExternalLink 
} from 'lucide-react'

// Icon mapping for social media
const getSocialIcon = (name: string) => {
  const iconMap: Record<string, any> = {
    'GitHub': Github,
    'LinkedIn': Linkedin,
    'Instagram': Instagram,
    'Facebook': Facebook,
    'Twitter': Twitter,
    'YouTube': Youtube,
    'Email': Mail,
  }
  return iconMap[name] || ExternalLink
}

interface HeroDisplayProps {
  className?: string
}

export function HeroDisplay({ className = '' }: HeroDisplayProps) {
  const [heroData, setHeroData] = useState<HeroData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        setIsLoading(true)
        const response = await heroAPI.getHeroData(true)
        setHeroData(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load hero data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchHeroData()
  }, [])

  if (isLoading) {
    return (
      <section className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-400 to-cyan-400 ${className}`}>
        <div className="text-white text-xl">Loading...</div>
      </section>
    )
  }

  if (error || !heroData?.heroSection) {
    return (
      <section className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-400 to-cyan-400 ${className}`}>
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to GWT</h2>
          <p className="text-xl">Growth With Technology</p>
        </div>
      </section>
    )
  }

  const { heroSection, socialMedia } = heroData

  return (
    <section className={`relative min-h-screen pt-32 pb-20 md:pt-36 md:pb-32 bg-gradient-to-br from-blue-500 via-blue-400 to-cyan-400 overflow-hidden ${className}`}>
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-2/3 right-1/2 w-40 h-40 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          {/* Content Section */}
          <div className="md:w-3/5 md:pr-12">
            <div className="mb-8 md:mb-0 text-white">
              <div className="relative inline-block">
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-white"></span>
                <h3 className="text-lg font-medium text-cyan-100">
                  {heroSection.welcomeText}
                </h3>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6 leading-tight">
                {heroSection.mainTitle} <span className="text-cyan-200">{heroSection.highlightText}</span>
              </h1>
              
              <p className="text-xl text-cyan-100 mb-8 md:pr-10 max-w-2xl">
                {heroSection.description}
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Get Started
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Learn More
                </Button>
              </div>
              
              {/* Social Media Links */}
              {socialMedia.length > 0 && (
                <div className="flex items-center space-x-4">
                  <span className="text-cyan-100 text-sm">Connect with us:</span>
                  {socialMedia
                    .filter(social => social.isActive)
                    .sort((a, b) => a.order - b.order)
                    .map((social) => {
                      const Icon = getSocialIcon(social.name)
                      const isEmail = social.name === 'Email'
                      
                      return (
                        <Link
                          key={social.id}
                          href={social.url}
                          target={isEmail ? undefined : "_blank"}
                          rel={isEmail ? undefined : "noopener noreferrer"}
                          className="w-10 h-10 rounded-full bg-white bg-opacity-10 flex items-center justify-center hover:bg-opacity-20 transition-colors group"
                        >
                          <Icon className="w-5 h-5 text-white group-hover:text-cyan-200 transition-colors" />
                        </Link>
                      )
                    })}
                </div>
              )}
            </div>
          </div>
          
          {/* Image Section */}
          <div className="md:w-2/5 2xl:w-3/5 mt-12 md:mt-0 flex justify-center">
            <div className="relative max-w-sm">
              {/* Decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 to-cyan-400 rounded-2xl transform rotate-3 scale-105 opacity-70"></div>
              <div className="absolute inset-0 border-2 border-white border-opacity-20 rounded-2xl transform -rotate-2 scale-95"></div>
              
              <div className="relative z-10 rounded-2xl shadow-2xl overflow-hidden md:w-96 2xl:w-[25rem] transform transition-transform duration-500 hover:scale-105">
                {heroSection.image ? (
                  <Image 
                    src={heroSection.image}
                    alt={heroSection.altText || 'Hero image'}
                    width={400} 
                    height={500} 
                    className="w-full h-auto object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-96 bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h3 className="text-2xl font-bold mb-2">GWT</h3>
                      <p className="text-lg">Growth With Technology</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Floating badges */}
              <div className="absolute -top-6 -right-6 bg-white text-blue-600 px-4 py-2 rounded-full shadow-lg font-medium text-sm z-20 flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                Tech Solutions
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white text-blue-600 px-4 py-2 rounded-full shadow-lg font-medium text-sm z-20 flex items-center">
                <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                Innovation
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <span className="text-white text-sm mb-2 animate-bounce">Scroll Down</span>
        <div className="w-1 h-8 bg-white rounded-full opacity-60 animate-bounce"></div>
      </div>
      
      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white"></div>
    </section>
  )
}