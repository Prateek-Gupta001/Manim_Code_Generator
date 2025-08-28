//This will contain the normal response function for interacting with the LLM. 

import OpenAI from "openai";
import { ResponseInput } from "openai/resources/responses/responses.mjs";



export default async function GenerateManimCode(messages: ResponseInput , client: OpenAI)
{
    //TODO: Add a type for messages. 
    // We need to take in the messages array and then feed it to the LLM. 
    // We would also need to stream the response ... But I don't really wanna do that here right now. 
    const response = await client.responses.create({
        model: "gpt-4.1",
        instructions: `
        You are an LLM that can generate animations for the user using the Manim Library in Python. Your job right now is to just respond to the user queries based on the manim code and animations that you may or may not have created prior. Be helpful and engaging.
        `,
            input: messages,
        });
    return response
}