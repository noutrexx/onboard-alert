const HASHTAG_PATTERN = /(^|\s)#[\p{L}\p{N}_-]+/gu
const URL_PATTERN = /https?:\/\/\S+|www\.\S+/gi

export function cleanDescription(description = '', maxLength = 150) {
  const normalized = String(description)
    .replace(URL_PATTERN, ' ')
    .replace(HASHTAG_PATTERN, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (normalized.length <= maxLength) return normalized

  return `${normalized.slice(0, maxLength).trim()}...`
}

export function formatAlertTime(timestamp) {
  return new Intl.DateTimeFormat('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short',
  }).format(new Date(timestamp))
}

export function formatRelativeTime(timestamp) {
  if (!timestamp) return ''

  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000))

  if (Number.isNaN(date.getTime())) return ''
  if (diffMinutes < 1) return 'Az önce'
  if (diffMinutes < 60) return `${diffMinutes} dakika önce`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24 && isSameDay(date, now)) return `${diffHours} saat önce`

  if (isSameDay(date, now)) {
    return `Bugün ${formatClock(date)}`
  }

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (isSameDay(date, yesterday)) {
    return `Dün ${formatClock(date)}`
  }

  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function getAlertTimestamp(alert) {
  return alert.created_at ?? alert.createdAt ?? alert.timestamp ?? alert.updated_at
}

export function getDisplayLocation(alert) {
  return (
    alert.city ??
    alert.region ??
    alert.location ??
    alert.locationText ??
    alert.location_text ??
    ''
  )
}

export function getSourceUrl(alert) {
  return alert.source_url ?? alert.sourceUrl ?? ''
}

export function getSourceHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

export function extractTweetId(url = '') {
  try {
    const parsedUrl = new URL(url)
    const host = parsedUrl.hostname.replace(/^www\./, '').toLowerCase()

    if (!['x.com', 'twitter.com', 'mobile.twitter.com'].includes(host)) return null

    const match = parsedUrl.pathname.match(/\/status(?:es)?\/(\d+)/)
    return match?.[1] ?? null
  } catch {
    return null
  }
}

export function getSeverityTone(severity) {
  const tones = {
    critical: 'bg-red-400 shadow-red-500/40',
    green: 'bg-emerald-300 shadow-emerald-400/35',
    high: 'bg-orange-300 shadow-orange-400/35',
    medium: 'bg-amber-200 shadow-amber-300/35',
    red: 'bg-red-400 shadow-red-500/40',
    yellow: 'bg-amber-300 shadow-amber-300/35',
  }

  return tones[severity] ?? tones.green
}

export function severityLabel(severity) {
  const labels = {
    critical: 'Kritik',
    green: 'Yeşil',
    high: 'Yüksek',
    medium: 'Orta',
    red: 'Kırmızı',
    yellow: 'Sarı',
  }

  return labels[severity] ?? 'Bilgi'
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function formatClock(date) {
  return new Intl.DateTimeFormat('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
