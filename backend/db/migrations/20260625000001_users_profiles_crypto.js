/**
 * Auth + personalization schema:
 *  - users            : accounts (email/password), role, global preferences
 *  - user_profiles    : per-domain dashboard inputs (investment/health/travel/
 *                       life/crypto) persisted as JSONB — the "memory" the
 *                       agents use to personalize answers.
 *  - crypto_memory    : crypto news/insights feed (mirrors investment_memory).
 */
export async function up(knex) {
    await knex.schema.createTable('users', (t) => {
        t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        t.text('email').notNullable().unique();
        t.text('password_hash').notNullable();
        t.text('name');
        t.string('role').notNullable().defaultTo('user');
        t.jsonb('preferences').notNullable().defaultTo('{}');
        t.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
        t.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now());
    });

    await knex.schema.createTable('user_profiles', (t) => {
        t.increments('id').primary();
        t.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
        // 'investment' | 'health' | 'travel' | 'life' | 'crypto'
        t.string('domain').notNullable();
        t.jsonb('details').notNullable().defaultTo('{}');
        t.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
        t.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now());
        t.unique(['user_id', 'domain']);
    });

    await knex.schema.createTable('crypto_memory', (t) => {
        t.increments('id').primary();
        t.string('original_id').notNullable().unique();
        t.string('symbol');
        t.string('name');
        t.text('title').notNullable();
        t.string('source');
        t.text('url');
        t.timestamp('published_at', { useTz: true });
        t.text('content');
        t.text('content_snippet');
        t.boolean('trending').defaultTo(false);
        t.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
        t.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now());
        t.index('published_at');
    });
}

export async function down(knex) {
    await knex.schema.dropTableIfExists('crypto_memory');
    await knex.schema.dropTableIfExists('user_profiles');
    await knex.schema.dropTableIfExists('users');
}
