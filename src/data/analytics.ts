/**
 * Analytics & Webmaster verification — single source of truth.
 *
 * Architecture: GTM is the single tag-injection entry point. GA4 fires via a
 * GA4 Configuration tag *inside* GTM, NOT via gtag.js direct. Double-firing
 * GA4 (gtag + GTM both) inflates events and corrupts attribution.
 *
 *   1. gtmId — Google Tag Manager container (https://tagmanager.google.com)
 *      Workspace → Container ID at top right. Format: GTM-XXXXXXXX.
 *      Inside GTM, add a GA4 Configuration tag using ga4MeasurementId below
 *      and trigger it on All Pages.
 *
 *   2. ga4MeasurementId — Google Analytics 4 Measurement ID (G-XXXXXXXXXX)
 *      Tracked here for reference + skill integrations (seo-report etc).
 *      NOT rendered to HTML — it fires via GTM only.
 *
 *   3. gscVerification — Google Search Console HTML meta tag content (~40 chars).
 *      Or use DNS TXT verification on Cloudflare and leave this empty.
 *
 *   4. bingVerification — Bing Webmaster Tools meta tag content (~32-char hex).
 *      Optional. Or use "Import from GSC" once GSC verifies.
 *
 * Empty string = not rendered. All values are PUBLIC (visible in HTML).
 */

export const analytics = {
  gtmId: 'GTM-KH2THF2B',
  ga4MeasurementId: 'G-P0R4NMS557',
  ga4StreamId: '14590165291',     // GA4 Data Stream internal ID — reference only, not rendered
  ga4PropertyId: '',              // GA4 Reporting API needs this; fill from Admin → Property Settings
  gscVerification: '',
  bingVerification: '',
} as const;
