export const mainNav = [
  {
    label: 'Products',
    href: '/products/shark-jaw/',
    children: [
      { label: 'Shark Jaw', href: '/products/shark-jaw/' },
      { label: 'Towing Pin', href: '/products/towing-pin/' },
      { label: 'Combo System', href: '/products/shark-jaw-towing-pin-combo/' },
      { label: 'Hydraulic Power Unit', href: '/products/hydraulic-power-unit/' },
      { label: 'Spare Parts', href: '/products/spare-parts/' },
    ],
  },
  {
    label: 'Applications',
    href: '/applications/tugboat/',
    children: [
      { label: 'Tugboat', href: '/applications/tugboat/' },
      { label: 'AHTS Vessel', href: '/applications/ahts-vessel/' },
    ],
  },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
] as const;

export const footerNav = {
  products: [
    { label: 'Shark Jaw Systems', href: '/products/shark-jaw/' },
    { label: 'Towing Pin Systems', href: '/products/towing-pin/' },
    { label: 'Combo Systems', href: '/products/shark-jaw-towing-pin-combo/' },
    { label: 'Hydraulic Power Units', href: '/products/hydraulic-power-unit/' },
    { label: 'Spare Parts', href: '/products/spare-parts/' },
  ],
  company: [
    { label: 'About SharkJaw', href: '/about/' },
    { label: 'Contact / Get a Quote', href: '/contact/' },
  ],
  resources: [
    { label: 'Blog', href: '/blog/' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy-policy/' },
    { label: 'Terms & Conditions', href: '/terms/' },
  ],
} as const;
