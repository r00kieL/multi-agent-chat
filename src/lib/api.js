const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

export async function streamFromAgent(systemPrompt, messages, onChunk) {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  
  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // 你来写：
    // 1. decode value 追加到 buffer
    const text = decoder.decode(value, { stream: true });
    buffer += text;

    // 2. split('\n') + pop() 取出完整行
    const lines = buffer.split('\n');
    buffer = lines.pop();

    // 3. 每行检查是否以 'data: ' 开头
    // 4. 去掉前缀，如果是 '[DONE]' 就 return
    // 5. JSON.parse，取 choices[0].delta.content
    // 6. 有内容就调用 onChunk(content)
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      
      const raw = line.slice(6);
      if (raw === '[DONE]') return;

      const content = JSON.parse(raw).choices[0].delta.content;
      if (content) onChunk(content);
    }
  }
}