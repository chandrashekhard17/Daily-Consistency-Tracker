"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpFormValues } from "@/lib/validators/auth";
import { supabase, isSupabaseConfigured } from "@/lib/db/supabase";
import { getErrorMessage, logSafeError } from "@/lib/utils/error";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Lock, Mail, User, CheckCircle2, ArrowRight } from "lucide-react";

export default function SignUpPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (values: SignUpFormValues) => {
    setServerError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (!isSupabaseConfigured()) {
        setServerError("Supabase credentials are missing from .env.local.");
        return;
      }

      const emailRedirectTo = `${window.location.origin}/auth/callback`;

      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
          },
          emailRedirectTo,
        },
      });

      if (error) {
        logSafeError("SignUp", error);
        setServerError(getErrorMessage(error));
        return;
      }

      if (data.session) {
        // Direct session established (email confirmation disabled in Supabase)
        router.replace("/");
        router.refresh();
      } else if (data.user) {
        if (data.user.identities && data.user.identities.length === 0) {
          // User already exists in Supabase Auth
          setServerError("User already registered with this email address. Please sign in instead.");
        } else {
          // Email confirmation required by Supabase
          setSuccessMsg(
            `Account registered for ${values.email}! Please check your email inbox to confirm your registration.`
          );
        }
      } else {
        setServerError("Registration failed. Please try again.");
      }
    } catch (err: any) {
      logSafeError("SignUp Exception", err);
      setServerError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full border-border bg-card/80 backdrop-blur-xl shadow-2xl rounded-2xl">
      <CardHeader className="space-y-1 text-center pb-4">
        <CardTitle className="text-xl font-bold tracking-tight">Create Your Account</CardTitle>
        <CardDescription className="text-xs">
          Join Daily Consistency Tracker to start building streaks and focus
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {serverError && (
          <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs font-medium flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {successMsg ? (
          <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 space-y-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckCircle2 className="h-5 w-5" /> Registration Successful!
            </div>
            <p>{successMsg}</p>
            <Link href="/login">
              <Button variant="outline" size="sm" className="w-full mt-2 font-semibold">
                Proceed to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-primary" /> Full Name *
              </label>
              <input
                type="text"
                placeholder="Alex Morgan"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                {...register("fullName")}
              />
              {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-primary" /> Email Address *
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                {...register("email")}
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-primary" /> Password *
              </label>
              <input
                type="password"
                placeholder="At least 6 characters..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                {...register("password")}
              />
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-primary" /> Confirm Password *
              </label>
              <input
                type="password"
                placeholder="Repeat your password..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full gap-2 font-semibold shadow-md mt-2">
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-border/60">
          <p className="text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
