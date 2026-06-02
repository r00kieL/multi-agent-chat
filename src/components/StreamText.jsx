export default function StreamText({ text, isStreaming = false, emptyHint = '等待回复…' }) {
  const hasContent = text && text.length > 0

  return (
    <div className="min-h-[120px] text-[15px] leading-relaxed text-text-primary/90">
      {hasContent ? (
        <p className="whitespace-pre-wrap break-words m-0">{text}</p>
      ) : (
        <p className="m-0 text-text-muted italic">{emptyHint}</p>
      )}
      {isStreaming && hasContent && (
        <span
          className="inline-block w-0.5 h-[1em] ml-0.5 align-text-bottom bg-accent-warm animate-pulse"
          aria-hidden
        />
      )}
    </div>
  )
}
