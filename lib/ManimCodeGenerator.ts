//This will contain the normal response function for generating the Manim Codes by the LLM. 
import OpenAI from "openai";
import { ResponseInput } from "openai/resources/responses/responses.mjs";
import prisma from "./prisma";
import { Prisma } from '@prisma/client';



export default async function GenerateManimCode(messages: ResponseInput , client: OpenAI, session: any, chatId: string)
{
    //TODO: Add a type for session. 
    // We need to take in the messages array and then feed it to the LLM. 
    // We would also need to stream the response ... But I don't really wanna do that here right now. 
    // check if limit is suffcient and then deduct it.
    console.log("chat id received is ", chatId)
    let updatedRecord = await prisma.user.update({
        where:{
            id: session.user.id
        },
        data:{
            limit:{
                decrement: 1
            }
        }
    })
    const email = updatedRecord.email
    if(updatedRecord.limit < 0)
    {
        throw Error("Insufficient Limit")

    }
    console.log("The limit is ", updatedRecord.limit)
    console.log("The list of messages being sent to the user is", messages)
    const response = await client.responses.create({
        model: "gpt-4.1",
        instructions: `
        You are an LLM that can generate animations for the user using the Manim Library in Python. Your job is to write Manim Code to illustrate/animate... based on the user prompt.. 
        You can use websearch to look via the Manim docs(https://3b1b.github.io/manim/) if required.
        Make sure to ALWAYS CREATE A SINGLE SCENE/CLASS NAMED Animate. 
        class Animate(scene):
            def ...
        THE CLASS NAME SHOULD NEVER CHANGE NO MATTER THE REQUEST.
        Some pointers:-
        1. Don't use Color Wrappers(), just use Hex strings directly.
        2. The manim library's syntax keeps changing so please make sure to use up to date syntax only. Use websearch if needed to make sure you are using
        the up to date syntax only. 
        There is also no latex distribution so please write Manim code WITHOUT using its Latex features like Tex() and MathTex()
        and instead use
        Text() and MarkupText() if and when required.
        PLEASE OUTPUT THE MANIM CODE ONLY AND NOTHING ELSE.`,
        input: messages,
        tools: [
        { type: "web_search_preview" },
    ],
        });
    const codeWithoutFences = response.output_text.replace(/^```python\s*/, '').replace(/```\s*$/, '').trim();
    const code = codeWithoutFences.replace(/\u00A0/g, ' ');

    console.log("cleaned code is ", code)      
    //@ts-expect-error
    messages.push({
            "role": "assistant",
            "content": [
                { "type": "output_text", "text": "code" + code }
            ]
            })
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