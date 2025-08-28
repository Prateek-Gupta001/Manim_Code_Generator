//This is going to contain the main endpoint that is going to contain how you are going to be interacting with the chatbot 
//This is the main endpoint for chatting in general. This endpoint is going to be used for everything ... for all the chatting in general. 
//Every message that the user sends is going to go via this and the model will decide if a video is to be made. 
//Normal messages like hey there and who are you .. are going to be answered by the Normal Response function and the video creation requests are going to be sent to the manim_chat function. 
//We will have one API call for classification only. 
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import classifier from "@/utils/classifier";
import { ResponseInput } from "openai/resources/responses/responses.mjs";
import NormalResponse from "@/utils/normalResponse";
import GenerateManimCode from "@/utils/normalResponse";
 


const client = new OpenAI()

//messages array.

export const POST = async function(request : NextRequest)
{
    
    const data = await request.json();
    const messages:ResponseInput = data.messages
    console.log("The request body contains ", data)
    let last = messages[messages.length - 1]
    let role, content;
    if ("role" in last && "content" in last) {
    content  = last["content"]
    role = last["role"]
    if(role != "user")
    {
        throw Error("Last role cannot be someone other than the user.")
    }
    // now role and content are properly typed
    }
    else{
        throw Error("No role and content")
    }
    console.log("The role and contents are ", role, " ", content)
    const classification = await classifier(messages, client) 
    console.log("Classification is ", classification.output_text)

    if(classification.output_text == "NORMAL")
    {
        // call the normal response function 
        const res = await NormalResponse(messages, client)
        return NextResponse.json({
            res
        })
        //CAN DO: stream the output to the user
    }
    else if (classification.output_text == "VIDEO"){
        // call the manim code generation function 
        const res = await GenerateManimCode(messages, client)
        const pythonCode = res.output_text
        // run the python Code and get the video. 

        // send the video to the frontend. 

        // return output to the user
    }
    // This is going to be hit when the classification from the LLM is wrong. 

    return NextResponse.json({
        msg: "The LLM made a wrong classification"
    })

}


