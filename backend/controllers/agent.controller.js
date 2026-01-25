export function createChatHandler(agent) {
    return async (req, res) => {
      try {
        const input = req.body?.input ?? req.body?.prompt ?? req.body?.message;
        if (!input) {
          return res.status(400).json({ success: false, message: 'input, prompt, or message required' });
        }
        const result = await agent.run({ input });
        res.json({ success: true, data: result });
      } catch (e) {
        res.status(500).json({ success: false, message: e.message });
      }
    };
  }