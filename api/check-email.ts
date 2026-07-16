import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.EMAIL_READER_DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const email = req.body?.email as string | undefined;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  try {
    const result = await pool.query<{ registered: boolean }>(
      `SELECT public.travelgo_email_registered($1::text) AS registered`,
      [email],
    );

    const registered = result.rows[0]?.registered ?? false;

    return res.status(200).json({ registered });
  } catch (err) {
    console.error('Error chequeando email:', err);
    return res.status(500).json({ error: 'No se pudo verificar el email' });
  }
}