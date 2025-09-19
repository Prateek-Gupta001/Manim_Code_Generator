import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


//there needs to be two endpoints .. one for getting all the chats and one for getting a specific chat. 
//This is for getting all the chats given the userId. 


export const GET = async function(req: NextRequest,res: NextResponse){

    const chatId = req.nextUrl.searchParams.get("chatId")
    console.log("chat Id is ", chatId)
    if(!chatId)
    {
        return NextResponse.json({msg: "userId missing in the request!"}, {status: 400})
    }
    const db = await prisma.chat.findUnique({where:{
        id: chatId
    }})
    const messages = db?.Chats
    console.log("messages ", messages)

    return NextResponse.json({messages: messages})

}  
