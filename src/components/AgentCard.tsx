import StreamText from './StreamText'

const ROLE_STYLES = {
  critic: {
    label: '批判者',
    dot: 'bg-rose-400',
    ring: 'ring-rose-500/20',
    badge: 'bg-rose-500/10 text-rose-300',
  },
  optimist: {
    label: '乐观者',
    dot: 'bg-emerald-400',
    ring: 'ring-emerald-500/20',
    badge: 'bg-emerald-500/10 text-emerald-300',
  },
  pragmatist: {
    label: '务实者',
    dot: 'bg-sky-400',
    ring: 'ring-sky-500/20',
    badge: 'bg-sky-500/10 text-sky-300',
  },
}

export default function AgentCard({ role, text = '', isStreaming = false }) {
  const style = ROLE_STYLES[role] ?? ROLE_STYLES.critic

  return (
    <article
      className={`flex flex-col rounded-2xl bg-surface-input/80 ring-1 ${style.ring} overflow-hidden`}
    >
      <header className="flex items-center gap-2.5 px-4 py-3 border-b border-border-subtle/60">
        <span className={`w-2 h-2 rounded-full ${style.dot} shrink-0`} />
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${style.badge}`}>
          {style.label}
        </span>
        {isStreaming && (
          <span className="ml-auto text-xs text-text-muted animate-pulse">输出中</span>
        )}
      </header>
      <div className="flex-1 px-4 py-3 overflow-y-auto max-h-[420px]">
        <StreamText text={text} isStreaming={isStreaming} />
      </div>
    </article>
  )
}
