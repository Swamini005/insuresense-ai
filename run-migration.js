import { migrateData } from './backend/memory/investment.memory.js';

// Seeds Postgres from backend/webhook/investment.json.
// Make sure schema exists first:  npx knex migrate:latest
console.log('🚀 Seeding investment data into Postgres...');

migrateData()
    .then(() => {
        console.log('Done.');
        process.exit(0);
    })
    .catch((err) => {
        console.error('Seed failed:', err);
        process.exit(1);
    });
