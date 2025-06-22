import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

function getDb() {
  if (!process.env.NEON_PASS) throw new Error('NEON_PASS required');
  return neon(`postgresql://InquireDB_owner:${process.env.NEON_PASS}@ep-nameless-sun-a1ykbpqg-pooler.ap-southeast-1.aws.neon.tech/InquireDB?sslmode=require`);
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

// Auto-create table on first use
async function ensureTable() {
  const sql = getDb();
  await sql`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    password TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  )`;
}

export async function register(email: string, password: string, name?: string): Promise<{ user: User; token: string }> {
  await ensureTable();
  const sql = getDb();
  
  const hashedPassword = await bcrypt.hash(password, 12);
  const [user] = await sql`
    INSERT INTO users (email, password, name)
    VALUES (${email}, ${hashedPassword}, ${name})
    RETURNING id, email, name
  `;
  
  const userData = { id: user.id, email: user.email, name: user.name };
  const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '7d' });
  
  return { user: userData, token };
}

export async function login(email: string, password: string): Promise<{ user: User; token: string } | null> {
  const sql = getDb();
  const [user] = await sql`SELECT id, email, name, password FROM users WHERE email = ${email} LIMIT 1`;
  
  if (!user || !await bcrypt.compare(password, user.password)) return null;
  
  const userData = { id: user.id, email: user.email, name: user.name };
  const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '7d' });
  
  return { user: userData, token };
}

export function verifyToken(token: string): User | null {
  try {
    return jwt.verify(token, JWT_SECRET) as User;
  } catch {
    return null;
  }
} 