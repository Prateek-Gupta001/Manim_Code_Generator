"use client"
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import Link from "next/link";
import { useRef, useState } from "react";
import { exit } from "process";

export default function Home() {
  const router = useRouter()
  const {data: session, status} = useSession()
  const [prompt, setPrompt] = useState<any>("")
  let typingPrompt = useRef(" ")
  let timeoutRef = useRef<any>(null)

  if(status == "loading")
    {
      return (  
      <div role="status" className="flex items-center justify-center min-h-screen">
          <svg aria-hidden="true" className="w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-slate-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span className="sr-only">Loading...</span>
      </div>
  )
    }
  console.log("status ", status)    
  
  return (
  <>
    <div className="bg-white min-h-screen"> 
<label className="block mt-30 text-7xl text-center font-bold text-gray-900">What do you wanna animate?</label>
<textarea 
  onKeyDown={(e)=> {
    if(e.key == "Enter")
    {
      router.push(`/chatbox?prompt=${encodeURIComponent(prompt)}`)
    }
  }}
  onChange={(e: any)=>{
  if(timeoutRef.current)
  {
    clearTimeout(timeoutRef.current)
  }
  timeoutRef.current = setTimeout(()=> {
    setPrompt(e.target.value)
  }, 300)
}} id="message" rows={4} className="block mx-auto mt-15 p-2.5 w-1/2 h-50 placeholder:text-2xl text-2xl text-gray-900 bg-slate-50-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="A monkey eating a banana...">
</textarea>
  <button type="button" onClick={()=>{
    console.log("prompt is ", prompt)
    if(prompt == null)
    {
      exit
    }
    //send an axios post request to the backend for this. but this is going to be sent on the chatbox page.tsx only not on this. 
    //so what happens after you send that post request... well it should a chatbox with the llm then generating the video after sometime (a loader is shown then till the video creation is in progress.)
    //so redirect the user to the /chatbox page ... with the chat message as input)
    router.push(`/chatbox?prompt=${encodeURIComponent(prompt)}`)
  }}className="text-white lg:ml-400  mt-1 bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-semibold rounded-lg text-lg px-5 py-2.5 text-center me-2 mb-2">
    Animate</button>
  </div>  
    </>
  );
}

// Okay so this is the point wherein we would see the actual chatbox and stuff like that. 
// So what should they see?


