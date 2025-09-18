//This will contain the normal response function for interacting with the LLM. 

import OpenAI from "openai";
import { ResponseInput } from "openai/resources/responses/responses.mjs";
import prisma from "./prisma";
import { Prisma } from '@prisma/client';




export default async function NormalResponse(messages: ResponseInput , client: OpenAI, chatId: string, session: any)
{

    // We need to take in the messages array and then feed it to the LLM. 
    // We would also need to stream the response ... But I don't really wanna do that here right now. 
    // deduct the user limit. How do you do that? Well you get the session from which you get the email id .. and then you check if the user record exists .. which is does (if the user has signed up) and then you just deduct the limit from that by using prisma.user.update({})
    const response = await client.responses.create({
        model: "gpt-4.1",
        instructions: `
        You are an LLM that can generate animations for the user using the Manim Library in Python. Your job right now is to just respond to the user queries based on the manim code and animations that you may or may not have created prior. Be helpful and engaging.
        DON'T PROVIDE THE MANIM CODE AND EVEN TALK ABOUT MANIM THAT MUCH JUST TALK ABOUT THE ANIMATION. 
        `,
            input: messages,
        });
    try{await prisma.chat.upsert({
        where: {
            id: chatId
        },
        update:{
            Chats: messages as unknown as Prisma.InputJsonValue[]
        },
        create:{
            id: chatId,      
            userId: session.user.id,
            Chats: messages as unknown as Prisma.InputJsonValue[]
        }
    })}catch(err)
    {
        console.log("Error while storing chats to mongo ", err)
    }
    return response
}