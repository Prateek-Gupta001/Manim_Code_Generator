import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


//there needs to be two endpoints .. one for getting all the chats and one for getting a specific chat. 
//This is for getting all the chats given the userId. 


export const GET = async function(req: NextRequest,res: NextResponse){

    const userId = req.nextUrl.searchParams.get("userId");
    if(!userId)
    {
        return NextResponse.json({msg: "userId missing in the request!"}, {status: 400})
    }
    const db = await prisma.chat.findMany({where:{
        userId: userId
    }})
    return NextResponse.json(db)

}  
