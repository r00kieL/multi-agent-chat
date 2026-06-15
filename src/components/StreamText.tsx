import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function StreamText({
  text,
  isStreaming = false,
  emptyHint = "等待回复…",
}) {
  const hasContent = text && text.length > 0;

  return (
    <div className="min-h-[120px] text-[15px] leading-relaxed text-text-primary/90 wrap-break-word">
      {hasContent ? (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
            strong: ({ children }) => (
              <strong className="font-semibold text-text-primary">
                {children}
              </strong>
            ),
            h1: ({ children }) => (
              <h1 className="text-xl font-semibold mt-4 mb-2">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-lg font-semibold mt-3 mb-2">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-base font-semibold mt-3 mb-1">{children}</h3>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="leading-relaxed">{children}</li>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-warm underline"
              >
                {children}
              </a>
            ),
            pre: ({ children }) => (
              <pre className="my-3 p-3 rounded-lg bg-surface overflow-x-auto text-sm">
                {children}
              </pre>
            ),
            code: ({ className, children, ...props }) => {
              const isBlock = className?.includes("language-");
              if (isBlock) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
              return (
                <code
                  className="px-1 py-0.5 rounded bg-surface text-sm"
                  {...props}
                >
                  {children}
                </code>
              );
            },
          }}
        >
          {text}
        </ReactMarkdown>
      ) : (
        <p className="m-0 text-text-muted italic">{emptyHint}</p>
      )}
      
      {isStreaming && hasContent && (
        <span
          className="inline-block w-0.5 h-[1em] ml-0.5 align-text-bottom bg-accent-warm animate-pulse"
          aria-hidden
        />
      )}
    </div>
  );
}
