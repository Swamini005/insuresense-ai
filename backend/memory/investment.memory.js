import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import knex from '../db/knex.js';

const TABLE = 'investment_memory';

// ---------------------------------------------------------------------------
// Mapping helpers: Postgres rows (snake_case) <-> domain objects (camelCase)
// and the Precize feed items (snake_case) -> rows.
// ---------------------------------------------------------------------------
function rowToMemory(r) {
    if (!r) return r;
    return {
        id: r.id,
        originalId: r.original_id,
        assetId: r.asset_id,
        token: r.token,
        symbol: r.symbol,
        logo: r.logo,
        logoMark: r.logo_mark,
        mobileLogo: r.mobile_logo,
        altText: r.alt_text,
        title: r.title,
        slug: r.slug,
        publisher: r.publisher,
        publisherUrl: r.publisher_url,
        readTime: r.read_time,
        publishedAt: r.published_at,
        content: r.content,
        contentSnippet: r.content_snippet,
        takeaways: r.takeaways,
        takeawaysSnippet: r.takeaways_snippet,
        trending: r.trending,
        bookmark: r.bookmark,
    };
}

function itemToRow(item) {
    return {
        original_id: item.id,
        asset_id: item.asset_id ?? null,
        token: item.token ?? null,
        symbol: item.symbol ?? null,
        logo: item.logo ?? null,
        logo_mark: item.logo_mark ?? null,
        mobile_logo: item.mobile_logo ?? null,
        alt_text: item.alt_text ?? null,
        title: item.title,
        slug: item.slug ?? null,
        publisher: item.publisher ?? null,
        publisher_url: item.publisher_url ?? null,
        read_time: item.read_time ?? null,
        published_at: item.published_at ? new Date(item.published_at) : null,
        content: item.content ?? null,
        content_snippet: item.content_snippet ?? null,
        takeaways: item.takeaways ?? null,
        takeaways_snippet: item.takeaways_snippet ?? null,
        trending: item.trending ?? false,
        bookmark: item.bookmark ?? false,
        updated_at: new Date(),
    };
}

// ---------------------------------------------------------------------------
// Query helpers used by the agent / webhook.
// ---------------------------------------------------------------------------

/** Most recent investment news, newest first. */
export async function getRecentInvestmentNews(limit = 10) {
    const rows = await knex(TABLE).orderBy('published_at', 'desc').limit(limit);
    return rows.map(rowToMemory);
}

/**
 * Upsert one or many Precize feed items (keyed on original_id).
 * Mirrors the old handleWebhookData return shape.
 */
export async function upsertInvestmentItems(payload) {
    const items = Array.isArray(payload) ? payload : [payload];
    const results = [];

    for (const item of items) {
        if (!item?.id) {
            results.push({ success: false, error: 'missing id' });
            continue;
        }
        try {
            await knex(TABLE)
                .insert(itemToRow(item))
                .onConflict('original_id')
                .merge();
            results.push({ success: true, id: item.id, title: item.title });
        } catch (error) {
            results.push({ success: false, id: item.id, error: error.message });
        }
    }

    return { success: true, total: items.length, results };
}

// Backwards-compatible alias for the previous webhook entry point.
export const handleWebhookData = upsertInvestmentItems;

// ---------------------------------------------------------------------------
// One-shot seed: load backend/webhook/investment.json into Postgres.
// Run via `node run-migration.js` (after `npx knex migrate:latest`).
// ---------------------------------------------------------------------------
export async function migrateData() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const jsonPath = path.resolve(__dirname, '../webhook/investment.json');

    if (!fs.existsSync(jsonPath)) {
        console.error(`❌ ${jsonPath} not found`);
        return;
    }

    const items = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    if (!Array.isArray(items)) {
        console.error('❌ investment.json is not an array');
        return;
    }

    console.log(`📦 Seeding ${items.length} investment items into Postgres...`);
    const { results } = await upsertInvestmentItems(items);
    const ok = results.filter((r) => r.success).length;

    console.log('='.repeat(50));
    console.log(`✅ Upserted: ${ok}`);
    console.log(`❌ Failed:   ${results.length - ok}`);
    console.log('='.repeat(50));

    await knex.destroy();
}

// Run seed if executed directly.
const entry = process.argv[1] && path.resolve(process.argv[1]);
if (entry && entry === path.resolve(fileURLToPath(import.meta.url))) {
    migrateData().catch((e) => {
        console.error(e);
        process.exit(1);
    });
}
