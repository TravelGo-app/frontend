import { type FormEvent, useEffect, useRef, useState } from 'react'
import { sendChatMessage } from '../services/chatService'

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  text: string
}

function createMessageId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

const initialMessages: ChatMessage[] = [
  {
    id: 'welcome-message',
    role: 'assistant',
    text: 'Hola, soy el asistente de TravelGo. Puedo ayudarte con la app, transferencias, saldos, divisas, cuenta y operaciones dentro de TravelGo.',
  },
]

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, isOpen])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const cleanMessage = message.trim()

    if (!cleanMessage || isSending) {
      return
    }

    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: 'user',
      text: cleanMessage,
    }

    setMessages((currentMessages) => [...currentMessages, userMessage])
    setMessage('')
    setIsSending(true)

    try {
      const reply = await sendChatMessage(cleanMessage)

      const assistantMessage: ChatMessage = {
        id: createMessageId(),
        role: 'assistant',
        text: reply,
      }

      setMessages((currentMessages) => [...currentMessages, assistantMessage])
    } catch {
      const errorMessage: ChatMessage = {
        id: createMessageId(),
        role: 'assistant',
        text: 'No pude responder en este momento. Intentá nuevamente en unos segundos.',
      }

      setMessages((currentMessages) => [...currentMessages, errorMessage])
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[999] flex flex-col items-end gap-3">
      {isOpen && (
        <section className="flex h-[500px] max-h-[70vh] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
          <header className="flex-shrink-0 bg-grafito px-5 py-4 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-arena">
              TravelGo
            </p>
            <h2 className="text-lg font-bold">Asistente virtual</h2>
            <p className="text-sm text-slate-200">
              Consultas sobre la app, wallet, divisas y transferencias.
            </p>
          </header>

          <div
            ref={messagesRef}
            className="flex flex-1 flex-col gap-3 overflow-y-auto bg-slate-50 px-4 py-4"
          >
            {messages.map((item) => (
              <div
                key={item.id}
                className={
                  item.role === 'user'
                    ? 'ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-oceano px-4 py-3 text-sm text-white shadow-sm'
                    : 'mr-auto max-w-[85%] rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-sm text-slate-700 shadow-sm'
                }
              >
                {item.text}
              </div>
            ))}

            {isSending && (
              <div className="mr-auto rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
                TravelGo está escribiendo...
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-shrink-0 gap-2 border-t border-slate-200 bg-white p-3">
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={1500}
              placeholder="Escribí tu consulta..."
              className="min-w-0 flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-800 outline-none transition focus:border-oceano focus:ring-2 focus:ring-oceano/20"
            />
            <button
              type="submit"
              disabled={isSending || !message.trim()}
              className="rounded-full bg-coral px-4 py-2 text-sm font-semibold text-white transition hover:bg-terracota disabled:cursor-not-allowed disabled:opacity-50"
            >
              Enviar
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        aria-label={isOpen ? 'Cerrar chat de TravelGo' : 'Abrir chat de TravelGo'}
        className="flex h-14 min-w-14 items-center justify-center rounded-full bg-coral px-5 text-sm font-bold text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-terracota"
      >
        {isOpen ? 'Cerrar' : 'Chat'}
      </button>
    </div>
  )
}