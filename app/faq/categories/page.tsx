import { FAQCategoryTable } from "@/components/faq/category/faq-category-table"

export default function FAQPage() {
    return (
        <>
            <section className="px-6">
                <div className="flex items-center justify-between space-y-2 my-4">
                    <h2 className="text-3xl font-bold tracking-tight">categories Frequently Asked Questions</h2>
                </div>
                <FAQCategoryTable/>
            </section>
        </>
    )
}