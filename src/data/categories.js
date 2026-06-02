export const categoryMeta = {
  politics: {
    label: 'Siyasi',
    accentClass: 'border-sky-300/40 bg-sky-400/12 text-sky-100',
  },
  finance: {
    label: 'Finans',
    accentClass: 'border-emerald-300/40 bg-emerald-400/12 text-emerald-100',
  },
  regional: {
    label: 'Bölgesel',
    accentClass: 'border-violet-300/40 bg-violet-400/12 text-violet-100',
  },
  security: {
    label: 'Güvenlik',
    accentClass: 'border-red-300/35 bg-red-400/10 text-red-100',
  },
  transport: {
    label: 'Ulaşım',
    accentClass: 'border-cyan-300/40 bg-cyan-400/12 text-cyan-100',
  },
}

export function getCategoryMeta(category) {
  return categoryMeta[category] ?? categoryMeta.regional
}
