import { GoogleGenAI } from "@google/genai";
import { TrackedEvent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeEvents = async (events: TrackedEvent[]): Promise<string> => {
  if (events.length === 0) {
    return "No events tracked yet. Interact with the sandbox environment to generate data for analysis.";
  }

  // Optimize payload size by mapping only essential fields
  const eventLog = events.map(e => ({
    type: e.type,
    name: e.name,
    path: e.path,
    time: new Date(e.timestamp).toLocaleTimeString(),
    props: e.properties
  }));

  const prompt = `
    You are an expert Digital Analyst and UX Researcher.
    Analyze the following log of user events from a simulated e-commerce website session.
    
    Event Log (JSON):
    ${JSON.stringify(eventLog, null, 2)}

    Please provide a concise analysis covering:
    1. **User Journey Summary**: Briefly describe the user's path.
    2. **Engagement Analysis**: What captured the most attention? Are there signs of frustration (e.g., rage clicks, repetitive navigation)?
    3. **Conversion Friction**: If they didn't convert (e.g., 'checkout_success'), why might that be based on the events? If they did, what was the key path?
    4. **Actionable Recommendations**: 2-3 specific UX improvements.

    Format the response in clean Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful, analytical AI assistant for web developers.",
        temperature: 0.3, // Lower temperature for more analytical/factual responses
      }
    });

    return response.text || "Unable to generate analysis at this time.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "An error occurred while analyzing the event data. Please ensure your API key is valid.";
  }
};
