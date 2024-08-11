import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Mock function to simulate travel-related document retrieval for U.S.
async function retrieveTravelDocuments(query) {
  // Simulate retrieval from a travel knowledge base, API, or database.
  return [
    `Visit the Grand Canyon in Arizona for breathtaking views.`,
    `Explore the vibrant city life in New York City.`,
    `Experience the beaches and theme parks in Florida.`,
    `Discover the cultural and historical landmarks in Washington, D.C.`,
  ].filter(doc => doc.toLowerCase().includes(query.toLowerCase()));
}

export async function POST(req) {
  const reqBody = await req.json();
  const { user } = reqBody;
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.0-pro",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  try {
    // Simple check to determine if the input is related to travel
    const isTravelRelated = /travel|trip|vacation|destination|tour|explore|visit/i.test(user);

    if (!isTravelRelated) {
      // Prompt the user to send travel-related queries
      return NextResponse.json({
        text: "It looks like your query isn't related to travel. Please provide information or questions related to travel, destinations, or activities in the U.S.",
      });
    }

    // Retrieve relevant travel documents based on the user's input
    const retrievedDocuments = await retrieveTravelDocuments(user);

    // Combine the retrieved documents with the user's input
    const combinedInput = `
      User Input: ${user}

      U.S. Travel Knowledge Base:
      ${retrievedDocuments.join("\n")}
    `;

    // Start a chat session with the combined input
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    // Send the combined input to the chat session
    const result = await chatSession.sendMessage(combinedInput);
    const response = await result.response;
    const text = await response.text();

    return NextResponse.json({
      text,
    });
  } catch (error) {
    return NextResponse.json({
      text: "Unable to process the prompt. Please try again.",
    });
  }
}
