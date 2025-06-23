'use client'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProjectStatusChartProps {
  data: { 
    status: string; 
    _count: { status: number } 
  }[]
}

const COLORS = {
  LIVE: 'hsl(142, 76%, 36%)',        // green-600
  DEVELOPMENT: 'hsl(221, 83%, 53%)', // blue-600
  BETA: 'hsl(32, 95%, 44%)',        // orange-500
  ARCHIVED: 'hsl(220, 9%, 46%)',     // gray-600
  MAINTENANCE: 'hsl(0, 84%, 60%)'    // red-500
}

const STATUS_LABELS = {
  LIVE: 'Live',
  DEVELOPMENT: 'Development', 
  BETA: 'Beta',
  ARCHIVED: 'Archived',
  MAINTENANCE: 'Maintenance'
}

export function ProjectStatusChart({ data }: ProjectStatusChartProps) {
  // ✅ FIX: Transform data correctly
  const chartData = data.map(item => ({
    name: STATUS_LABELS[item.status as keyof typeof STATUS_LABELS] || item.status,
    value: item._count.status, // ← Fix: use _count.status instead of item.count
    color: COLORS[item.status as keyof typeof COLORS] || '#6b7280'
  }))

  // ✅ FIX: Calculate total correctly
  const totalProjects = data.reduce((sum, item) => sum + item._count.status, 0)

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Project Status Distribution
          <Badge variant="secondary">{totalProjects} total</Badge>
        </CardTitle>
        <CardDescription>
          Current status breakdown of all projects
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [value, 'Projects']}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}