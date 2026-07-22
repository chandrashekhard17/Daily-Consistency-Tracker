"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, ResetPasswordFormValues } from "@/lib/validators/auth";
import { supabase, isSupabaseConfigured } from "@/lib/db/supabase";
import { getErrorMessage, logSafeError } from "@/lib/utils/error";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Lock, CheckCircle2, ArrowRight } from "lucide-react";

export default function ResetPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setServerError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (!isSupabaseConfigured()) {
        setServerError("Supabase credentials are missing from .env.local.");
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) {
        logSafeError("ResetPassword", error);
        setServerError(getErrorMessage(error));
        setLoading(false);
        return;
      }

      setSuccessMsg("Your password has been successfully updated!");
      setLoading(false);
      setTimeout(() => {
        router.replace("/");
      }, 2000);
    } catch (err: any) {
      logSafeError("ResetPassword Exception", err);
      setServerError(getErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <Card className="w-full border-border bg-card/80 backdrop-blur-xl shadow-2xl rounded-2xl">
      <CardHeader className="space-y-1 text-center pb-4">
        <CardTitle className="text-xl font-bold tracking-tight">Set New Password</CardTitle>
        <CardDescription className="text-xs">
          Enter your new password below to secure your account
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
              <CheckCircle2 className="h-5 w-5" /> Password Updated!
            </div>
            <p>{successMsg}</p>
            <p className="text-[11px] text-muted-foreground">Redirecting to dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-primary" /> New Password
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
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-primary" /> Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Repeat your new password..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full font-semibold shadow-md gap-2">
              {loading ? "Updating Password..." : "Update Password"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
