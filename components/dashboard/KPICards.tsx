'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

interface KPIData {
  title: string
  value: number
  trend?: {
    value: number
    isPositive: boolean
  }
  icon: React.ReactNode
  description?: string
}

interface KPICardsProps {
  data: KPIData[]
}

export function KPICards({ data }: KPICardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {data.map((kpi, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {kpi.title}
            </CardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              {kpi.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            {kpi.trend && (
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {kpi.trend.isPositive ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={kpi.trend.isPositive ? "text-green-500" : "text-red-500"}>
                  {kpi.trend.value}%
                </span>
                <span className="ml-1">from last month</span>
              </div>
            )}
            {kpi.description && (
              <p className="text-xs text-muted-foreground mt-1">
                {kpi.description}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}