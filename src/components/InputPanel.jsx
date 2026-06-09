import { useRef, useLayoutEffect, useState, useCallback } from "react";
import { IconPlus, IconSend } from "./icons.jsx";
import { useModeFlash } from "../hooks/useModeFlash.js";

const MODE_OPTIONS = [
  { value: "chat", label: "Chat" },
  { value: "discussion", label: "Discussion" },
];

const DEPTH_OPTIONS = [
  { value: "low", label: "Low", desc: "1 轮" },
  { value: "medium", label: "Medium", desc: "2 轮" },
  { value: "high", label: "High", desc: "3 轮" },
];

const PLACEHOLDERS = {
  chat: "输入你的问题…",
  discussion: "输入你的问题，三个 Agent 将从不同角度展开讨论…",
};

function ModeToggle({ mode, onModeChange, disabled, lockMode }) {
  const containerRef = useRef(null);
  const btnRefs = useRef([]);
  const [pill, setPill] = useState({ width: 0, left: 0 });

  const activeIndex = MODE_OPTIONS.findIndex((o) => o.value === mode);

  const updatePill = useCallback(() => {
    const btn = btnRefs.current[activeIndex];
    const container = containerRef.current;
    if (!btn || !container) return;
    setPill({ width: btn.offsetWidth, left: btn.offsetLeft });
  }, [activeIndex]);

  useLayoutEffect(() => {
    updatePill();
  }, [mode, updatePill]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(updatePill);
    ro.observe(container);
    btnRefs.current.forEach((btn) => {
      if (btn) ro.observe(btn);
    });
    return () => ro.disconnect();
  }, [updatePill]);

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-stretch gap-0.5 p-0.5 rounded-lg bg-black/20 shrink-0"
    >
      {pill.width > 0 && (
        <span
          className="absolute top-0.5 bottom-0.5 rounded-md bg-white/10 transition-[left,width] duration-300 ease-out pointer-events-none"
          style={{ width: pill.width, left: pill.left }}
          aria-hidden
        />
      )}
      {MODE_OPTIONS.map((opt, index) => (
        <button
          key={opt.value}
          ref={(el) => {
            btnRefs.current[index] = el;
          }}
          type="button"
          disabled={disabled || lockMode}
          onClick={() => onModeChange?.(opt.value)}
          className={`relative z-1 px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors duration-300 disabled:opacity-40 ${
            mode === opt.value
              ? "text-text-primary"
              : "text-text-muted hover:text-text-primary"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function DepthToggle({ depth, onDepthChange, disabled, className = "" }) {
  return (
    <div
      className={`flex items-center gap-1 p-0.5 rounded-lg bg-black/20 ${className}`}
    >
      {DEPTH_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          disabled={disabled}
          onClick={() => onDepthChange?.(opt.value)}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors disabled:opacity-40 ${
            depth === opt.value
              ? "bg-white/10 text-text-primary"
              : "text-text-muted hover:text-text-primary"
          }`}
          title={opt.desc}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function InputPanel({
  question = "",
  onQuestionChange,
  mode = "chat",
  onModeChange,
  depth = "medium",
  onDepthChange,
  onSubmit,
  disabled = false,
  lockMode = false,
  compact = false,
  placeholder,
}) {
  const textareaRef = useRef(null);
  const flash = useModeFlash(mode);
  const isDiscussion = mode === "discussion";
  const resolvedPlaceholder =
    placeholder ?? PLACEHOLDERS[mode] ?? PLACEHOLDERS.chat;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && question.trim()) onSubmit?.();
    }
  };

  const handleSubmit = () => {
    if (!disabled && question.trim()) onSubmit?.();
  };

  return (
    <div className={`w-full ${compact ? "max-w-3xl" : "max-w-2xl"} mx-auto`}>
      <div
        className={`relative rounded-3xl bg-surface-input ring-1 ring-border-subtle shadow-lg shadow-black/20 transition-shadow duration-300 ${
          flash ? "ring-accent-warm/25" : ""
        } ${compact ? "rounded-2xl" : ""}`}
      >
        {flash && <div className="mode-flash-overlay" aria-hidden />}

        <div className="px-4 pt-4 pb-2">
          <textarea
            ref={textareaRef}
            value={question}
            onChange={(e) => onQuestionChange?.(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            rows={compact ? 2 : 3}
            placeholder={resolvedPlaceholder}
            className="relative z-1 w-full resize-none bg-transparent text-[15px] text-text-primary placeholder:text-text-muted placeholder:transition-opacity placeholder:duration-300 outline-none disabled:opacity-50 min-h-[72px]"
          />
        </div>

        <div className="relative z-1 flex items-center justify-between gap-3 px-3 pb-3">
          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <button
              type="button"
              disabled={disabled}
              className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors disabled:opacity-40 shrink-0"
              aria-label="附加"
            >
              <IconPlus />
            </button>

            <div className="hidden sm:flex items-center gap-2">
              <ModeToggle
                mode={mode}
                onModeChange={onModeChange}
                disabled={disabled}
                lockMode={lockMode}
              />
              <div className="mode-depth-panel" data-open={isDiscussion}>
                <div className="mode-depth-inner">
                  <DepthToggle
                    depth={depth}
                    onDepthChange={onDepthChange}
                    disabled={disabled}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={disabled || !question.trim()}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-accent-warm text-white hover:brightness-110 transition disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            aria-label="发送"
          >
            <IconSend className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 移动端：模式 + 强度 */}
      <div className="flex sm:hidden flex-col items-center gap-2 mt-3">
        <ModeToggle
          mode={mode}
          onModeChange={onModeChange}
          disabled={disabled}
          lockMode={lockMode}
        />
        <div className="mode-depth-panel w-full" data-open={isDiscussion}>
          <div className="mode-depth-inner flex justify-center gap-2 flex-wrap">
            {DEPTH_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                disabled={disabled}
                onClick={() => onDepthChange?.(opt.value)}
                className={`px-3 py-1 rounded-full text-xs border transition-colors disabled:opacity-40 ${
                  depth === opt.value
                    ? "border-accent-warm/50 text-text-primary bg-accent-warm/10"
                    : "border-border-subtle text-text-muted"
                }`}
              >
                {opt.label} · {opt.desc}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
