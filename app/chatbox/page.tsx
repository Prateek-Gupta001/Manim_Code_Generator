"use client"
import axios from "axios"
import { redirect, useSearchParams } from "next/navigation"
import { use, useEffect, useRef, useState } from "react";
import Chatbox from "@/components/Chatbox";
import { ObjectId } from "bson"; // or "mongodb"
import { useSession } from "next-auth/react";




export default function Home()
{

    //just set a helper variable which is already set to null and if it does have a value then that value is shown .. so that can be used to show the
    // previous chats.

    


//     {
//   "messages": [
//     {
//       "role": "user",
//       "content": [
//         { "type": "input_text", "text": "Please animate a car driving round and round the planet earth and then the planet saturn appears" }
//       ]
//     }
//   ]
// }
//Okay now here comes the main part in which we need to make the frontend so that there is the chat component for it. 
//And now here are some observations:
//1. We would want to build it so that there is always a loader there when a video is being processed/fetched from the backend. 
//So just show a loader there after the last message is there. 
//2. Now also the chat template/window/view is going to be compeletelt dependent on the messages variable which is a state variable. 
//So basically you would wanna render the messages variable with the whole messasges variable that is eventually sent to the backend and also 
//we need to have to send/append the backend code (the manim code itself) in the messages queue so that the gpt can understand what it had generated and 
//what the user is talking about. 
//So maybe just have a prop/component that takes in the messages variable and renders the messages list. 
//Now also .. the video needs to be rendered. 
//TODO: Rebuild the docker container without the env file. 
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const searchParms = useSearchParams();
    const prompt = searchParms.get('prompt')
    const [messages, setMessages] = useState<any[]>(()=>{
            if(prompt)
            {   
            return  [{
                role: "user",
                content: [
                    { type: "input_text", text: prompt }
                ]
                }
            ]
            }
        return [];
    })
    interface headersInterface
        {
            chatId: string, 
            headerMessage: string
        }
    let timeoutRef = useRef<any>(null)
    const [loading, setLoading] = useState(true)
    const [video, setVideo] = useState<any>(null)
    const [text, setText] = useState("")
    const [chatId, setChatId] = useState<any>()
    const [isExpanded, setisExpanded] = useState(false)
    const [headersList, setheadersList] = useState<headersInterface[]>()
    const [hasError, setHasError] = useState<boolean>(false)
    const { data: session, status } = useSession()
    console.log("The data inside the session is ", session)

    
    useEffect(()=>{
        if(!session?.user.id)
        {
            return;
        }
        const userId = session?.user.id 
        console.log("userId ", userId)
        // send an axios get request to get all the previous chats of the user.
        const res = axios.get(`http://localhost:3000/api/chat/?userId=${userId}`).then((data)=>{
        console.log("data is ", data.data)
        const messagesList = data.data
        const headers = messagesList.map((element:any)=> {
            return {
                chatId : element.id,
                headerMessage: element.Chats[0].content[0].text
            }
        })
        console.log("The headers list is ", headers)
        setheadersList(headers)
        //This is a list of jsons containing the same userId and different chatIds. You need to create a new list of jsons .. containing the header 
        //element that is the first user message sent by the user .. and the chatIds for the same. 
        //just extract the first user messgage and set that as the header or the name of the banner for showing the previous chats. 
        //just have a variable headers .. which is a list of jsons with header and the chatId 
        })
    }, [session?.user.id])
    useEffect(()=>{
        scrollToBottom()
        },
        [messages, loading, video]
    )
    useEffect(()=>{
        //🚨 IMPORTANT:: if there is a messages variable then don't make a new chatId .. because that means that the user is looking at an older chat. 
        const id = new ObjectId().toHexString();
        console.log("Creating a new chatId for this session", id) 
        setChatId(id)
    }, [prompt])
    useEffect(()=>{
        if (!prompt || !chatId) return;
        if(messages[messages.length - 1].role == "assistant")
        {
            console.log("last role was assistant ... returning")
            return;
        }
        setLoading(true)
        // setMessages([{
        //     "role": "user",
        //     "content": [
        //         {"type": "input_text", "text": prompt}
        //     ]
        // }])
        console.log("messages ", messages)
    try{
        console.log("Sending request to the backend with chatId ", chatId)
        axios.post(
        "http://localhost:3000/api/manim_chat", 
        // 1. The data payload is the first argument
        { messages: messages,
            chatId: chatId
         },
        // 2. The config object (including headers, responseType) is the third argument
        {
            withCredentials: true,
            headers: {
                'Accept': 'application/json'
            }
        }
    ).then((response)=>{
        const classification = response.data.classification
        console.log("classification is ", classification)
        const assistantResponse = response.data.assistantResponse
        if(classification == "NORMAL")
        {
            setVideo(null)
            const message = [{
            "role": "assistant",
            "content": [
                { "type": "output_text", "text": assistantResponse }
            ]
            }]
            setMessages([...messages,...message])
            setLoading(false)
        }
        else if(classification == "VIDEO")
        {   //if classification was video. 
            
            const video = response.data.video
            const code = response.data.code
            //send the classification so as to display stuff according to that. 
            const message = [{
            "role": "assistant",
            "content": [
                { "type": "output_text", "text": "code" + code }
            ]
            }]
            setMessages([...messages,...message])
            const videoBlob = base64ToBlob(video, 'video/mp4')
            const url = URL.createObjectURL(videoBlob);
            setVideo(url);
            setLoading(false)
            console.log("Created video url ", url)
        }
    }).catch((err)=>{
        setLoading(false)
        setHasError(true)

    })}catch(err){
        console.log("Error while sending post request ", err)
    }
    }, [messages, chatId]) 
        
    // CHANGED: Updated scrollToBottom function to scroll the container instead of window
    const scrollToBottom = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    };
    const setMessageAndSendRequest = ()=> {
        const message = [{
            "role": "user",
            "content": [
                { "type": "input_text", "text": text}
            ]
            }]
        setMessages([...messages,...message])
        scrollToBottom()
        }
        // Helper function to convert Base64 to Blob
    const base64ToBlob = (base64: any, contentType: any) => {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: contentType })
    };
    if(prompt == null)
    {
        redirect("/chat")
    }
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
    if(!session?.user)
    {
       redirect("/api/auth/signin") 
    }


    //send 
    return <div className="bg-white min-h-screen flex">
        <div className={`${isExpanded ? 'w-64': 'w-17'} h-min-h-screen ml-5 shadow-sm border-r-[1px] border-gray-500`}>
            <button type="button" onClick={()=>{
                setisExpanded(!isExpanded)
                console.log("button was clicked here!")
                console.log("isExpanded ", isExpanded)
                //have some logic for displaying the messages. 
            }} className="text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-black-300 font-medium rounded-lg text-sm mt-10 p-2.5 text-center inline-flex items-center me-2 dark:bg-black-600 dark:hover:bg-black-700 dark:focus:ring-black-800">
            {!isExpanded ? (<svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>):(<svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5H1m0 0l4-4M1 5l4 4"/>
</svg>
)}
            </button>
        {isExpanded?(<button
  className="bg-black mt-3 h-10 ml-5 mb-3 text-white text-sm px-2 py-1 rounded shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
  aria-label="Small black button"
  onClick={()=>{
    redirect("/chat")
  }}
>
  New Chat
</button>):(null)}
        {/* Show the headers list if isExpanded is true. */}
        {isExpanded && headersList ? (headersList.map((element:headersInterface)=>{
            return <>
            <div  className="pt-7 mt-3 font-semibold text-md shadow-sm hover:cursor-pointer hover:bg-slate-200" onClick={()=>{
                redirect(`/previousChats/${element.chatId}`)
            }}>{element.headerMessage.slice(0,25) + "..."}</div>
            </>
        })): (<div></div>)}

        </div>
        
        {/* CHANGED: Wrapped content in relative container and adjusted structure */}
        <div className="flex-1 relative flex flex-col h-screen">
            {/* CHANGED: Added scrollable container with hidden scrollbar and padding at bottom for input */}
            <div  ref={scrollContainerRef} className="overflow-y-auto flex-1 pb-50 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {/* CHANGED: Added CSS class to hide webkit scrollbar */}
                <style jsx>{`
                    .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
                <div className="pt-10">
                    <Chatbox isExpanded={isExpanded} text={messages}></Chatbox>
                    {/* Whenever loading is true show a spinning bar after the latest message.*/}
                    {loading ? ( <div role="status" className="flex items-center justify-center h-20">
                                <svg aria-hidden="true" className="w-15 h-15  text-gray-200 animate-spin dark:text-gray-600 fill-slate-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                            ):(video ? (<video className="pt-10 pl-250" controls autoPlay loop muted>
                        <source src={video}  type="video/mp4"></source>
                    </video>):(hasError ? (
                        <div className="flex justify-center">
                        <div className="bg-red-500 w-300 mt-3 text-white text-lg font-semibold text-center"> Error has occurred! <span className="hover:cursor-pointer hover:und" onClick={()=>{
                            setMessageAndSendRequest()
                        }}>Retry? </span> </div>
                        </div>
                        ):(null)))}  
                </div>
            </div>
            {/* CHANGED: Made input container fixed at bottom with white opaque background */}
            <div className={`fixed bottom-0 ${isExpanded ? 'left-[17rem]': 'left-[5.25rem]'} right-0 bg-white border-t border-gray-200 px-4 py-4 z-10`}>
                <div className="flex items-center max-w-4xl mx-auto">
                    <textarea 
                    onKeyDown={(e)=> {
                        if(e.key == "Enter")
                        {
                            setMessageAndSendRequest()
                        }
                    }}
                    onChange={(e)=>{
                        if(timeoutRef.current)
                        {
                            clearTimeout(timeoutRef.current)
                        }
                        setTimeout(()=>{setText(e.target.value)}, 300)
                        
                    }} 
                    id="chat" rows={4} className="block flex-1 mx-4 p-2.5 text-xl text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your message..."></textarea>
                        <button onClick={setMessageAndSendRequest}type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13V1m0 0L1 5m4-4l4 4"/>
                            </svg>
                        </button>
                </div>
            </div>
        </div>
    </div>
}