import api from './api'

const CHAT_SESSION_STORAGE_KEY = 'travelgo_chat_session_id'

export type ChatReplyResponse = {
  reply: string
}

function createSessionId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `chat-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function getChatSessionId() {
  let sessionId = sessionStorage.getItem(CHAT_SESSION_STORAGE_KEY)

  if (!sessionId) {
    sessionId = createSessionId()
    sessionStorage.setItem(CHAT_SESSION_STORAGE_KEY, sessionId)
  }

  return sessionId
}

export function resetChatSession() {
  sessionStorage.removeItem(CHAT_SESSION_STORAGE_KEY)
}

export async function sendChatMessage(message: string) {
  const sessionId = getChatSessionId()

  const response = await api.post<ChatReplyResponse>('/chat', {
    sessionId,
    message,
  })

  return response.data.reply
}
