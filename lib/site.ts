// The site's public address and the words every link preview uses.

export const siteName = "Quote to Paid";
export const siteTagline = "No quote or invoice goes quiet";
export const siteDescription =
  "Follows up on every quote and every unpaid invoice by text, politely, until the customer answers or pays. Then it stops. For roofing and AC companies.";

/**
 * The address search engines and link previews use. `SITE_URL` (set in
 * Vercel to https://quotetopaid.vercel.app) wins, because Vercel's own
 * production URL for this project is a random-looking alias. Locally it is localhost.
 */
export function siteUrl(): URL {
  if (process.env.SITE_URL) return new URL(process.env.SITE_URL);
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return new URL(production ? `https://${production}` : "http://localhost:3000");
}
