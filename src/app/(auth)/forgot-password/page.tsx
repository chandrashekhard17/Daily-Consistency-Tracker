"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, ForgotPasswordFormValues } from "@/lib/validators/auth";
import { supabase, isSupabaseConfigured } from "@/lib/db/supabase";
import { getErrorMessage, logSafeError } from "@/lib/utils/error";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Mail, CheckCircle2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setServerError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (!isSupabaseConfigured()) {
        setServerError("Supabase credentials are missing from .env.local.");
        setLoading(false);
        return;
      }

      const redirectTo = `${window.location.origin}/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo,
      });

      if (error) {
        logSafeError("ForgotPassword", error);
        setServerError(getErrorMessage(error));
        setLoading(false);
        return;
      }

      setSuccessMsg(
        `Password reset instructions have been sent to ${values.email}. Please check your inbox.`
      );
      setLoading(false);
    } catch (err: any) {
      logSafeError("ForgotPassword Exception", err);
      setServerError(getErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <Card className="w-full border-border bg-card/80 backdrop-blur-xl shadow-2xl rounded-2xl">
      <CardHeader className="space-y-1 text-center pb-4">
        <CardTitle className="text-xl font-bold tracking-tight">Reset Your Password</CardTitle>
        <CardDescription className="text-xs">
          Enter your email address to receive password reset instructions
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
              <CheckCircle2 className="h-5 w-5" /> Link Sent!
            </div>
            <p>{successMsg}</p>
            <Link href="/login">
              <Button variant="outline" size="sm" className="w-full mt-2 font-semibold gap-1">
                <ArrowLeft className="h-4 w-4" /> Back to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-primary" /> Registered Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                {...register("email")}
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>

            <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full font-semibold shadow-md">
              {loading ? "Sending Reset Link..." : "Send Reset Link"}
            </Button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-border/60">
          <Link href="/login" className="text-xs text-muted-foreground hover:text-foreground font-semibold inline-flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
