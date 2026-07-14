import { type FormEvent, useEffect, useRef, useState } from 'react'
import { sendChatMessage } from '../services/chatService'
import logoImg from '../assets/PosibleLogo.png'

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  text: string
}

interface ChatbotWidgetProps {
  compact?: boolean
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

const GRADIENT = 'bg-gradient-to-r from-[#2A9BB5] to-[#F26A2E]'
const DRAG_THRESHOLD = 5 // px: por debajo de esto se considera "click", no "arrastre"

export default function ChatbotWidget({ compact = false }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesRef = useRef<HTMLDivElement | null>(null)

  // Posición arrastrable del botón/panel flotante (solo en modo normal, no compacto)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const dragState = useRef({ startX: 0, startY: 0, originX: 0, originY: 0, dragging: false, moved: false })
  const wrapperRef = useRef<HTMLDivElement | null>(null)

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

  function clampOffset(x: number, y: number) {
    if (!wrapperRef.current) return { x, y }
    const rect = wrapperRef.current.getBoundingClientRect()
    // Límites: no dejar que el wrapper se salga de la pantalla (con 8px de margen)
    const minX = -(rect.left - dragOffset.x) + 8
    const maxX = window.innerWidth - rect.right + dragOffset.x - 8
    const minY = -(rect.top - dragOffset.y) + 8
    const maxY = window.innerHeight - rect.bottom + dragOffset.y - 8
    return {
      x: Math.min(Math.max(x, minX), maxX),
      y: Math.min(Math.max(y, minY), maxY),
    }
  }

  function handlePointerDown(event: React.PointerEvent) {
    if (compact) return // en modo compacto no se arrastra
    dragState.current.startX = event.clientX
    dragState.current.startY = event.clientY
    dragState.current.originX = dragOffset.x
    dragState.current.originY = dragOffset.y
    dragState.current.dragging = true
    dragState.current.moved = false
    ;(event.target as HTMLElement).setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event: React.PointerEvent) {
    if (!dragState.current.dragging) return
    const deltaX = event.clientX - dragState.current.startX
    const deltaY = event.clientY - dragState.current.startY

    if (Math.abs(deltaX) > DRAG_THRESHOLD || Math.abs(deltaY) > DRAG_THRESHOLD) {
      dragState.current.moved = true
    }

    if (dragState.current.moved) {
      const next = clampOffset(dragState.current.originX + deltaX, dragState.current.originY + deltaY)
      setDragOffset(next)
    }
  }

  function handlePointerUp() {
    dragState.current.dragging = false
  }

  function handleToggleClick() {
    // Si el puntero se movió más que el umbral, fue un arrastre: no abrir/cerrar el chat
    if (dragState.current.moved) {
      dragState.current.moved = false
      return
    }
    setIsOpen((currentValue) => !currentValue)
  }

  const chatPanel = (
    <section
      className={
        compact
          ? 'flex h-[700px] max-h-[90vh] w-full max-w-[420px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl md:h-[460px] md:max-h-[68vh] md:w-[320px]'
          : 'flex h-[460px] max-h-[68vh] w-[calc(100vw-2.5rem)] max-w-[320px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl'
      }
    >
      <header className={`flex flex-shrink-0 items-start justify-between px-4 py-3 text-white ${GRADIENT}`}>
        <div className="flex items-center gap-2">
          <img src={logoImg} alt="TravelGo" className="h-9 w-9 flex-shrink-0 object-contain" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
              TravelGo
            </p>
            <h2 className={compact ? 'text-base font-bold' : 'text-lg font-bold'}>
              Asistente virtual
            </h2>
            {!compact && (
              <p className="text-sm text-white/90">
                Consultas sobre la app, wallet, divisas y transferencias.
              </p>
            )}
          </div>
        </div>
        {compact && (
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar chat"
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
          >
            ✕
          </button>
        )}
      </header>

      <div
        ref={messagesRef}
        className="flex flex-1 flex-col gap-3 overflow-y-auto bg-[#faf9f7] px-3 py-3"
      >
        {messages.map((item) => (
          <div
            key={item.id}
            className={
              item.role === 'user'
                ? 'ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-[#F26A2E] px-3 py-2 text-sm text-white shadow-sm'
                : 'mr-auto max-w-[85%] rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-sm text-slate-700 shadow-sm'
            }
          >
            {item.text}
          </div>
        ))}

        {isSending && (
          <div className="mr-auto rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-sm text-slate-500 shadow-sm">
            TravelGo está escribiendo...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-shrink-0 gap-2 border-t border-slate-200 bg-white p-2">
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={1500}
          placeholder="Escribí tu consulta..."
          className="min-w-0 flex-1 rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#2A9BB5] focus:ring-2 focus:ring-[#2A9BB5]/20"
        />
        <button
          type="submit"
          disabled={isSending || !message.trim()}
          className={`rounded-full px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${GRADIENT}`}
        >
          Enviar
        </button>
      </form>
    </section>
  )

  const toggleButton = (
    <button
      type="button"
      onClick={handleToggleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      aria-label={isOpen ? 'Cerrar chat de TravelGo' : 'Abrir chat de TravelGo'}
      className={`flex h-14 min-w-14 items-center justify-center rounded-full px-5 text-sm font-bold text-white shadow-xl transition hover:-translate-y-0.5 hover:opacity-90 touch-none select-none ${
        compact ? '' : 'cursor-grab active:cursor-grabbing'
      } ${GRADIENT}`}
    >
      {isOpen ? 'Cerrar' : 'Chat'}
    </button>
  )

  // Caso 1: modo compacto (login/register) con el chat abierto EN MOBILE → modal centrado
  if (compact && isOpen) {
    return (
      <>
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 px-4 py-4 md:items-end md:justify-end md:bg-transparent md:p-0 md:pb-24 md:pr-6"
          onClick={() => setIsOpen(false)}
        >
          <div onClick={(event) => event.stopPropagation()}>{chatPanel}</div>
        </div>
        {/* En desktop (md+), el botón sigue visible en su esquina normal */}
        <div className="fixed bottom-5 right-5 z-[2000] hidden md:flex">
          {toggleButton}
        </div>
      </>
    )
  }

  // Caso 2: modo compacto con el chat cerrado → solo el botón, en su esquina
  if (compact) {
    return (
      <div className="fixed bottom-5 right-5 z-[2000] flex">
        {toggleButton}
      </div>
    )
  }

  // Caso 3: modo normal (dashboard y resto) → panel y botón apilados, arrastrables juntos
  return (
    <div
      ref={wrapperRef}
      className="fixed bottom-5 right-5 z-[999] flex flex-col items-end gap-3"
      style={{ transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)` }}
    >
      {isOpen && chatPanel}
      {toggleButton}
    </div>
  )
}