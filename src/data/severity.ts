export const severityMeta = {
  critical: {
    label: 'Kritik',
    dotClass: 'bg-red-400 shadow-red-500/40',
  },
  high: {
    label: 'Yüksek',
    dotClass: 'bg-orange-300 shadow-orange-400/35',
  },
  medium: {
    label: 'Orta',
    dotClass: 'bg-amber-200 shadow-amber-300/35',
  },
  red: {
    label: 'Kırmızı',
    dotClass: 'bg-red-400 shadow-red-500/40',
  },
  yellow: {
    label: 'Sarı',
    dotClass: 'bg-amber-300 shadow-amber-300/35',
  },
  green: {
    label: 'Yeşil',
    dotClass: 'bg-emerald-300 shadow-emerald-400/35',
  },
}

export function getSeverityMeta(severity) {
  return severityMeta[severity] ?? severityMeta.green
}
