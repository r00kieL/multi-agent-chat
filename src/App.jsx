import { useState, useMemo } from "react";
import Layout from "./components/Layout.jsx";
import InputPanel from "./components/InputPanel.jsx";
import AgentGrid from "./components/AgentGrid.jsx";
import RoundIndicator from "./components/RoundIndicator.jsx";
import Summary from "./components/Summary.jsx";
import ChatView from "./components/ChatView.jsx";

const DEPTH_ROUNDS = { low: 1, medium: 2, high: 3 };

const HOME_COPY = {
  chat: {
    title: (greeting) => `${greeting}，今天想聊点什么？`,
    subtitle: "普通对话模式，快速获得回答",
  },
  discussion: {
    title: (greeting) => `${greeting}，今天想讨论什么？`,
    subtitle:
      "批判者、乐观者、务实者将同时思考你的问题，多轮讨论后给出综合结论",
  },
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "早上好";
  if (hour < 18) return "下午好";
  return "晚上好";
}

function useDemoDiscussion() {
  const [status, setStatus] = useState("idle");
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(1);
  const [agents, setAgents] = useState(["", "", ""]);
  const [streaming, setStreaming] = useState([false, false, false]);
  const [summary, setSummary] = useState("");

  const reset = () => {
    setStatus("idle");
    setCurrentRound(1);
    setAgents(["", "", ""]);
    setStreaming([false, false, false]);
    setSummary("");
  };

  const startDemo = (question, depth) => {
    const rounds = DEPTH_ROUNDS[depth] ?? 2;
    setTotalRounds(rounds);
    setStatus("running");
    setCurrentRound(1);
    setAgents(["", "", ""]);
    setStreaming([true, true, true]);
    setSummary("");

    const samples = [
      `【批判者】针对「${question.slice(0, 20)}…」：需要先质疑前提是否成立，并列出关键风险点。`,
      `【乐观者】同一问题也存在机会窗口，可以从小规模试点验证假设。`,
      `【务实者】建议拆成可执行步骤：目标、资源、时间线、衡量指标。`,
    ];

    let step = 0;
    const tick = setInterval(() => {
      setAgents((prev) => {
        const next = [...prev];
        const idx = step % 3;
        next[idx] = samples[idx].slice(
          0,
          Math.min(samples[idx].length, (prev[idx].length || 0) + 8),
        );
        return next;
      });
      step += 1;
      if (step > 40) {
        clearInterval(tick);
        setAgents(samples);
        setStreaming([false, false, false]);
        setStatus("done");
        setSummary(
          `综合三个视角：对「${question}」建议采取「先验证、再投入」的策略——批判者提示风险，乐观者保留探索空间，务实者给出分阶段落地路径。（此为 UI 演示文案，接入 API 后替换）`,
        );
      }
    }, 120);
  };

  return {
    status,
    currentRound,
    totalRounds,
    agents,
    streaming,
    summary,
    reset,
    startDemo,
  };
}

function useDemoChat() {
  const [status, setStatus] = useState("idle");
  const [reply, setReply] = useState("");

  const reset = () => {
    setStatus("idle");
    setReply("");
  };

  const startDemo = (question) => {
    setStatus("running");
    setReply("");
    const full = `关于「${question}」：这是一个简洁的单轮回复演示。接入 API 后，Chat 模式将直接调用模型回答，不经过多 Agent 讨论。（演示文案）`;
    let i = 0;
    const tick = setInterval(() => {
      i += 4;
      setReply(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(tick);
        setStatus("done");
      }
    }, 80);
  };

  return { status, reply, reset, startDemo };
}

export default function App() {
  const [question, setQuestion] = useState("");
  const [inputMode, setInputMode] = useState("chat");
  const [depth, setDepth] = useState("medium");
  const [sessionType, setSessionType] = useState(null);

  const demo = useDemoDiscussion();
  const chatDemo = useDemoChat();

  const greeting = useMemo(() => getGreeting(), []);
  const isHome = sessionType === null;
  const isDiscussionSession = sessionType === "discussion";
  const isChatSession = sessionType === "chat";
  const isRunning =
    (isDiscussionSession && demo.status === "running") ||
    (isChatSession && chatDemo.status === "running");

  const homeCopy = HOME_COPY[inputMode];

  const handleSubmit = () => {
    if (!question.trim()) return;
    const q = question.trim();

    if (inputMode === "discussion") {
      setSessionType("discussion");
      demo.startDemo(q, depth);
    } else {
      setSessionType("chat");
      chatDemo.startDemo(q);
    }
  };

  const handleNewChat = () => {
    demo.reset();
    chatDemo.reset();
    setSessionType(null);
    setQuestion("");
    setInputMode("chat");
  };

  const handleQuickPrompt = (hint) => {
    setQuestion(hint);
  };

  return (
    <Layout
      onNewChat={handleNewChat}
      onQuickPrompt={handleQuickPrompt}
      showQuickPrompts={isHome}
    >
      {isHome ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 min-h-[60vh]">
          <div key={inputMode} className="mb-10 text-center mode-content-enter">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent-warm/15 text-accent-warm mb-4 transition-colors duration-300">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="4" />
                <path
                  d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-text-primary font-medium m-0 tracking-tight">
              {homeCopy.title(greeting)}
            </h1>
            <p className="mt-3 text-text-muted text-sm max-w-md mx-auto">
              {homeCopy.subtitle}
            </p>
          </div>

          <InputPanel
            question={question}
            onQuestionChange={setQuestion}
            mode={inputMode}
            onModeChange={setInputMode}
            depth={depth}
            onDepthChange={setDepth}
            onSubmit={handleSubmit}
          />
        </div>
      ) : isChatSession ? (
        <>
          <ChatView
            question={question}
            reply={chatDemo.reply}
            isStreaming={chatDemo.status === "running"}
          />
          <div className="shrink-0 px-4 pb-6 max-w-3xl mx-auto w-full">
            <InputPanel
              compact
              question={question}
              onQuestionChange={setQuestion}
              mode="chat"
              lockMode
              onSubmit={handleSubmit}
              disabled={isRunning}
              placeholder="继续输入…"
            />
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col px-4 sm:px-6 py-6 max-w-7xl mx-auto w-full">
          <div className="mb-4 px-1">
            <p className="text-sm text-text-muted m-0 line-clamp-2">
              <span className="text-text-primary/80">问题：</span>
              {question}
            </p>
          </div>

          <RoundIndicator
            currentRound={demo.currentRound}
            totalRounds={demo.totalRounds}
            status={demo.status}
          />

          <AgentGrid agents={demo.agents} streaming={demo.streaming} />

          <Summary
            text={demo.summary}
            visible={demo.status === "done" || demo.summary.length > 0}
            isStreaming={isRunning && !demo.summary}
          />

          <div className="mt-8 sticky bottom-0 pb-4 bg-linear-to-t from-surface-elevated via-surface-elevated to-transparent pt-6">
            <InputPanel
              compact
              question={question}
              onQuestionChange={setQuestion}
              mode="discussion"
              lockMode
              depth={depth}
              onDepthChange={setDepth}
              onSubmit={handleSubmit}
              disabled={isRunning}
              placeholder="讨论进行中…完成后可发起新讨论"
            />
          </div>
        </div>
      )}
    </Layout>
  );
}
