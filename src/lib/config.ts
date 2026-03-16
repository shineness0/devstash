/**
 * Set REQUIRE_EMAIL_VERIFICATION=true in .env to enforce email verification on sign-up.
 * Defaults to false (disabled) — useful during development when no email domain is configured.
 */
export const EMAIL_VERIFICATION_ENABLED =
  process.env.REQUIRE_EMAIL_VERIFICATION === "true";
