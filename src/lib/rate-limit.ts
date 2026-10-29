import "server-only";

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory rate limit store for brute-force protection
const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up stale entries periodically to prevent memory leaks
const CLEANUP_INTERVAL = 10 * 60 * 1000; // 10 minutes
let lastCleanup = Date.now();

function cleanupStaleRecords() {
  const now = Date.now();
  if (now - lastCleanup > CLEANUP_INTERVAL) {
    lastCleanup = now;
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetAt) {
        rateLimitStore.delete(key);
      }
    }
  }
}

/**
 * Basic in-memory rate limiter for server actions (e.g. login brute-force prevention).
 * 
 * @param identifier Unique key (e.g., IP address or email)
 * @param maxAttempts Max allowed attempts within the window
 * @param windowMs Time window in milliseconds
 * @returns { success: boolean, remaining: number, resetInSeconds: number }
 */
export function checkRateLimit(
  identifier: string,
  maxAttempts = 5,
  windowMs = 15 * 60 * 1000 // 15 minutes
): { success: boolean; remaining: number; resetInSeconds: number } {
  cleanupStaleRecords();

  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      success: true,
      remaining: maxAttempts - 1,
      resetInSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (record.count >= maxAttempts) {
    return {
      success: false,
      remaining: 0,
      resetInSeconds: Math.max(1, Math.ceil((record.resetAt - now) / 1000)),
    };
  }

  record.count += 1;
  return {
    success: true,
    remaining: maxAttempts - record.count,
    resetInSeconds: Math.max(1, Math.ceil((record.resetAt - now) / 1000)),
  };
}

/**
 * Resets the rate limit for an identifier upon successful authentication.
 */
export function resetRateLimit(identifier: string) {
  rateLimitStore.delete(identifier);
}

