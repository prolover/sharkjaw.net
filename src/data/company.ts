/** SharkJaw company data — single source of truth for Schema.org + components */

export const company = {
  name: 'SharkJaw',
  legalName: 'Wartfila Machinery Service (Hongkong) Co., Limited',
  url: 'https://sharkjaw.net',
  email: 'sales@sharkjaw.net',
  phone: '+852 3115 8545',
  whatsapp: '+85231158545',
  address: {
    street: 'Flat/RM A, 12/F ZJ 300, 300 Lockhart Road',
    city: 'Wan Chai',
    region: 'Hong Kong',
    country: 'HK',
    full: 'Flat/RM A, 12/F ZJ 300, 300 Lockhart Road, Wan Chai, Hong Kong',
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
