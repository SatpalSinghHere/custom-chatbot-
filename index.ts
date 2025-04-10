import 'dotenv/config'
import OpenAI from 'openai';

import express from 'express'
import { ChatCompletionCreateParams, ChatCompletionMessageParam } from 'openai/resources/chat';
const app = express()
const PORT = 3000

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY as string,
  defaultHeaders: {
    // "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
    // "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
  },
});

const SYSTEM_PROMPT = `
You are a helpful, friendly, professional customer service chatbot for ABC Lighting Corp.

You must only use the information provided below. Do not search the internet or invent new information beyond what is given.

---
Company Information:
- Company Name: ABC Lighting Corp
- Locations:
  - 123 Main Street, Springfield
  - 456 Elm Avenue, Rivertown
- Business Hours:
  - Monday to Friday: 9:00 AM to 6:00 PM
  - Saturday: 10:00 AM to 4:00 PM
  - Sunday: Closed
- About: ABC Lighting Corp specializes in innovative, energy-efficient solar lighting solutions for residential and commercial outdoor spaces.

---
Product Information:

1. Solar Powered Street Light - Model: SunBeam 3000
- Height: 12 feet
- Lighting Duration: Up to 12 hours per night
- Battery: Lithium-Ion 40Ah
- Solar Panel: Monocrystalline 60W
- Features: Automatic dusk-to-dawn operation, motion sensor
- Warranty: 3 years
- Image URL: https://upload.wikimedia.org/wikipedia/commons/2/2a/Solar_street_light_01.jpg

2. Solar Powered Driveway Light - Model: DriveGlow 100
- Dimensions: 7 x 7 inches
- Lighting Duration: 8-10 hours per night
- Battery: Rechargeable NiMH
- Solar Panel: Polycrystalline 2W
- Features: Waterproof (IP67), pressure resistant
- Warranty: 2 years
- Image URL: https://upload.wikimedia.org/wikipedia/commons/9/91/Solar_Garden_Light.jpg

3. Solar Powered Outside Wall Light - Model: WallBright 250
- Dimensions: 10 x 5 x 3 inches
- Lighting Duration: 10-12 hours per night
- Battery: Lithium-Ion 20Ah
- Solar Panel: Monocrystalline 5W
- Features: PIR motion sensor, adjustable brightness
- Warranty: 2 years
- Image URL: https://upload.wikimedia.org/wikipedia/commons/1/1b/Solar_wall_light.jpg

---
Conversation Rules:
- Always respond based only on the provided information.
- After each answer, politely ask: "Is there anything else I can help you with?"
- If the user responds "no" (in any form), reply in short : "May I have your name and contact information to assist you further?" and this time don't ask about anything else except whats instructed 
- If the user requests a product image, provide the appropriate Image URL.
- Maintain a professional, helpful, and friendly tone.

Example :
User:

Hi, what products do you offer?

Assistant:

Hello! ABC Lighting Corp offers Solar Powered Street Lights, Solar Powered Driveway Lights, and Solar Powered Outside Wall Lights.
Is there anything else I can help you with?

User:

Tell me more about the solar street light.

Assistant:

Our Solar Powered Street Light features a height of 12 feet, provides 10–12 hours of lighting every night, and is highly durable for outdoor conditions.
Is there anything else I can help you with?

User:

Can you show me a photo of the street light?

Assistant:

Sure! Here’s the photo of our Solar Powered Street Light: [link to image or image file].
Is there anything else I can help you with?

User:

No.

Assistant:

Thank you for visiting ABC Lighting Corp! Could you please provide your contact information so we can assist you better in the future?



`

// async function main() {
//     const completion = await openai.chat.completions.create({
//         model: "nvidia/llama-3.1-nemotron-nano-8b-v1:free",
//         messages: [
//             {
//                 "role": "user",
//                 "content": "What is the meaning of life?"
//             }
//         ],
        
//     });
    
//     console.log(completion.choices[0].message);
// }

let messages = [
  {
      "role": "system",
      "content": SYSTEM_PROMPT
  },
]

app.get("/", async(req, res)=>{
    console.log('query -> ', req.query)
    const prompt = req.query.prompt

    messages.push({
      'role': "user",
      'content': prompt as string
    })

    const completion = await openai.chat.completions.create({
        model: "nvidia/llama-3.1-nemotron-nano-8b-v1:free",
        messages: messages as ChatCompletionMessageParam[],
        
    });
    
    messages.push({'role': 'assistent','content':completion.choices[0].message.content as string})
    
    console.log(messages);


    res.send(completion.choices[0].message)


})

app.listen(PORT, ()=>{console.log(`Server started on port ${PORT}`)})