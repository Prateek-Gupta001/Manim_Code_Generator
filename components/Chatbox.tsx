import ReactMarkdown from 'react-markdown';


export default function Chatbox({text, isExpanded}: {text: any, isExpanded: boolean}){
   console.log("isExpanded ", isExpanded)
  if (!text || text.length === 0) {
    return null;
  }
    return <div className="items-start text-xl gap-2.5">
   {text.map((element:any)=>(
      element.role == "user" ? (<div className='pt-10 ml-90'><div className="flex flex-col w-full max-w-[640px]  p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
      <p className=" font-normal py-2.5 text-gray-900 dark:text-white"><ReactMarkdown>{element.content[0].text}</ReactMarkdown></p>
   </div></div>): ((element.content[0].text.slice(0, 4) != "code" ? (<div className={`pt-10 ${isExpanded ? "mr-53" : "mr-100"}`}><div className="flex ml-auto flex-col w-full max-w-[640px] p-4 border-gray-200 bg-gray-300 rounded-e-xl rounded-es-xl dark:bg-gray-700">
      <p className=" font-normal py-2.5 text-gray-900 dark:text-white"><ReactMarkdown>{element.content[0].text}</ReactMarkdown></p>
   </div> </div>): null)) 
   ))}
</div>
}