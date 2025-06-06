'use client'
import Image from "next/image"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
       <div className="">
         <Image
          src="https://res.cloudinary.com/du0tz73ma/image/upload/c_crop,h_2190,w_4321/v1748670695/gwt-projects/LOGO_GWT_9_pye1l5.png"
          alt="Acme Inc."
          width={150}
          height={150}
          className="mx-auto"
        />
       </div>
        <LoginForm />
      </div>
    </div>
  )
}
