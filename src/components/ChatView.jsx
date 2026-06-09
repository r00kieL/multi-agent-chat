import StreamText from "./StreamText.jsx";

export default function ChatView({
  question,
  reply = "",
  isStreaming = false,
}) {
  return (
    <div className="flex-1 flex flex-col px-4 sm:px-6 py-6 max-w-3xl mx-auto w-full">
      <div className="mb-6">
        <p className="text-xs text-text-muted mb-1">你的问题</p>
        <p className="text-[15px] text-text-primary m-0">{question}</p>
      </div>

      <article className="rounded-2xl bg-surface-input/80 ring-1 ring-border-subtle overflow-hidden">
        <header className="px-4 py-3 border-b border-border-subtle/60 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-warm shrink-0" />
          <span className="text-sm text-text-primary">Assistant</span>
          {isStreaming && (
            <span className="ml-auto text-xs text-text-muted animate-pulse">
              回复中
            </span>
          )}
        </header>
        
        <div className="px-4 py-4">
          <StreamText
            text={reply}
            isStreaming={isStreaming}
            emptyHint="正在思考…"
          />
        </div>
      </article>
    </div>
  );
}
