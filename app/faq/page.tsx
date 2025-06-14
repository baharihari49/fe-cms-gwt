import { FAQTable } from "@/components/faq/faq-table"

export default function FAQPage() {
    return (
        <>
            <section className="p-6">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
                </div>
                <div className="my-4">
                    <p className="text-lg text-gray-700">
                        Here you can find answers to the most common questions about our services, features, and more.
                    </p>
                </div>  
                <FAQTable/>
            </section>
        </>
    )
}