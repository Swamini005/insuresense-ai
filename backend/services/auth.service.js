import { createUser, findUserByEmail, findUserById, publicUser } from '../models/user.model.js';
import { hashPassword, comparePassword, signToken } from '../lib/auth.lib.js';

export const signup = async ({ email, password, name }) => {
    if (!email || !password) throw new Error('Email and password are required');
    if (password.length < 6) throw new Error('Password must be at least 6 characters');

    const existing = await findUserByEmail(email);
    if (existing) throw new Error('Email already registered');

    const passwordHash = await hashPassword(password);
    const user = await createUser({ email, passwordHash, name });
    const token = signToken({ sub: user.id, role: user.role });

    return { user: publicUser(user), token };
};

export const login = async ({ email, password }) => {
    if (!email || !password) throw new Error('Email and password are required');

    const user = await findUserByEmail(email);
    if (!user) throw new Error('Invalid credentials');

    const ok = await comparePassword(password, user.password_hash);
    if (!ok) throw new Error('Invalid credentials');

    const token = signToken({ sub: user.id, role: user.role });
    return { user: publicUser(user), token };
};

export const getMe = async (userId) => {
    const user = await findUserById(userId);
    if (!user) throw new Error('User not found');
    return publicUser(user);
};
