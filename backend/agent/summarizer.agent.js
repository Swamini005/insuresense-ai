import { getGroqModel } from "../lib/groq.js";

const AGENT_LABELS = {
  travel: "Travel Insurance",
  health: "Health Insurance",
  investment: "Investment",
  life: "Life Insurance",
  crypto: "Crypto",
};

const DEFAULT_INSTRUCTIONS = {
  travel: `You are writing a COMPLETE BREAKTHROUGH REPORT for a traveller. Based on the agent's suggestion and the user's trip details, explain:
1. **Why this plan fits them** – Map each part of the suggestion to their destination, dates, travellers, purpose, and risk appetite.
2. **Coverage breakdown** – What is covered for their specific trip (flights, baggage, medical, delays, etc.) and any gaps.
3. **Action plan** – Clear next steps: when to buy, documents needed, what to do before travel and if something goes wrong.
4. **Bottom line** – One crisp paragraph: why this is the right choice for this user and how it gives them a complete breakthrough for a stress-free trip.`,

  health: `You are writing a COMPLETE BREAKTHROUGH REPORT for a health insurance buyer. Based on the agent's suggestion and the user's profile (coverage type, sum insured, pre-existing, city, hospital preference, timeline), explain:
1. **Why this plan fits them** – How the suggested plan matches their family size, sum insured, pre-existing conditions, and hospital preference.
2. **Premium breakdown** – If possible, reason about likely premium range, what they get for the price, and value (e.g. room rent, restorations, network).
3. **Coverage match** – Which benefits matter most for their profile (maternity, OPD, pre-existing, etc.) and how the plan delivers.
4. **Action plan** – When to buy, documents, declarations, and first steps after buying.
5. **Bottom line** – One crisp paragraph: why this plan works for this specific user and gives them a complete premium and coverage breakthrough.`,

  investment: `You are writing a COMPLETE BREAKTHROUGH REPORT for an investor. Based on the agent's suggestion (and any recent news/sources) and the user's profile (goals, horizon, amount, risk, age, income), explain:
1. **Why this strategy fits them** – Map the suggestion to their primary goal, time horizon, planned amount, and risk appetite.
2. **Value breakdown** – How the suggested approach addresses growth, tax, and liquidity in line with their situation.
3. **Risks and fit** – What to watch and why this is still the right breakthrough for their profile.
4. **Action plan** – Concrete next steps: how much to invest, where, in what order, and any follow-up (e.g. rebalance, top-up).
5. **Bottom line** – One crisp paragraph: why this plan works for this specific user and gives them a complete breakthrough for their financial goals.`,

  life: `You are writing a COMPLETE BREAKTHROUGH REPORT for a life insurance buyer. Based on the agent's suggestion and the user's profile (age, income, dependents, goals, risk, payout preference), explain:
1. **Why this plan fits them** – Map the suggested term/life plan to their age, income, dependents, and payout preference.
2. **Cover & premium breakdown** – Reason about an appropriate sum assured, likely premium range, and value for the price.
3. **Risks and fit** – Riders worth considering, claim settlement, and why this is still the right breakthrough for their profile.
4. **Action plan** – When to buy, documents, medicals/declarations, and first steps after buying.
5. **Bottom line** – One crisp paragraph: why this plan works for this specific user and protects their dependents.`,

  crypto: `You are writing a COMPLETE BREAKTHROUGH REPORT for a crypto investor. Based on the agent's suggestion (and any recent news/sources) and the user's profile (goals, horizon, amount, risk, experience), explain:
1. **Why this strategy fits them** – Map the suggestion to their goal, time horizon, amount, risk appetite, and experience level.
2. **Allocation & value breakdown** – How the suggested assets/products balance growth vs. risk for their situation.
3. **Risks and fit** – Be explicit about volatility, security, and regulatory risk; note this is informational, not financial advice.
4. **Action plan** – Concrete next steps: how much to allocate, where, in what order, and any follow-up (e.g. DCA, rebalance, custody).
5. **Bottom line** – One crisp paragraph: why this approach works for this specific user and their goals.`,
};

function getInstructions(agentType) {
  return AGENT_LABELS[agentType]
    ? DEFAULT_INSTRUCTIONS[agentType] ?? DEFAULT_INSTRUCTIONS.investment
    : DEFAULT_INSTRUCTIONS.investment;
}

function formatDetails(details) {
  if (!details || typeof details !== "object") return "Not provided.";
  return Object.entries(details)
    .filter(([_, v]) => v != null && v !== "")
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
    .join("\n");
}

export const SummarizerAgent = {
  name: "summarizer-agent",
  description: "Produces a complete breakthrough report from a domain agent's response and user context",

  /**
   * @param {Object} opts
   * @param {string} opts.agentType - 'travel' | 'health' | 'investment'
   * @param {Object} opts.agentResponse - { text, sources? } from Travel/Health/Investment agent
   * @param {string} [opts.userQuery] - User's original question
   * @param {Object} [opts.userDetails] - User profile (travel details, health details, or investment details)
   * @returns {Promise<{ report: string, agentType: string }>}
   */
  run: async ({ agentType, agentResponse, userQuery, userDetails }) => {
    if (!agentType || !agentResponse) {
      throw new Error("agentType and agentResponse are required");
    }

    const domain = AGENT_LABELS[agentType] ?? "Insurance";
    const instructions = getInstructions(agentType);

    const agentText = typeof agentResponse.text === "string"
      ? agentResponse.text
      : JSON.stringify(agentResponse);

    const sourcesBlock =
      agentResponse.sources?.length > 0
        ? `\nSources used by the agent:\n${agentResponse.sources.map((s) => `- ${s.title}: ${s.url ?? ""}`).join("\n")}`
        : "";

    const prompt = `
You are an expert report writer. Your job is to turn a ${domain} agent's reply into a **COMPLETE BREAKTHROUGH REPORT** tailored to the specific user.

${instructions}

---

**Agent's suggestion / response:**
${agentText}
${sourcesBlock}

---

**User's original question:**
${userQuery || "Not provided."}

**User's profile / details:**
${formatDetails(userDetails)}

---

Write the full report in clear sections (use the structure from the instructions). Use plain text or simple markdown. Be specific to this user—tie every point to their situation. End with the "Bottom line" paragraph.
`.trim();

    const model = getGroqModel({ search: false });
    const result = await model.generateContent(prompt);
    const report = result.response.text();

    return { report, agentType };
  },
};