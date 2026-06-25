/**
 * Initial schema for InsureSense (Postgres / Knex).
 * Replaces the former MongoDB collections.
 */
export async function up(knex) {
    // Investment news / "memory" (ingested from the Precize feed).
    await knex.schema.createTable('investment_memory', (t) => {
        t.increments('id').primary();
        t.string('original_id').notNullable().unique();
        t.string('asset_id');
        t.string('token');
        t.string('symbol');
        t.text('logo');
        t.text('logo_mark');
        t.text('mobile_logo');
        t.text('alt_text');
        t.text('title').notNullable();
        t.text('slug');
        t.string('publisher');
        t.text('publisher_url');
        t.integer('read_time');
        t.timestamp('published_at', { useTz: true });
        t.text('content');
        t.text('content_snippet');
        t.text('takeaways');
        t.text('takeaways_snippet');
        t.boolean('trending').defaultTo(false);
        t.boolean('bookmark').defaultTo(false);
        t.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
        t.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now());
        t.index('published_at');
    });

    // Generic agent key/value memory (used by the mastra service).
    await knex.schema.createTable('agent_memory', (t) => {
        t.increments('id').primary();
        t.string('agent_name').notNullable();
        t.string('key').notNullable();
        t.jsonb('value').notNullable();
        t.text('context');
        t.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
        t.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now());
        t.index(['agent_name', 'key']);
    });

    // Health & travel insurance product catalogues. The source documents are
    // deeply nested, so they are stored as JSONB and flattened for the LLM at
    // read time (see backend/memory/health.memory.js / travel.memory.js).
    await knex.schema.createTable('health_products', (t) => {
        t.increments('id').primary();
        t.string('source');
        t.jsonb('data').notNullable();
        t.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    });

    await knex.schema.createTable('travel_products', (t) => {
        t.increments('id').primary();
        t.string('source');
        t.jsonb('data').notNullable();
        t.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    });
}

export async function down(knex) {
    await knex.schema.dropTableIfExists('travel_products');
    await knex.schema.dropTableIfExists('health_products');
    await knex.schema.dropTableIfExists('agent_memory');
    await knex.schema.dropTableIfExists('investment_memory');
}
