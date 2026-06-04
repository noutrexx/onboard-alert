import { Suspense } from 'react'
import { Tweet } from 'react-tweet'
import 'react-tweet/theme.css'
import { ExternalLink, Link2 } from 'lucide-react'
import { extractTweetId, getSourceHost } from '../utils/formatters'

function SourceEmbedder({ compact = false, sourceUrl }) {
  if (!sourceUrl) return null

  const tweetId = extractTweetId(sourceUrl)

  if (tweetId) {
    return (
      <div className={compact ? 'mt-3 max-h-[360px] overflow-hidden' : 'mt-3'}>
        <Suspense fallback={<TweetSkeleton compact={compact} />}>
          <Tweet id={tweetId} />
        </Suspense>
      </div>
    )
  }

  return <SourceLinkCard compact={compact} sourceUrl={sourceUrl} />
}

function SourceLinkCard({ compact, sourceUrl }) {
  const host = getSourceHost(sourceUrl)

  return (
    <div className="mt-3 border border-white/10 bg-white/[0.04] p-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Link2 size={14} />
        {host || 'Orijinal kaynak'}
      </div>
      {!compact ? (
        <p className="mt-2 text-xs leading-5 text-slate-500">
          Detaylı metin ve medya orijinal yayıncıda tutulur.
        </p>
      ) : null}
      <a
        className="mt-3 inline-flex w-full items-center justify-center gap-2 border border-cyan-300/40 bg-cyan-300/10 px-3 py-2 text-xs font-bold text-cyan-100 transition hover:bg-cyan-300/16"
        href={sourceUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        Orijinal Habere Git
        <ExternalLink size={14} />
      </a>
    </div>
  )
}

function TweetSkeleton({ compact }) {
  return (
    <div
      className={`border border-white/10 bg-white/[0.04] p-3 ${compact ? 'h-40' : 'h-56'}`}
    >
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 animate-pulse bg-white/10" />
        <div className="grid flex-1 gap-2">
          <div className="h-3 w-1/2 animate-pulse bg-white/10" />
          <div className="h-3 w-1/3 animate-pulse bg-white/10" />
        </div>
      </div>
      <div className="mt-5 grid gap-2">
        <div className="h-3 animate-pulse bg-white/10" />
        <div className="h-3 w-11/12 animate-pulse bg-white/10" />
        <div className="h-3 w-8/12 animate-pulse bg-white/10" />
      </div>
    </div>
  )
}

export default SourceEmbedder
