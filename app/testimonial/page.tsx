// app/dashboard/testimonials/page.tsx
import { TestimonialsTable } from "@/components/testimonial/testimonials-table"

export default function TestimonialsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Testimonials</h2>
      </div>
      <TestimonialsTable />
    </div>
  )
}