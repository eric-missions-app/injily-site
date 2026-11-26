export const SITE_NAME = 'injily';

export const CTA_LABEL = 'Get early access';
export const CTA_HREF = '/get-started';

export type NavLink = {
  label: string;
  href: string;
};

export type NavGroup = {
  label: string;
  items: NavLink[];
};

export const PRODUCT_NAV: NavGroup = {
  label: 'Product',
  items: [
    { label: 'Convert tracking', href: '/product/convert-tracking' },
    { label: 'Follow-up', href: '/product/follow-up' },
    { label: 'Mentoring', href: '/product/mentoring' },
    { label: 'Missions', href: '/product/missions' },
    { label: 'Insights', href: '/product/insights' },
  ],
};

export const USE_CASES_NAV: NavGroup = {
  label: "Who it's for",
  items: [
    { label: 'Churches', href: '/use-cases/churches' },
    { label: 'Evangelists', href: '/use-cases/evangelists' },
    { label: 'Mission teams', href: '/use-cases/mission-teams' },
  ],
};

export const FAQ_LINK: NavLink = { label: 'FAQ', href: '/faq' };

/** Header nav: the two dropdowns, then the plain links. */
export const NAV_GROUPS: NavGroup[] = [PRODUCT_NAV, USE_CASES_NAV];
export const NAV_LINKS: NavLink[] = [FAQ_LINK];

/** Footer columns. */
export const FOOTER_COLUMNS: NavGroup[] = [
  PRODUCT_NAV,
  USE_CASES_NAV,
  {
    label: 'Company',
    items: [
      FAQ_LINK,
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy', href: '/privacy' },
    ],
  },
];
