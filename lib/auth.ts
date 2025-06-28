import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export interface User {
  id: string;
  email: string;
  name?: string;
}

export function generateToken(user: User): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): User | null {
  try {
    return jwt.verify(token, JWT_SECRET) as User;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createUser(email: string, password: string, name?: string): Promise<User> {
  const hashedPassword = await hashPassword(password);
  const result = await sql`
    INSERT INTO users (email, password, name) 
    VALUES (${email}, ${hashedPassword}, ${name}) 
    RETURNING id, email, name
  `;
  return result[0] as User;
}

export async function findUserByEmail(email: string): Promise<(User & { password: string }) | null> {
  const result = await sql`
    SELECT id, email, name, password 
    FROM users 
    WHERE email = ${email}
  `;
  return result[0] as (User & { password: string }) | null;
}

export async function checkSearchLimit(userId: string): Promise<{ canSearch: boolean; remaining: number }> {
  const today = new Date().toISOString().split('T')[0];
  
  const result = await sql`
    SELECT searches_used 
    FROM user_search_limits 
    WHERE user_id = ${userId} AND date = ${today}
  `;
  
  const searchesUsed = result[0]?.searches_used || 0;
  const dailyLimit = 7;
  
  return {
    canSearch: searchesUsed < dailyLimit,
    remaining: Math.max(0, dailyLimit - searchesUsed)
  };
}

export async function incrementSearchCount(userId: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  
  await sql`
    INSERT INTO user_search_limits (user_id, date, searches_used)
    VALUES (${userId}, ${today}, 1)
    ON CONFLICT (user_id, date)
    DO UPDATE SET searches_used = user_search_limits.searches_used + 1
  `;
} 