const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function testModels() {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

    // List of likely valid models for the strict API
    const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro-latest"];

    console.log("Checking API Key: " + (process.env.GOOGLE_API_KEY ? "Present" : "Missing"));

    for (const modelName of modelsToTry) {
        try {
            console.log(`Testing model: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            console.log(`✅ SUCCESS: ${modelName} works!`);
            console.log(result.response.text());
            return; // Stop after first success
        } catch (error) {
            console.log(`❌ FAILED: ${modelName} - ${error.message}`);
        }
    }
}

testModels();
