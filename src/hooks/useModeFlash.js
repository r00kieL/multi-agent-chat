import { useEffect, useRef, useState } from 'react'

/** 模式切换时触发一次渐变扫光 */
export function useModeFlash(mode) {
  const [active, setActive] = useState(false)
  const prev = useRef(mode)

  useEffect(() => {
    if (prev.current === mode) return
    prev.current = mode
    setActive(true)
    const t = setTimeout(() => setActive(false), 520)
    return () => clearTimeout(t)
  }, [mode])

  return active
}
