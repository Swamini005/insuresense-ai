
import * as chatLib from '../lib/chat.lib.js';

export const processChatQuery = async (query) => {
    if (!query) {
        throw new Error("Query is required");
    }
    return await chatLib.chatWithGroq(query);
};

export const getAgentStatus = async () => {
    return await chatLib.getChatAgentStatus();
};
