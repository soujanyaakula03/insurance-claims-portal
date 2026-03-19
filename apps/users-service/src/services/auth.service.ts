import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as usersRepo from '../repositories/users.repository';
import type { LoginInput, RegisterInput } from '../validators/auth.validator';
import type { AuthTokenPayload, UserRole } from '../types';

function mapRowToUser(row: usersRepo.UserRow) {
  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    role: row.role as UserRole,
    isActive: row.is_active,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

function signToken(payload: AuthTokenPayload): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  return jwt.sign(payload, secret, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '8h') as `${number}${'s' | 'm' | 'h' | 'd'}`,
  });
}

export async function login(input: LoginInput) {
  const user = await usersRepo.findUserByEmail(input.email);
  if (!user) {
    throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 });
  }

  const isValid = await bcrypt.compare(input.password, user.password_hash);
  if (!isValid) {
    throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 });
  }

  const payload: AuthTokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role as UserRole,
  };

  const token = signToken(payload);
  return { token, user: mapRowToUser(user) };
}

export async function register(input: RegisterInput) {
  const existing = await usersRepo.findUserByEmail(input.email);
  if (existing) {
    throw Object.assign(new Error('Email already in use'), { statusCode: 409 });
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const row = await usersRepo.createUser({
    email: input.email,
    passwordHash,
    firstName: input.firstName,
    lastName: input.lastName,
    role: input.role,
  });

  return mapRowToUser(row);
}

export async function getUserById(id: string) {
  const user = await usersRepo.findUserById(id);
  if (!user) {
    throw Object.assign(new Error('User not found'), { statusCode: 404 });
  }
  return mapRowToUser(user);
}
