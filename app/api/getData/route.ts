import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";



export const GET = async function(){
    const db = await prisma.user.findMany({})
    return NextResponse.json(db)

}  




// we need to now.. look at the logistics of it. 
// So the question is .. can you anyone send a request?
// Well it takes money to finance those API requests .. so I guess 2-3 per person should suffice and so there should be a limit variable/field in the database as well... because you can't really let people abuse it that much. 
// So should there be a payment system for people who wanna buy these API credits for thier personal use .. well I guess there should be something of that sort if they wanna do that. 
// So that would increase their request limit. 
// 20 dollars should give you about 100 video requests? or something of that sort. 
// So we can maybe use the PayPal SDK for that or something like that. 
// So I guess the normal requests should not be used to deduct the limit. 
// The limit variable is only for the video creation aspects of it. So every time you create a video .. then that limit will be deducted. 

