/**
 * Safe development performance timing helper.
 */
export function logPerf(stepName: string, startTime: number): number {
  const duration = Math.round(performance.now() - startTime);
  if (process.env.NODE_ENV === "development") {
    console.log(`[Perf Timing] ${stepName}: ${duration}ms`);
  }
  return duration;
}
