'use client'
import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TechnologyUsageChartProps {
  data: { name: string; count: number }[]
}

export function TechnologyUsageChart({ data }: TechnologyUsageChartProps) {
  const [truncateLength, setTruncateLength] = useState(10)
  const [isMounted, setIsMounted] = useState(false)
  
  const topTech = data[0]?.name || 'N/A'
  
  useEffect(() => {
    setIsMounted(true)
    
    const updateTruncateLength = () => {
      const width = window.innerWidth
      if (width < 640) {
        setTruncateLength(5) // Mobile: very short
      } else if (width < 768) {
        setTruncateLength(6) // Small mobile: short
      } else if (width < 1024) {
        setTruncateLength(8) // Tablet: medium
      } else if (width < 1280) {
        setTruncateLength(10) // Desktop: longer
      } else {
        setTruncateLength(12) // Large desktop: longest
      }
    }
    
    updateTruncateLength()
    window.addEventListener('resize', updateTruncateLength)
    
    return () => window.removeEventListener('resize', updateTruncateLength)
  }, [])
  
  // Prevent hydration mismatch
  if (!isMounted) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Top Technologies Used
            <Badge variant="outline">Loading...</Badge>
          </CardTitle>
          <CardDescription>
            Technology usage across all projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  // ✅ Responsive truncate function
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }
  
  // ✅ Format data dengan responsive truncate
  const formattedData = data.map(item => ({
    name: truncateText(item.name, truncateLength),
    fullName: item.name,
    count: item.count
  }))
  
  // ✅ Responsive margins
  const getMargins = () => {
    const width = window.innerWidth
    if (width < 640) {
      return { top: 20, right: 10, left: 10, bottom: 80 } // More bottom space for mobile
    } else if (width < 1024) {
      return { top: 20, right: 20, left: 15, bottom: 70 }
    } else {
      return { top: 20, right: 30, left: 20, bottom: 60 }
    }
  }
  
  // ✅ Responsive font sizes
  const getFontSizes = () => {
    const width = window.innerWidth
    if (width < 640) {
      return { xAxis: 9, yAxis: 10 }
    } else if (width < 1024) {
      return { xAxis: 10, yAxis: 11 }
    } else {
      return { xAxis: 11, yAxis: 12 }
    }
  }
  
  const margins = getMargins()
  const fontSizes = getFontSizes()
  
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="truncate">Top Technologies Used</span>
          <Badge variant="outline" className="text-xs">
            Most used: {truncateText(topTech, 8)}
          </Badge>
        </CardTitle>
        <CardDescription>
          Technology usage across all projects
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={formattedData}
              margin={margins}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))"
                opacity={0.5}
              />
              <XAxis 
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={fontSizes.xAxis}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={margins.bottom}
                interval={0}
                tick={{ 
                  fontSize: fontSizes.xAxis,
                  fill: 'hsl(var(--muted-foreground))'
                }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={fontSizes.yAxis}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                tick={{ 
                  fontSize: fontSizes.yAxis,
                  fill: 'hsl(var(--muted-foreground))'
                }}
              />
              <Tooltip 
                formatter={(value: number) => [value, 'Projects']}
                labelFormatter={(label, payload) => {
                  // ✅ Show full name in tooltip
                  const fullName = payload?.[0]?.payload?.fullName || label
                  return fullName
                }}
                labelStyle={{ 
                  color: 'hsl(var(--foreground))',
                  fontWeight: 'medium'
                }}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
              <Bar 
                dataKey="count" 
                fill="hsl(221, 83%, 53%)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}