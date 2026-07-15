import api from "./api";

const SESSION_KEY = "travelgo_chat_session_id";

function getSessionId(): string {
  let sessionId = sessionStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
}

export interface ChatResponse {
  reply: string;
}

const ERROR_MESSAGES: Record<number, string> = {
  400: "Revisá el mensaje e intentá nuevamente.",
  422: "El asistente no puede procesar esa solicitud.",
  429: "TravelGo todavía está respondiendo el mensaje anterior.",
  502: "El asistente no pudo generar una respuesta válida.",
  503: "El asistente no está disponible temporalmente. Intentá nuevamente.",
};

export function getChatErrorMessage(err: any): string {
  const status = err?.response?.status;
  return (
    ERROR_MESSAGES[status] ??
    "No se pudo contactar al asistente. Intentá nuevamente."
  );
}

export async function sendChatMessage(message: string): Promise<ChatResponse> {
  const cleanMessage = message.trim();

  if (!cleanMessage) {
    throw new Error("El mensaje está vacío");
  }

  const response = await api.post<ChatResponse>("/chat", {
    sessionId: getSessionId(),
    message: cleanMessage,
  });

  return response.data;
}