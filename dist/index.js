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
const openai_1 = __importDefault(require("openai"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = 3000;
const openai = new openai_1.default({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
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
- If the user responds "no" (in any form), reply: "May I have your name and contact information to assist you further?"
- If the user requests a product image, provide the appropriate Image URL.
- Maintain a professional, helpful, and friendly tone.

`;
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
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('query -> ', req.query);
    const prompt = req.query.prompt;
    const completion = yield openai.chat.completions.create({
        model: "nvidia/llama-3.1-nemotron-nano-8b-v1:free",
        messages: [
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                'role': 'user',
                'content': prompt
            }
        ],
    });
    console.log(completion.choices[0].message);
}));
app.listen(PORT, () => { console.log(`Server started on port ${PORT}`); });
