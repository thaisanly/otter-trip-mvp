import * as bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from './prisma';
import { env } from './env';

// Use validated environment variable - will throw error if not properly configured
const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);

const COOKIE_NAME = 'admin_token';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

interface TokenPayload extends Record<string, unknown> {
  adminId: string;
  email: string;
  role: string;
}

export async function createToken(payload: TokenPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // Validate that the payload has the required fields
    if (typeof payload.adminId === 'string' && 
        typeof payload.email === 'string' && 
        typeof payload.role === 'string') {
      return payload as TokenPayload;
    }
    
    return null;
  } catch (error) {
    console.error('[Auth] Token verification failed:', error);
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

export async function getAuthCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getCurrentAdmin() {
  const token = await getAuthCookie();
  
  if (!token) {
    return null;
  }

  const payload = await verifyToken(token);
  
  if (!payload || !payload.adminId) {
    return null;
  }

  const admin = await prisma.admin.findUnique({
    where: { 
      id: payload.adminId,
      isActive: true 
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    }
  });

  return admin;
}

export async function requireAuth() {
  const admin = await getCurrentAdmin();
  
  if (!admin) {
    throw new Error('Unauthorized');
  }
  
  return admin;
}