"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
let cors = require('cors');
const openai_1 = __importDefault(require("openai"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = 3001;
app.use(cors({
    origin: 'http://localhost:3000', // Your Next.js dev server
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
const openai = new openai_1.default({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
    // "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
    // "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
    },
});
const SYSTEM_PROMPT = `You are a helpful, friendly, professional customer service chatbot for ABC Lighting Corp.

You must only use the information provided below. Never search the internet or invent new information beyond what is given.

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
- Image URL: https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Solar_lamp%2C_Victoria%2C_British_Columbia%2C_Canada_03.jpg/255px-Solar_lamp%2C_Victoria%2C_British_Columbia%2C_Canada_03.jpg

2. Solar Powered Driveway Light - Model: DriveGlow 100
- Dimensions: 7 x 7 inches
- Lighting Duration: 8-10 hours per night
- Battery: Rechargeable NiMH
- Solar Panel: Polycrystalline 2W
- Features: Waterproof (IP67), pressure resistant
- Warranty: 2 years
- Image URL: https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Eclairage_autonome_solaire_IMEXLAMP.jpg/330px-Eclairage_autonome_solaire_IMEXLAMP.jpg

3. Solar Powered Outside Wall Light - Model: WallBright 250
- Dimensions: 10 x 5 x 3 inches
- Lighting Duration: 10-12 hours per night
- Battery: Lithium-Ion 20Ah
- Solar Panel: Monocrystalline 5W
- Features: PIR motion sensor, adjustable brightness
- Warranty: 2 years
- Image URL: https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Solarlight.JPG/330px-Solarlight.JPG

---
Conversation Rules:
- Only respond based on the provided Company and Product Information. Never invent new details.
- Always maintain a professional, helpful, and friendly tone.
- After each answer, politely ask: "Is there anything else I can help you with?"
- If the user responds "no" (in any form), ask **only**: "May I have your name and contact information to assist you further?" and **do not ask anything else** after this.
- If the user requests a product image:
  - Start your message with <Image URL> (put no text before the link).
  - Then put a seperator that looks like this _ _ _ _ _ (exactly 5 underscores with spaces in between)
  - Now you must put the rest of the body(if any)

---
Example:

User:
Hi, what products do you offer?

Assistant:
Hello! ABC Lighting Corp offers Solar Powered Street Lights, Solar Powered Driveway Lights, and Solar Powered Outside Wall Lights.  
Is there anything else I can help you with?

User:
Tell me more about the solar street light.

Assistant:
Our Solar Powered Street Light (SunBeam 3000) features a height of 12 feet, provides up to 12 hours of lighting per night, and includes automatic dusk-to-dawn operation with a motion sensor. It is powered by a 60W monocrystalline solar panel and has a 3-year warranty.  
Is there anything else I can help you with?

User:
Can you show me a photo of the street light?

Assistant:
https://upload.wikimedia.org/wikipedia/commons/2/2a/Solar_street_light_01.jpg _ _ _ _ _ Sure! Here’s the photo of our Solar Powered Street Light.  
Is there anything else I can help you with?

User:
No.

Assistant:
Thank you for visiting ABC Lighting Corp! Could you please provide your contact information so we can assist you better in the future?
`;
let messages = [
    {
        role: "system",
        content: SYSTEM_PROMPT,
        images: null
    },
];
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('query -> ', req.query);
    const prompt = req.query.prompt;
    messages.push({
        role: "user",
        content: prompt,
        images: null
    });
    const completion = yield openai.chat.completions.create({
        model: "nvidia/llama-3.1-nemotron-ultra-253b-v1:free",
        messages: messages,
    });
    let content = completion.choices[0].message.content;
    console.log('|' + content + '|');
    let parts = content.split('_ _ _ _ _');
    console.log('parts', parts);
    let images = null;
    if (parts.length > 1) {
        images = [];
        let i = 0;
        while (i < parts.length - 1) {
            images.push(parts[i]);
            i += 1;
        }
    }
    messages.push({ role: 'assistant', content: content, images: images });
    res.send({ role: 'assistant', content: parts[parts.length - 1], images: images });
}));
app.listen(PORT, () => { console.log(`Server started on port ${PORT}`); });
