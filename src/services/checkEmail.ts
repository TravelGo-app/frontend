export type EmailCheckResult =
  | { status: 'registered' }
  | { status: 'available' }
  | { status: 'error' };

export async function checkEmailRegistered(
  email: string,
  signal?: AbortSignal,
): Promise<EmailCheckResult> {
  try {
    const response = await fetch('/api/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      signal,
    });

    if (!response.ok) return { status: 'error' };

    const data = await response.json();
    return { status: data.registered ? 'registered' : 'available' };
  } catch (err: any) {
    if (err.name === 'AbortError') throw err;
    console.error('Error verificando email:', err);
    return { status: 'error' };
  }
}