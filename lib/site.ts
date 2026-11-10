// The site's public address and the words every link preview uses.

export const siteName = "Quote to Paid";
export const siteTagline = "No quote or invoice goes quiet";
export const siteDescription =
  "Follows up on every quote and every unpaid invoice by text, politely, until the customer answers or pays. Then it stops. For roofing and AC companies.";

/** The production address on Vercel, localhost in development. */
export function siteUrl(): URL {
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return new URL(production ? `https://${production}` : "http://localhost:3000");
}
