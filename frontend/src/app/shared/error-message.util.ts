/**
 * Converts any HTTP error into a plain-language message safe to show
 * directly to a user — used everywhere the app calls the backend.
 *
 * 4xx errors are things our own controllers deliberately wrote a specific
 * message for (e.g. "Invalid password", "Choose between 2 and 3 electives.")
 * — those are already human-readable, so they take priority. Generic wording
 * only kicks in for network failures, server crashes, or a missing message.
 */
export function toUserMessage(err: any, fallback = 'Something went wrong. Please try again.'): string {
  if (!err) return fallback;

  // No response at all — server down, no internet, CORS block, etc.
  if (err.status === 0) {
    return 'Can\'t reach the server. Check your internet connection and try again.';
  }

  // Backend already wrote a specific, human message — trust it.
  const backendMessage = err.error?.message;
  if (typeof backendMessage === 'string' && backendMessage.trim()) {
    return backendMessage;
  }

  if (err.status === 401) {
    return 'You need to be logged in to do this.';
  }
  if (err.status === 403) {
    return 'You don\'t have permission to do this.';
  }
  if (err.status === 404) {
    return 'That item couldn\'t be found — it may have been removed.';
  }
  if (err.status >= 500) {
    return 'Something went wrong on our end. Please try again shortly.';
  }

  return fallback;
}
