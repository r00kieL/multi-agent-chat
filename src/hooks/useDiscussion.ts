import { useState } from "react";
import { streamFromAgent } from "../lib/api";

const DEPTH_ROUNDS = {
  low: 1,
  medium: 2,
  high: 3,
};

const AGENT_PROMPTS = [
  '扮演“批判者”的角色。针对用户的问题，需要先质疑前提是否成立，并列出关键风险点。使用与用户提问相同的语言回答，语气理性、直接。',
  '扮演“乐观者”的角色。针对用户的问题，需要发掘机会与积极面，并说明为何仍值得尝试。使用与用户提问相同的语言回答，语气积极但有依据。',
  '扮演“务实者”的角色。针对用户的问题，需要给出可落地行动方案，拆成具体步骤，并说明资源、时间线与衡量指标。使用与用户提问相同的语言回答，语气简洁、重执行。',
];
const AGENT_LABELS = ["批判者视角：", "乐观者视角：", "务实者视角："];
const SUMMARY_SYSTEM_PROMPT = `
  你是多 Agent 讨论的主持人。请综合用户的问题，以及提供的三个视角进行回答，给出一份简洁的综合结论。
  
  【输出要求】
  1. 使用与用户原始问题相同的语言回答。
  2. 严格按以下结构输出，不要添加多余开场白或 markdown 标题：
    - 先分别用一句话概括各视角要点，格式为：
      批判者的重点在……
      乐观者的重点在……
      务实者的重点在……
    - 另起一行，以「综上：」开头，给出综合建议（兼顾风险、机会与可执行性）。
  3. 各视角概括须基于上文内容，不要编造未出现的观点。
  4. 「综上」部分控制在 2～4 句话，具体、可行动。
`;

export default function useDiscussion() {
  const [status, setStatus] = useState("idle");

  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(1);

  const [streaming, setStreaming] = useState([false, false, false]);
  const [agents, setAgents] = useState(["", "", ""]);
  const [summary, setSummary] = useState("");

  const reset = () => {
    setStatus("idle");
    setCurrentRound(1);
    setAgents(["", "", ""]);
    setStreaming([false, false, false]);
    setSummary("");
  };

  const summaryDiscussion = async (question, answers) => {
    setSummary("");

    const formatted = [
      `用户问题：${question}`,
      ...answers.map((answer, i) => `${AGENT_LABELS[i]}${answer}`),
    ].join("\n");

    await streamFromAgent(
      SUMMARY_SYSTEM_PROMPT,
      [{ role: 'user', content: formatted }],
      (content) => {
        setSummary(prev => prev + content);
      }
    )

    setStatus("done");
  };

  const startDiscussion = async (question, depth) => {
    const rounds = DEPTH_ROUNDS[depth] ?? 2;

    setTotalRounds(rounds);
    setCurrentRound(1);
    setStatus("running");
    setAgents(["", "", ""]);
    setStreaming([true, true, true]);
    setSummary("");

    let roundAnswers = ["", "", ""];
    for (let round = 1; round <= rounds; round++) {
      await Promise.all([
        streamFromAgent(
          AGENT_PROMPTS[0],
          [{ role: 'user', content: question }],
          (content) => {
            roundAnswers[0] += content;
            setAgents(prev => {
              const newAgents = [...prev];
              newAgents[0] += content;
              return newAgents;
            });
          }
        ),
        streamFromAgent(
          AGENT_PROMPTS[1],
          [{ role: 'user', content: question }],
          (content) => {
            roundAnswers[1] += content;
            setAgents(prev => {
              const newAgents = [...prev];
              newAgents[1] += content;
              return newAgents;
            });
          }
        ), streamFromAgent(
          AGENT_PROMPTS[2],
          [{ role: 'user', content: question }],
          (content) => {
            roundAnswers[2] += content;
            setAgents(prev => {
              const newAgents = [...prev];
              newAgents[2] += content;
              return newAgents;
            });
          }
        )
      ]);

      setCurrentRound(round);
    }

    await summaryDiscussion(question, roundAnswers);
    setStreaming([false, false, false]);
  };

  return {
    status,
    currentRound,
    totalRounds,
    agents,
    streaming,
    summary,
    reset,
    startDiscussion,
  };
}
