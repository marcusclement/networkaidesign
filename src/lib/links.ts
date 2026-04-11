/** Public site URL (used in hero, meta-style links). */
export const SITE_URL = "https://uwnetworkai.com";

/** Set `VITE_DISCORD_INVITE_URL` in `.env` to your permanent Discord invite (navbar icon). */
export const DISCORD_INVITE_URL =
  (import.meta.env.VITE_DISCORD_INVITE_URL as string | undefined)?.trim() ?? "";

export function getDiscordInviteUrl(): string | undefined {
  return DISCORD_INVITE_URL || undefined;
}
