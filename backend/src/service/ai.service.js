import Groq from "groq-sdk";
import { ApiError } from "../utils/ApiError.js";

let client = null;

const getClient = () => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new ApiError(
            503,
            "Groq API key is not configured. Add GROQ_API_KEY to the backend .env file.",
        );
    }
    if (!client) client = new Groq({ apiKey });
    return client;
};

const MODEL = () => process.env.GROQ_MODEL || "openai/gpt-oss-20b";

export const isAIConfigured = () => Boolean(process.env.GROQ_API_KEY);

const MAX_COMPLETION_TOKENS = 4096;

const clamp = (n, min, max) =>
    Math.max(min, Math.min(max, Math.round(Number(n) || 0)));

const generateJSON = async (prompt, schema) => {
    const groq = getClient();
    try {
        const completion = await groq.chat.completions.create({
            model: MODEL(),
            messages: [
                {
                    role: "system",
                    content:
                        "You are a helpful assistant. Respond only with JSON that matches the provided schema.",
                },
                { role: "user", content: prompt },
            ],
            temperature: 0.6,
            max_completion_tokens: MAX_COMPLETION_TOKENS,
            reasoning_effort: "low",
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "response",
                    strict: true,
                    schema,
                },
            },
        });

        const text = completion.choices?.[0]?.message?.content;
        if (!text) {
            throw new Error(
                `Empty response (${completion.choices?.[0]?.finish_reason ?? "unknown"})`,
            );
        }
        return JSON.parse(text);
    } catch (err) {
        console.error("Groq JSON error:", err?.message || err);
        throw new ApiError(
            502,
            "AI request failed. Please try again in a moment.",
        );
    }
};

const generateText = async (prompt, temperature = 0.7) => {
    const groq = getClient();
    try {
        const completion = await groq.chat.completions.create({
            model: MODEL(),
            messages: [{ role: "user", content: prompt }],
            temperature,
            max_completion_tokens: MAX_COMPLETION_TOKENS,
            reasoning_effort: "low",
        });

        const text = completion.choices?.[0]?.message?.content;
        if (!text) {
            throw new Error(
                `Empty response (${completion.choices?.[0]?.finish_reason ?? "unknown"})`,
            );
        }
        return text.trim();
    } catch (err) {
        console.error("Groq text error:", err?.message || err);
        throw new ApiError(
            502,
            "AI request failed. Please try again in a moment.",
        );
    }
};

export const generateLeadSummary = async (lead) => {
    const prompt = `You are an expert B2B sales analyst for a CRM called TTP CRM.
Analyse the following sales lead and produce a concise assessment.

Lead details:
- Name: ${lead.name || "N/A"}
- Company: ${lead.company || "N/A"}
- Email: ${lead.email || "N/A"}
- Current pipeline stage: ${lead.status || "New"}
- Potential deal value: $${lead.value || 0}
- Source: ${lead.source || "Unknown"}
- Notes: ${lead.notes || "None"}

Return JSON only.`;

    const schema = {
        type: "object",
        properties: {
            summary: {
                type: "string",
                description: "2-3 sentence executive summary of the lead",
            },
            riskScore: {
                type: "integer",
                description:
                    "Risk of losing this deal, 0 (safe) to 100 (high risk)",
            },
            suggestedPriority: {
                type: "string",
                enum: ["Low", "Medium", "High"],
            },
            nextBestAction: {
                type: "string",
                description: "One concrete recommended next step",
            },
        },
        required: [
            "summary",
            "riskScore",
            "suggestedPriority",
            "nextBestAction",
        ],
        additionalProperties: false,
    };

    const out = await generateJSON(prompt, schema);
    return { ...out, riskScore: clamp(out.riskScore, 0, 100) };
};

export const generateEmail = async ({ lead, purpose, tone, sender }) => {
    const prompt = `You are a senior sales rep writing on behalf of ${
        sender?.name || "our team"
    }${sender?.company ? ` at ${sender.company}` : ""}.

Write a professional sales email.
Purpose: ${purpose || "follow-up"}
Desired tone: ${tone || "friendly and professional"}

Recipient (lead) details:
- Name: ${lead?.name || "there"}
- Company: ${lead?.company || "N/A"}
- Pipeline stage: ${lead?.status || "New"}
- Context / notes: ${lead?.notes || "None"}

Return JSON only with a compelling subject line and a complete email body.
Use line breaks (\\n) in the body. Keep it under 180 words. Sign off as ${
        sender?.name || "the TTP CRM team"
    }.`;

    const schema = {
        type: "object",
        properties: {
            subject: { type: "string" },
            body: { type: "string" },
        },
        required: ["subject", "body"],
        additionalProperties: false,
    };

    return generateJSON(prompt, schema);
};

export const generateSalesInsights = async (pipelineStats) => {
    const prompt = `You are a revenue-operations advisor. Given this snapshot of a sales pipeline, identify what is working, what is at risk, and concrete actions to improve conversion.

Pipeline snapshot (JSON):
${JSON.stringify(pipelineStats, null, 2)}

Return JSON only.`;

    const schema = {
        type: "object",
        properties: {
            headline: {
                type: "string",
                description: "One-sentence summary of pipeline health",
            },
            insights: {
                type: "array",
                description: "3-5 specific, data-driven observations",
                items: { type: "string" },
            },
            recommendations: {
                type: "array",
                description: "3-5 prioritized, actionable recommendations",
                items: { type: "string" },
            },
            healthScore: {
                type: "integer",
                description: "Overall pipeline health, 0-100",
            },
        },
        required: ["headline", "insights", "recommendations", "healthScore"],
        additionalProperties: false,
    };

    const out = await generateJSON(prompt, schema);
    return { ...out, healthScore: clamp(out.healthScore, 0, 100) };
};

export { generateText };
