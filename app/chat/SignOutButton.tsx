"use client"
import { signOut } from "next-auth/react"

export default function SignOutButton()
{
    return <div className="pr-15"> <button type="button" onClick={()=>{
        console.log("Trying to signout!")
              signOut({ callbackUrl: '/' })
            }}className="text-white text-xl bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg  px-5 py-2.5  dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                Sign Out</button>
            </div>
}