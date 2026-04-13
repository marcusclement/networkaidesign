/** Public site URL (used in hero, meta-style links). */
export const SITE_URL = "https://uwnetworkai.com";

/** Permanent invite; override with `VITE_DISCORD_INVITE_URL` in `.env` if it changes. */
const DEFAULT_DISCORD_INVITE_URL = "https://discord.gg/wU2TGUh7wT";

export const DISCORD_INVITE_URL =
  (import.meta.env.VITE_DISCORD_INVITE_URL as string | undefined)?.trim() || DEFAULT_DISCORD_INVITE_URL;

export function getDiscordInviteUrl(): string | undefined {
  return DISCORD_INVITE_URL || undefined;
}
