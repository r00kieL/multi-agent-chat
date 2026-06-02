export default function RoundIndicator({ currentRound = 1, totalRounds = 1, status = 'idle' }) {
  if (status === 'idle') return null

  const progress = totalRounds > 0 ? (currentRound / totalRounds) * 100 : 0

  return (
    <div className="flex items-center gap-4 w-full max-w-3xl mx-auto mb-6">
      <div className="flex-1">
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-text-muted">
            {status === 'done' ? '讨论完成' : `第 ${currentRound} / ${totalRounds} 轮`}
          </span>
          <span className="text-text-muted tabular-nums">{Math.round(progress)}%</span>
        </div>
        <div className="h-1 rounded-full bg-surface-input overflow-hidden">
          <div
            className="h-full rounded-full bg-accent-warm transition-all duration-500 ease-out"
            style={{ width: `${status === 'done' ? 100 : progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
