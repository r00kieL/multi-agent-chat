# Multi-Agent Chat

多 Agent 协作问答 Web 应用。支持普通对话与多视角讨论两种模式，通过 DeepSeek API 流式返回结果，并用 Markdown 渲染回复内容。

## 功能

### 对话模式（Chat）

- 单 Agent 快速问答
- 流式输出，末尾显示打字光标

### 讨论模式（Discussion）

- 三个 Agent 并行思考：**批判者**、**乐观者**、**务实者**
- 可配置讨论深度（1 / 2 / 3 轮）
- 讨论结束后由主持人 Agent 生成**综合结论**
- 实时展示各 Agent 输出与轮次进度

### 通用

- 深色主题 UI（Tailwind CSS）
- 回复内容 Markdown 渲染（标题、列表、加粗、链接、代码块等）
- 侧边栏快捷提示与新建会话

## 技术栈

- React 19 + Vite 8
- Tailwind CSS 4
- DeepSeek Chat API（SSE 流式）
- [react-markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm)

## 本地运行

```bash
pnpm install
pnpm dev
```

浏览器访问 Vite 输出的本地地址（通常为 `http://localhost:5173`）。

### 环境变量

根目录创建 `.env`（勿提交到 Git）：

```
VITE_DEEPSEEK_API_KEY=你的密钥
```

### 其他命令

```bash
pnpm build    # 生产构建
pnpm preview  # 预览构建产物
pnpm lint     # ESLint 检查
```

## 项目结构

```
src/
├── App.jsx                 # 路由式页面切换（首页 / 对话 / 讨论）
├── components/
│   ├── StreamText.jsx      # 流式文本 + Markdown 渲染
│   ├── ChatView.jsx        # 对话模式视图
│   ├── AgentGrid.jsx       # 三 Agent 卡片布局
│   ├── AgentCard.jsx       # 单个 Agent 输出
│   ├── Summary.jsx         # 综合结论
│   ├── InputPanel.jsx      # 输入框与模式切换
│   ├── Layout.jsx          # 侧边栏与页面框架
│   └── RoundIndicator.jsx  # 讨论轮次指示
├── hooks/
│   ├── useChat.js          # 对话模式状态与 API 调用
│   ├── useDiscussion.js    # 讨论模式：多 Agent 并发 + 总结
│   └── useModeFlash.js     # 模式切换动画
└── lib/
    └── api.js              # DeepSeek 流式 API 客户端
```

## 工作流程

**对话模式：** 用户提问 → `useChat` 调用 `streamFromAgent` → `StreamText` 流式展示回复。

**讨论模式：** 用户提问 → `useDiscussion` 并行启动三个 Agent → 按深度重复多轮 → 汇总各视角答案 → 主持人 Agent 生成综合结论。

流式数据在 `api.js` 中解析 SSE（`data: {...}`），通过 `onChunk` 回调逐段更新 React 状态。

## 部署

构建产物在 `dist/` 目录，可部署至 Vercel、Netlify 等静态托管平台。生产环境需在平台配置 `VITE_DEEPSEEK_API_KEY` 环境变量。
