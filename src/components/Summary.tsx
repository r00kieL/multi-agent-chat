import StreamText from './StreamText'

export default function Summary({ text = '', isStreaming = false, visible = false }) {
  if (!visible && !text) return null

  return (
    <section className="w-full mt-8 rounded-2xl bg-surface-input/60 ring-1 ring-border-subtle overflow-hidden">
      <header className="px-5 py-3.5 border-b border-border-subtle/80 flex items-center gap-2">
        <span className="text-accent-warm">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7-6-4.6h7.6L12 2z" />
          </svg>
        </span>
        <h2 className="text-sm font-medium text-text-primary m-0">综合结论</h2>
        {isStreaming && (
          <span className="ml-auto text-xs text-text-muted animate-pulse">汇总中</span>
        )}
      </header>
      <div className="px-5 py-4">
        <StreamText
          text={text}
          isStreaming={isStreaming}
          emptyHint="讨论结束后将在此生成综合结论…"
        />
      </div>
    </section>
  )
}
