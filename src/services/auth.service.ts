export type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  createdAt: string;
};

export type GoogleAuthResponse = {
  message: string;
  user: AuthUser;
  token: string;
  isNewUser: boolean;
  accountLinked: boolean;
  requiresPasswordSetup: boolean;
  hasPassword: boolean;
  hasGoogle: boolean;
};

export async function loginWithGoogle(
  credential: string
): Promise<GoogleAuthResponse> {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    throw new Error("VITE_API_URL no está configurada")
  }

  const response = await fetch(
    `${apiUrl}/auth/google`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "No se pudo iniciar sesión con Google")
  }

  return data;
}