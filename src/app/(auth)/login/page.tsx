import { LogIn } from "lucide-react";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/shared/login-form";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen bg-muted/30 lg:grid-cols-2">
      <div className="flex items-center justify-center p-4 sm:p-8">
        <Card className="w-full max-w-sm">
          <CardHeader className="items-center text-center">
            <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-muted">
              <LogIn className="size-6 text-muted-foreground" />
            </div>
            <CardTitle>Sign in to GymFlow</CardTitle>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
      <aside className="relative hidden min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-background to-blue-50 p-8 lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12),transparent_55%)]" />
        <Image
          src="/gymflow-fitness-logo.png"
          alt="GymFlow Fitness"
          width={420}
          height={236}
          className="relative h-auto w-[min(28rem,80%)] object-contain drop-shadow-xl"
          priority
        />
      </aside>
    </div>
  );
}
