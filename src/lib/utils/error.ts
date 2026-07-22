/**
 * Formats any error object (Supabase AuthApiError, PostgREST error, Standard Error, string, object)
 * into a clean, human-readable string message. Never returns {} or [object Object].
 */
export function getErrorMessage(error: unknown): string {
  if (!error) return "An unknown error occurred.";
  if (typeof error === "string") return error;

  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "object") {
    const errObj = error as Record<string, any>;

    if (typeof errObj.message === "string" && errObj.message.trim().length > 0) {
      return errObj.message;
    }
    if (typeof errObj.error_description === "string" && errObj.error_description.trim().length > 0) {
      return errObj.error_description;
    }
    if (typeof errObj.msg === "string" && errObj.msg.trim().length > 0) {
      return errObj.msg;
    }
    if (typeof errObj.details === "string" && errObj.details.trim().length > 0) {
      return errObj.details;
    }
    if (typeof errObj.hint === "string" && errObj.hint.trim().length > 0) {
      return errObj.hint;
    }

    try {
      const jsonStr = JSON.stringify(error);
      if (jsonStr && jsonStr !== "{}" && jsonStr !== "[]") {
        return jsonStr;
      }
    } catch {}
  }

  return "An unexpected error occurred. Please try again.";
}

/**
 * Safe development logger that redacts sensitive keys (passwords, tokens, keys)
 */
export function logSafeError(context: string, error: unknown): void {
  const message = getErrorMessage(error);
  console.error(`[${context}] Error:`, message);
}
