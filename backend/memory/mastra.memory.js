import knex from '../db/knex.js';

const TABLE = 'agent_memory';

/** Most recent memories for an agent, newest first. */
export async function getAgentMemories(agentName, limit = 5) {
    return knex(TABLE)
        .where({ agent_name: agentName })
        .orderBy('created_at', 'desc')
        .limit(limit);
}

/** Persist a single agent memory row. `value` is stored as JSONB. */
export async function saveAgentMemory({ agentName, key, value, context }) {
    const [row] = await knex(TABLE)
        .insert({
            agent_name: agentName,
            key,
            value: JSON.stringify(value ?? null),
            context: context ?? null,
        })
        .returning('*');
    return row;
}
