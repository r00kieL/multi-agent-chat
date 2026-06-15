import { useState } from "react";
import { streamFromAgent } from "../lib/api";

export default function useChat() {
  const [status, setStatus] = useState("idle");
  const [reply, setReply] = useState("");

  const reset = () => {
    setStatus("idle");
    setReply("");
  };

  const startChat = async (question) => {
    setStatus("running");
    setReply("");

    await streamFromAgent(
      '根据用户输入的语言回答用户的问题',
      [{ role: 'user', content: question }],
      (content) => {
        setReply(prev => prev + content);
      }
    )

    setStatus("done");
  };

  return {
    status,
    reply,
    reset,
    startChat,
  };
}
