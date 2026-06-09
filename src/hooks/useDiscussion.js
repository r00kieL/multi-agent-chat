import { useState } from "react";

const DEPTH_ROUNDS = {
  low: 1,
  medium: 2,
  high: 3,
};

export default function useDiscussion() {
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