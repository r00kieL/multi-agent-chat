# Multi-Agent Chat

多 Agent 协作问答 Web 应用。支持普通对话与多视角讨论两种模式，通过 DeepSeek API 流式返回结果，并用 Markdown 渲染回复内容。

## 功能

### 对话模式（Chat）

单 Agent 快速问答，流式输出回复。

### 讨论模式（Discussion）

三个 Agent 并行思考同一问题：

| 角色 | 关注点 |
|------|--------|
| 批判者 | 质疑前提、列出风险 |
| 乐观者 | 发掘机会与积极面 |
| 务实者 | 可落地步骤、资源与时间线 |

讨论结束后，主持人 Agent 综合三视角生成「综合结论」。讨论深度可选 1～3 轮（低 / 中 / 高）。

## 技术栈

- React 19 + Vite 8
- Tailwind CSS 4
- DeepSeek Chat Completions API（SSE 流式）
- [react-markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm)（GFM Markdown 渲染）

## 本地运行

```bash
pnpm install
pnpm dev
```

环境变量（根目录 `.env`，勿提交）：

```
VITE_DEEPSEEK_API_KEY=你的密钥
```

## 脚本

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 开发服务器 |
| `pnpm build` | 生产构建 |
| `pnpm preview` | 预览构建产物 |
| `pnpm lint` | ESLint 检查 |

## 目录结构

```
src/
├── App.jsx                 # 路由态：首页 / 对话 / 讨论
├── components/
│   ├── StreamText.jsx      # 流式文本 + Markdown 渲染
│   ├── ChatView.jsx        # 对话模式视图
│   ├── AgentGrid.jsx       # 三 Agent 卡片布局
│   ├── AgentCard.jsx       # 单个 Agent 输出
│   ├── Summary.jsx         # 综合结论
│   ├── InputPanel.jsx      # 输入与模式切换
│   ├── Layout.jsx          # 页面布局与侧边栏
│   └── RoundIndicator.jsx  # 讨论轮次指示
├── hooks/
│   ├── useChat.js          # 对话模式状态与 API 调用
│   ├── useDiscussion.js    # 讨论模式：并行 Agent + 总结
│   └── useModeFlash.js     # 模式切换动效
└── lib/
    └── api.js              # DeepSeek 流式 API 客户端
```

## 数据流

```
用户输入 → useChat / useDiscussion
              ↓
         streamFromAgent（SSE 解析）
              ↓
         StreamText（react-markdown 渲染）
```

项目规格见本地 `multi-agent-project.md`（已 gitignore）。
