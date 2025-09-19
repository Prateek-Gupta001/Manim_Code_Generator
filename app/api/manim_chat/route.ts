//This is going to contain the main endpoint that is going to contain how you are going to be interacting with the chatbot 
//This is the main endpoint for chatting in general. This endpoint is going to be used for everything ... for all the chatting in general. 
//Every message that the user sends is going to go via this and the model will decide if a video is to be made. 
//Normal messages like hey there and who are you .. are going to be answered by the Normal Response function and the video creation requests are going to be sent to the manim_chat function. 
//We will have one API call for classification only. 
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import classifier from "@/lib/classifier";
import { ResponseInput } from "openai/resources/responses/responses.mjs";
import NormalResponse from "@/lib/normalResponse";
import GenerateManimCode from "@/lib/ManimCodeGenerator";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import axios from "axios";
import fs from "fs"


const client = new OpenAI()

//messages array.

export const POST = async function(request : NextRequest)
{
    const session = await getServerSession(authOptions);
    console.log("Session type is ", typeof(session), "value ", session)
    if(!session)
    {
        redirect("/api/auth/signin?callbackUrl=/dashboard");
    }
    const data = await request.json();
    const messages:ResponseInput = data.messages
    const chatId: string = data.chatId
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
    //send a normal message along with the classification as well?
    if(classification.output_text == "NORMAL")
    {
        // call the normal response function 
        const res = await NormalResponse(messages, client, chatId, session)
        const text = res.output_text
        return NextResponse.json({
            assistantResponse: text,
            classification: classification.output_text
        })
        //CAN DO: stream the output to the user
        
    }
    else if (classification.output_text == "VIDEO"){

        // call the manim code generation function 
        let res;
        try{
            res = await GenerateManimCode(messages, client, session, chatId)
        }catch(err)
        {
            console.log("The error here is ", err)
            return NextResponse.json({
                msg: "Insufficient Limit. Please make a recharge or buy some more credits to continue creating videos!"
            })
        }
        const pythonCode = res.output_text
        const latestFilePath = 'code.py'
        fs.writeFile(latestFilePath, pythonCode, (err: any)=>{
            if(err)
            {
                console.log("Got this error while trying to write code to a file ", err)
                return
            }
            console.log("File written successfully!")
        })

        const codeWithoutFences = pythonCode.replace(/^```python\s*/, '').replace(/```\s*$/, '').trim();
        const finalCode = codeWithoutFences.replace(/\u00A0/g, ' ');

        console.log("cleaned code is ", finalCode)      
        console.log("backend secret ",process.env.backend_secret )
        try
            {   
                const responseVideo = await axios.post("http://0.0.0.0:8000/render",{
                secret: process.env.backend_secret,
                code: finalCode, 
            }, {
                responseType: 'arraybuffer'
            })
            const videoBuffer = responseVideo.data
            const videoBase64 = videoBuffer.toString('base64')
            const responsePayload = {
                code: finalCode, 
                video: videoBase64,
                classification: classification.output_text
            }

            return new Response(JSON.stringify(responsePayload),
                {
                status: 200, 
                headers:{
                    'Content-type': 'application/json'
                }
            })}
        catch(err)
        {
            if (axios.isAxiosError(err)) {
                console.error("Axios error message:", err.message);

                if (err.response) {
                console.error("Response status:", err.response.status);
                console.error("Response data:", err.response.data.toString());
                } else if (err.request) {
                console.error("No response received:", err.request);
                } else {
                console.error("Error setting up request:", err.message);
                }
            } else {
                console.error("Unexpected error:", err);
            }
              return NextResponse.json({
                msg: "Rendering Failed!"
            }, 
        {status: 500})
        }
    }
    // This is going to be hit when the classification from the LLM is wrong or it has like completely hallucinated or something.  

    return NextResponse.json({
        msg: "The LLM made a wrong classification"
    })

}


