import type { MetadataRoute } from 'next';
import { CTA_HREF, PRODUCT_NAV, SITE_URL, USE_CASES_NAV } from '@/lib/site';

// Marketing pages only. Nothing under /admin or /api belongs here.
const PATHS = [
  '/',
  ...PRODUCT_NAV.items.map((item) => item.href),
  ...USE_CASES_NAV.items.map((item) => item.href),
  '/faq',
  CTA_HREF,
  '/contact',
  '/privacy',
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((path) => ({ url: path === '/' ? SITE_URL : `${SITE_URL}${path}` }));
}
