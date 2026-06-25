import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const SALT_ROUNDS = 10;

if (!process.env.JWT_SECRET) {
    console.warn('⚠️ JWT_SECRET is not set; using an insecure dev default.');
}

export const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);
export const comparePassword = (password, hash) => bcrypt.compare(password, hash);
export const signToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
export const verifyToken = (token) => jwt.verify(token, JWT_SECRET);
