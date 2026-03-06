import OpenAI from "openai";
import { config } from "../config";
import { logger } from "../utils/logger";

const openai = new OpenAI({ apiKey: config.openaiApiKey });

export async function chatCompletion(
  systemPrompt: string,
  userMessage: string,
  options: { temperature?: number; model?: string } = {}
): Promise<string> {
  const { temperature = 0.7, model = "gpt-4o" } = options;

  try {
    const res = await openai.chat.completions.create({
      model,
      temperature,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      response_format: { type: "json_object" },
    });

    return res.choices[0]?.message?.content || "{}";
  } catch (err: any) {
    logger.error("OpenAI chat error:", err.message);
    throw err;
  }
}

export async function visionCompletion(
  systemPrompt: string,
  imageBase64: string,
  options: { temperature?: number; model?: string } = {}
): Promise<string> {
  const { temperature = 0.3, model = "gpt-4o" } = options;

  try {
    const res = await openai.chat.completions.create({
      model,
      temperature,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
    });

    return res.choices[0]?.message?.content || "{}";
  } catch (err: any) {
    logger.error("OpenAI vision error:", err.message);
    throw err;
  }
}

export function parseJson<T = any>(raw: string): T {
  try {
    return JSON.parse(raw);
  } catch {
    logger.error("JSON parse failed, raw:", raw.slice(0, 200));
    return {} as T;
  }
}
