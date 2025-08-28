//This is the classifier function that we have. 

import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { ResponseInput } from "openai/resources/responses/responses.mjs";




export default async function classifier(prompt: ResponseInput , client: OpenAI)
{

     const classification = await client.responses.create({
            model: "gpt-4.1",
            instructions: `Classify user prompts as either "NORMAL" or "VIDEO" based on their intent.
                NORMAL - Use for conversational messages and queries about existing content:
    
                Greetings: "Hey", "Hello", "Hi there"
                General questions: "How are you?", "What can you help me with?"
                Questions about previously created videos: "What happens at 2:30 in that video?", "Explain what's shown in the animation"
                Follow-up discussions: "That was helpful", "Can you clarify that part?"
    
                VIDEO - Use for requests that require creating new video content:
    
                Animation requests: "Make an animation of a cat chasing a mouse"
                Educational videos: "Create a video explaining photosynthesis"
                Tutorial requests: "Make a step-by-step video showing how to tie a knot"
                Demonstration videos: "Animate how a car engine works"
    
                Output only the classification: "NORMAL" or "VIDEO"
            `,
            input: prompt,
        });
    return classification
    
}