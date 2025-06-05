// components/projects/tabs/MetricsTab.tsx
"use client"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MetricsTabProps {
  control: any
}

export function MetricsTab({ control }: MetricsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="users"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Users</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 10k+ active users" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="performance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Performance</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 95% faster loading" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 4.8/5 stars" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="downloads"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Downloads</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 100k+ downloads" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="revenue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Revenue</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., $100k+ generated" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="uptime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Uptime</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 99.9% uptime" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}