//This will contain the normal response function for generating the Manim Codes by the LLM. 
import OpenAI from "openai";
import { ResponseInput } from "openai/resources/responses/responses.mjs";



export default async function NormalResponse(messages: ResponseInput , client: OpenAI)
{
    //TODO: Add a type for messages. 
    // We need to take in the messages array and then feed it to the LLM. 
    // We would also need to stream the response ... But I don't really wanna do that here right now. 
    const response = await client.responses.create({
        model: "gpt-4.1",
        instructions: `
        You are an LLM that can generate animations for the user using the Manim Library in Python. Your job is to write Manim Code to illustrate/animate... based on the user prompt.. 
        You can use websearch to look via the Manim docs(https://3b1b.github.io/manim/) if required.
        PLEASE OUTPUT THE MANIM CODE ONLY AND NOTHING ELSE.`,
        input: messages,
        tools: [
        { type: "web_search_preview" },
    ],
        });
    return response
}