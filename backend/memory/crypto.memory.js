import knex from '../db/knex.js';

const TABLE = 'crypto_memory';

function rowToMemory(r) {
    if (!r) return r;
    return {
        id: r.id,
        originalId: r.original_id,
        symbol: r.symbol,
        name: r.name,
        title: r.title,
        source: r.source,
        url: r.url,
        publishedAt: r.published_at,
        content: r.content,
        contentSnippet: r.content_snippet,
        trending: r.trending,
    };
}

function itemToRow(item) {
    return {
        original_id: item.id,
        symbol: item.symbol ?? null,
        name: item.name ?? null,
        title: item.title,
        source: item.source ?? item.publisher ?? null,
        url: item.url ?? item.publisher_url ?? null,
        published_at: item.published_at ? new Date(item.published_at) : null,
        content: item.content ?? null,
        content_snippet: item.content_snippet ?? null,
        trending: item.trending ?? false,
        updated_at: new Date(),
    };
}

/** Most recent crypto news, newest first. */
export async function getRecentCryptoNews(limit = 10) {
    const rows = await knex(TABLE).orderBy('published_at', 'desc').limit(limit);
    return rows.map(rowToMemory);
}

/** Upsert one or many crypto news items (keyed on original_id). */
export async function upsertCryptoItems(payload) {
    const items = Array.isArray(payload) ? payload : [payload];
    const results = [];

    for (const item of items) {
        if (!item?.id) {
            results.push({ success: false, error: 'missing id' });
            continue;
        }
        try {
            await knex(TABLE).insert(itemToRow(item)).onConflict('original_id').merge();
            results.push({ success: true, id: item.id, title: item.title });
        } catch (error) {
            results.push({ success: false, id: item.id, error: error.message });
        }
    }

    return { success: true, total: items.length, results };
}
