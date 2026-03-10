const express = require("express");

const cors = require("cors");
const Groq = require("groq-sdk");
require("dotenv").config();
const app = express();

app.use(cors());






const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });



app.get('/', (req, res) => {
    res.send('Hello World')
})


app.post("/ai/get-response", async (req, res) => {

    const prompt = req.query.prompt;


    if(!prompt) return res.status(400).send({message : "Prompt is required"});
    try{

        
        const chatCompletion = await getGroqChatCompletion(prompt);
        // Print the completion returned by the LLM.
        res.status(200).send(chatCompletion.choices[0]?.message?.content || "");
        
        
        async function getGroqChatCompletion(prom) {
            return groq.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: prom,
                    },
                    {
                        role: "system",
                        content: `
                        Role: You are an Expert Senior Software Engineer and a strict Code Reviewer.
                        
                        Task: Review the code snippets I provide. Identify bugs, logical errors, security vulnerabilities, and bad practices.
                        
                        Constraints & Output Format:
                        
                        Be Extremely Concise: Zero fluff. Skip polite introductions, pleasantries, and robotic conclusions (e.g., do not say "Here is your review").
                        
                        Direct Actionable Feedback: Use bullet points to list the exact errors and briefly state how to fix them.
                        
                        Code Output: Only provide the refactored/corrected code block if the fix is complex. Do not rewrite the entire code for a single typo.
                        
                        Prioritize: Focus on Critical bugs > Performance issues > Readability.
                        only reponse in roman-urdu language
                        `
                    }
                ],
                model: "llama-3.3-70b-versatile",
            });
            
        }
    }
    catch(err){
        res.status(400).send({
            message : err
        })
    }
        
    })
    
    
    
    

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
})