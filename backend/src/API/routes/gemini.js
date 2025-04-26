const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

// Load Gemini API key from .env
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const modelName = 'models/gemini-1.5-flash';

// Helper function to call Gemini API
async function callGeminiAPI(promptText) {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/${modelName}:generateContent`,
      {
        contents: [{
          parts: [{ text: promptText }]
        }]
      },
      {
        params: { key: GEMINI_API_KEY },
        headers: { 'Content-Type': 'application/json' }
      }
    );

    let modelOutput = response.data.candidates[0].content.parts[0].text;

    modelOutput = modelOutput.replace(/```json|```/g, '').trim();
    return JSON.parse(modelOutput);
  } catch (error) {
    console.error('Error calling Gemini API:', error.response?.data || error.message);
    throw new Error('Failed to get response from Gemini API');
  }
}

// Obedience Training Form API Endpoint
router.post('/obedience', async (req, res) => {
  const {
    petType,
    breed,
    currentTrainingLevel,
    priorTraining,
    priorTrainingType,
    commandsKnown,
    skillsToLearn,
    commandReliability,
    responseInDistractions,
    trainingMethod,
    sessionFormat,
    trainingGoals,
    trainingDifficulties,
    struggleSituations
  } = req.body;

  // Create prompt dynamically
  const prompt = `
You are an expert pet behavior analyst and trainer.

Analyze the following pet obedience training details:

Pet Type: ${petType}  
Breed: ${breed}  
Current Training Level: ${currentTrainingLevel}  
Prior Obedience Training: ${priorTraining}  
If Yes, Type of Prior Training: ${priorTrainingType}  
Commands Already Known: ${commandsKnown}  
Skills to Learn/Improve: ${skillsToLearn}  
Reliability in Responding to Commands: ${commandReliability}  
Response in Distracting Environments: ${responseInDistractions}  
Preferred Training Method: ${trainingMethod}  
Preferred Session Format: ${sessionFormat}  
Training Goals: ${trainingGoals}  
Difficulties During Training: ${trainingDifficulties}  
Situations Where Pet Struggles: ${struggleSituations}

Your task:
- Analyze the exact cause(s) of the obedience issues based on the given information.
- Create a personalized and realistic training plan for this pet to address the obedience issues.
- Keep the explanations simple and practical.

Return the result in the following JSON format:

{
  "cause_of_issue": "Explain the cause here",
  "training_plan": "Suggest a suitable step-by-step training plan here"
}
`;

  try {
    const geminiResult = await callGeminiAPI(prompt);
    res.json(geminiResult);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/behavioral', async (req, res) => {
    const {
      petType,
      breed,
      behavioralIssues,
      frequency,
      triggers,
      previousAttempts,
      methodsUsed,
      outcome,
      reactionToStrangers,
      reactionToChildren,
      reactionToAnimals,
      biteHistory,
      biteDetails,
      environment,
      otherPets,
      otherPetsDetails,
      otherIssues
    } = req.body;
  
    const prompt = `
  You are a professional pet trainer specialized in behavioral issues.
  
  Analyze the following details about the pet and suggest:
  
  1. The exact cause of the behavioral issues.
  2. A detailed, suitable training plan.
  
  Pet Details:
  - Pet Type: ${petType}
  - Breed: ${breed}
  - Behavioral Issues: ${behavioralIssues}
  - Other Behavioral Issues (if any): ${otherIssues}
  - Frequency of Behavior: ${frequency}
  - Typical Triggers: ${triggers}
  - Previous Attempts to Correct: ${previousAttempts}
  - Methods Used: ${methodsUsed}
  - Outcome of Attempts: ${outcome}
  - Reaction to Strangers: ${reactionToStrangers}
  - Reaction to Children: ${reactionToChildren}
  - Reaction to Other Animals: ${reactionToAnimals}
  - Bite History: ${biteHistory}
  - Bite Details: ${biteDetails}
  - Environment Where Behavior Occurs: ${environment}
  - Presence of Other Pets: ${otherPets}
  - Other Pets Details: ${otherPetsDetails}
  
  Your task:
  - Find the root cause(s) of the behavior problems.
  - Suggest a complete behavior modification training plan for this pet.
  - Make the suggestions practical and easy to follow.
  
  Return the result strictly in the following JSON format:
  
  {
    "cause_of_issue": "Explain the cause here",
    "training_plan": "Suggest a suitable step-by-step training plan here"
  }
  `;
  
    try {
      const geminiResult = await callGeminiAPI(prompt);
      res.json(geminiResult);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
