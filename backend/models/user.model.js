import knex from '../db/knex.js';

const TABLE = 'users';

/** Strip the password hash before returning a user to clients. */
export function publicUser(u) {
    if (!u) return u;
    const { password_hash, ...rest } = u;
    return rest;
}

export async function createUser({ email, passwordHash, name, role = 'user' }) {
    const [user] = await knex(TABLE)
        .insert({
            email: email.toLowerCase(),
            password_hash: passwordHash,
            name: name ?? null,
            role,
        })
        .returning('*');
    return user;
}

export async function findUserByEmail(email) {
    return knex(TABLE).where({ email: email.toLowerCase() }).first();
}

export async function findUserById(id) {
    return knex(TABLE).where({ id }).first();
}

export async function updateUserPreferences(id, preferences) {
    const [user] = await knex(TABLE)
        .where({ id })
        .update({ preferences: JSON.stringify(preferences ?? {}), updated_at: new Date() })
        .returning('*');
    return user;
}
