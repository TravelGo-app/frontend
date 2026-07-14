import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface ChatVisibilityContextType {
  hideChat: boolean
  setHideChat: (hide: boolean) => void
}

const ChatVisibilityContext = createContext<ChatVisibilityContextType | null>(null)

export function ChatVisibilityProvider({ children }: { children: ReactNode }) {
  const [hideChat, setHideChat] = useState(false)

  return (
    <ChatVisibilityContext.Provider value={{ hideChat, setHideChat }}>
      {children}
    </ChatVisibilityContext.Provider>
  )
}

export function useChatVisibility() {
  const context = useContext(ChatVisibilityContext)
  if (!context) throw new Error('useChatVisibility debe usarse dentro de ChatVisibilityProvider')
  return context
}