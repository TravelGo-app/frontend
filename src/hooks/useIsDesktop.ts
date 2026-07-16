import { useEffect, useState } from 'react'

// Mismo breakpoint que usa Tailwind para "md" (768px). Detecta el viewport
// real con matchMedia, para poder montar UNA sola interfaz (desktop o
// mobile) en vez de montar las dos y ocultar una con CSS — evita que
// existan dos instancias de GoogleLoginButton al mismo tiempo.
const QUERY = '(min-width: 768px)'

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(QUERY).matches : true,
  )

  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)

    mql.addEventListener('change', handler)
    setIsDesktop(mql.matches)

    return () => mql.removeEventListener('change', handler)
  }, [])

  return isDesktop
}