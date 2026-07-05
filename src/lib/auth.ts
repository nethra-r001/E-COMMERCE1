import bcrypt from 'bcryptjs';
import * as jose from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'super-secret-key-for-e-commerce-platform-development-2026'
);

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export async function signJWT(payload: any): Promise<string> {
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function verifyJWT(token: string): Promise<any> {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getUserFromRequest(req: any) {
  // Supports both NextRequest (req.cookies.get) and plain cookies check
  const cookieVal = typeof req.cookies.get === 'function' 
    ? req.cookies.get('token')?.value 
    : req.cookies?.token;
  
  if (!cookieVal) return null;
  return verifyJWT(cookieVal);
}
