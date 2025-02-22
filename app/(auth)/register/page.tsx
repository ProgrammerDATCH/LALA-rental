import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AuthCard } from "@/components/auth/auth-card"
import { RegisterForm } from "./register-form"

export const metadata: Metadata = {
  title: "Register",
  description: "Create a new account",
}

export default async function RegisterPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/")
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <AuthCard
        title="Register"
        description="Choose your role and sign up method"
        footer={
          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        }
      >
        <RegisterForm />
      </AuthCard>
    </div>
  )
}