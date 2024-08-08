import {NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  // get prompt field from the request body
  const reqBody = await req.json();
  const { user } = reqBody;
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro", // Updated model version
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  try {
    // Start a chat session with the generation configuration and empty history
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    // Send the message to the chat session
    const result = await chatSession.sendMessage(user);
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
