import { useState, useMemo } from "react";
import Layout from "./components/Layout";
import InputPanel from "./components/InputPanel";
import AgentGrid from "./components/AgentGrid";
import RoundIndicator from "./components/RoundIndicator";
import Summary from "./components/Summary";
import ChatView from "./components/ChatView";
import useChat from "./hooks/useChat";
import useDiscussion from "./hooks/useDiscussion";

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

export default function App() {
  const [question, setQuestion] = useState("");
  const [inputMode, setInputMode] = useState("chat");
  const [depth, setDepth] = useState("medium");
  const [sessionType, setSessionType] = useState(null);

  const discussion = useDiscussion();
  const chat = useChat();

  const greeting = useMemo(() => getGreeting(), []);

  const isHome = sessionType === null;
  const isDiscussionSession = sessionType === "discussion";
  const isChatSession = sessionType === "chat";
  const isRunning =
    (isDiscussionSession && discussion.status === "running") ||
    (isChatSession && chat.status === "running");

  const homeCopy = HOME_COPY[inputMode];

  const handleSubmit = () => {
    if (!question.trim()) return;
    const q = question.trim();

    if (inputMode === "discussion") {
      setSessionType("discussion");
      discussion.startDiscussion(q, depth);
    } else {
      setSessionType("chat");
      chat.startChat(q);
    }
  };

  const handleNewChat = () => {
    chat.reset();
    discussion.reset();

    setSessionType(null);
    setQuestion("");
    setInputMode("chat");
    setDepth("medium");
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
            reply={chat.reply}
            isStreaming={chat.status === "running"}
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
            currentRound={discussion.currentRound}
            totalRounds={discussion.totalRounds}
            status={discussion.status}
          />

          <AgentGrid
            agents={discussion.agents}
            streaming={discussion.streaming}
          />

          <Summary
            text={discussion.summary}
            visible={
              discussion.status === "done" || discussion.summary.length > 0
            }
            isStreaming={isRunning && !discussion.summary}
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
