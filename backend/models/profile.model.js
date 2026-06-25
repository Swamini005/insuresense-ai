import knex from '../db/knex.js';

const TABLE = 'user_profiles';

export const DOMAINS = ['investment', 'health', 'travel', 'life', 'crypto'];

/** Returns the saved details object for a user+domain, or null. */
export async function getProfile(userId, domain) {
    const row = await knex(TABLE).where({ user_id: userId, domain }).first();
    return row ? row.details : null;
}

/** Insert or update (per user+domain) the dashboard details. Returns the stored details. */
export async function upsertProfile(userId, domain, details) {
    const [row] = await knex(TABLE)
        .insert({
            user_id: userId,
            domain,
            details: JSON.stringify(details ?? {}),
            updated_at: new Date(),
        })
        .onConflict(['user_id', 'domain'])
        .merge()
        .returning('*');
    return row.details;
}

/** All domain profiles for a user, keyed by domain. */
export async function getAllProfiles(userId) {
    const rows = await knex(TABLE).where({ user_id: userId });
    return Object.fromEntries(rows.map((r) => [r.domain, r.details]));
}
