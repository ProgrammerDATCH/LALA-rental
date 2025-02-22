import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AuthCard } from "@/components/auth/auth-card"
import { LoginForm } from "./login-form"

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
}

export default async function LoginPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/")
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <AuthCard
        title="Login"
        description="Choose your preferred login method"
        footer={
          <p className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
        }
      >
        <LoginForm />
      </AuthCard>
    </div>
  )
}