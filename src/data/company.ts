/** SharkJaw company data — single source of truth for Schema.org + components */

export const company = {
  name: 'SharkJaw',
  legalName: 'Wartfila Machinery Service (Hongkong) Co., Limited',
  // Brand-facing short name (footer/About/signatures); legalName stays on Terms/Privacy/Schema/invoices
  shortName: 'Wartfila HK Co., Limited',
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
    // 🔴 署名唯一权威源 = OS/05_Assets/04_Brand/signatory.json → brands.sharkjaw
    //    2026-08-29 更正：原写 name:'Qiangbin Chu'（Lmart 专属身份，禁跨用）
    //    + displayName:'David Zhu'（在 forbidden_variants 里，永久禁用）。两个都不能用。
    name: 'David Qiangbin Zhu',
    displayName: 'David Qiangbin Zhu',
    title: 'Founder & Marine Equipment Specialist',
    linkedin: 'https://www.linkedin.com/in/qiangbinchu',
  },
  // 🔴 「可取证」不是「已持证」—— Wartfila HK 自身不持有任何船级社认可，
  //    认可由制造厂持有、证书随货转交。SSOT = OS/.../Certifications/certs_sharkjaw.json
  //    字段名 2026-08-29 由 certifications 改名，避免被渲染成我方资质徽章。
  classApprovalsAvailable: ['ABS', 'BV', 'CCS', 'DNV', 'LR', 'NK', 'KR', 'RINA'] as const,
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
