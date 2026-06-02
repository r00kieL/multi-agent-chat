# Multi-Agent Chat

多 Agent 协作问答 Web 应用（React + Vite + Tailwind + DeepSeek API）。

## 本地运行

```bash
pnpm install
pnpm dev
```

环境变量（根目录 `.env`，勿提交）：

```
VITE_DEEPSEEK_API_KEY=你的密钥
```

## 目录

- `src/components/` — UI 组件
- `src/hooks/` — React hooks（后续 `useDiscussion` 等）
- `src/lib/` — API、流式解析、并发 runner（待实现）

项目规格见本地 `multi-agent-project.md`（已 gitignore）。
