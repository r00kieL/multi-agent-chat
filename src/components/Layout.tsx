import { useState } from 'react'
import { IconPanel, IconSearch, IconMessage, IconSpark } from './icons'

const NAV_ITEMS = [
  { id: 'chats', label: '讨论', icon: IconMessage },
  { id: 'starred', label: '收藏', icon: IconSpark },
]

const PLACEHOLDER_CHATS = [
  '远程工作是否值得全面推行',
  '学习 AI 应该先学理论还是实践',
  '创业公司如何平衡速度与质量',
]

const QUICK_PROMPTS = [
  { label: '分析', hint: '帮我分析一个决策' },
  { label: '对比', hint: '对比两种方案的利弊' },
  { label: '规划', hint: '制定一个 30 天学习计划' },
  { label: '复盘', hint: '复盘这次项目的问题' },
]

function Sidebar({ collapsed, onToggle, onNewChat }) {
  return (
    <aside
      className={`${
        collapsed ? 'w-0 -ml-px overflow-hidden' : 'w-[260px]'
      } shrink-0 flex flex-col bg-surface border-r border-border-subtle transition-[width] duration-200`}
    >
      <div className="flex items-center justify-between px-4 h-14 shrink-0">
        <div className="flex items-center gap-2 font-medium text-text-primary">
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-accent-warm/20 text-accent-warm">
            <IconSpark className="w-4 h-4" />
          </span>
          <span className="text-sm tracking-tight">Multi-Agent</span>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 lg:hidden"
          aria-label="收起侧边栏"
        >
          <IconPanel />
        </button>
      </div>

      <div className="px-3 mb-2">
        <button
          type="button"
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-text-primary bg-white/5 hover:bg-white/10 transition-colors border border-border-subtle/80"
        >
          <span className="text-lg leading-none">+</span>
          新讨论
        </button>
      </div>

      <div className="px-3 mb-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/20 text-text-muted text-sm">
          <IconSearch />
          <span>搜索讨论</span>
        </div>
      </div>

      <nav className="px-2 space-y-0.5">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-6 px-4 flex-1 min-h-0 overflow-y-auto">
        <p className="text-xs text-text-muted mb-2 px-1">最近</p>
        <ul className="space-y-0.5">
          {PLACEHOLDER_CHATS.map((title) => (
            <li key={title}>
              <button
                type="button"
                className="w-full text-left px-2 py-1.5 rounded-lg text-sm text-text-muted hover:text-text-primary hover:bg-white/5 truncate transition-colors"
              >
                {title}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 border-t border-border-subtle shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-warm to-rose-600 flex items-center justify-center text-xs font-medium text-white">
            U
          </div>
          <div className="min-w-0">
            <p className="text-sm text-text-primary truncate m-0">用户</p>
            <p className="text-xs text-text-muted m-0">多 Agent 讨论</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default function Layout({
  children,
  onNewChat,
  quickPrompts,
  onQuickPrompt,
  showQuickPrompts = true,
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-svh overflow-hidden">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
        onNewChat={onNewChat}
      />

      <div className="flex-1 flex flex-col min-w-0 bg-surface-elevated">
        <header className="flex items-center h-14 px-4 shrink-0 lg:hidden border-b border-border-subtle/60">
          <button
            type="button"
            onClick={() => setSidebarCollapsed((c) => !c)}
            className="p-2 rounded-lg text-text-muted hover:bg-white/5"
            aria-label="打开侧边栏"
          >
            <IconPanel />
          </button>
          <span className="ml-2 text-sm font-medium">Multi-Agent</span>
        </header>

        <main className="flex-1 overflow-y-auto flex flex-col">{children}</main>

        {showQuickPrompts && onQuickPrompt && (
          <div className="shrink-0 pb-6 px-4 flex flex-wrap justify-center gap-2 max-w-3xl mx-auto w-full">
            {(quickPrompts ?? QUICK_PROMPTS).map(({ label, hint }) => (
              <button
                key={label}
                type="button"
                onClick={() => onQuickPrompt(hint)}
                className="px-4 py-2 rounded-full text-sm text-text-muted border border-border-subtle hover:border-text-muted/50 hover:text-text-primary hover:bg-white/5 transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
