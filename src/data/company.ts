/** SharkJaw company data — single source of truth for Schema.org + components */

export const company = {
  name: 'SharkJaw',
  legalName: 'New Horizon Tech LLC',
  url: 'https://sharkjaw.net',
  email: 'sales@sharkjaw.net',
  phone: '+1 713 875 9543',
  whatsapp: '+17138759543',
  address: {
    street: '30 N Gould St',
    city: 'Sheridan',
    region: 'WY',
    country: 'US',
    full: '30 N Gould St, Sheridan, WY 82801, USA',
  },
  social: {
    linkedin: '', // TODO: create LinkedIn company page
  },
  founder: {
    name: 'Qiangbin Chu',
    displayName: 'David Zhu',
    title: 'Founder & Marine Equipment Specialist',
    linkedin: 'https://www.linkedin.com/in/qiangbinchu',
  },
  certifications: ['ABS', 'BV', 'CCS', 'DNV', 'LR', 'NK', 'KR', 'RINA'] as const,
  stats: {
    yearsExperience: '15+',
    classificationSocieties: 8,
    swlRange: '25–700 MT',
  },
  tradeTerms: {
    payment: ['T/T', 'L/C', 'D/P'],
    currency: ['USD', 'EUR', 'CNY'],
    incoterms: ['FOB', 'CIF', 'CFR'],
    leadTime: '8–12 weeks',
    responseTime: '24 hours',
  },
} as const;
