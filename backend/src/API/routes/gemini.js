const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Helper function to call Gemini API
async function callGeminiAPI(promptText) {
  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent',
      {
        contents: [
          {
            role: "user",
            parts: [{ text: promptText }]
          }
        ]
        
      },
      {
        params: { key: GEMINI_API_KEY },
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const modelOutput = response.data.candidates[0]?.content?.parts[0]?.text;

    if (!modelOutput) {
      throw new Error('No response text received from Gemini');
    }

    const cleanOutput = modelOutput
      .replace(/```json/g, '') // remove ```json start
      .replace(/```/g, '')      // remove ``` end
      .trim();

    return JSON.parse(cleanOutput);
  } catch (error) {
    console.error('Error calling Gemini API:', error.response?.data || error.message);
    throw new Error('Failed to get response from Gemini API');
  }
}

// ---------------------------
// Behavioral Training Endpoint
// ---------------------------
router.post('/behavioral', async (req, res) => {
  const {
    petType,
    breed,
    behavioralIssues,
    frequencyOccurrence,
    behaviorLocation,
    behaviorTriggers,
    previousAttempts,
    previousMethods,
    previousOutcome,
    reactionToStrangers,
    reactionToChildren,
    reactionToAnimals,
    biteHistory,
    biteDetails,
    environmentOccurrence,
    otherPets,
    otherPetsDetails
  } = req.body;

  const prompt = `
You are an expert pet behavior analyst.

Analyze the following behavioral details:

Pet Type: ${petType}
Breed: ${breed}
Behavioral Issues: ${behavioralIssues}
Frequency of Occurrence: ${frequencyOccurrence}
Behavior Locations: ${behaviorLocation}
Behavior Triggers: ${behaviorTriggers}
Previous Attempts to Correct: ${previousAttempts}
Methods Used: ${previousMethods}
Outcome of Methods: ${previousOutcome}
Reactions to Strangers: ${reactionToStrangers}
Reactions to Children: ${reactionToChildren}
Reactions to Other Animals: ${reactionToAnimals}
Bite History: ${biteHistory} (${biteDetails})
Environment Where Issues Occur: ${environmentOccurrence}
Other Pets in Household: ${otherPets} (${otherPetsDetails})

Your task:
- Analyze and identify the cause of the behavioral issue(s)
- Suggest a personalized behavior modification and training plan
- Keep it simple and actionable

Return the result in the following JSON format:

{
  "cause_of_issue": "Explain here",
  "training_plan": "Step-by-step plan here"
}
`;

  try {
    const geminiResult = await callGeminiAPI(prompt);
    res.json(geminiResult);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ---------------------------
// Obedience Training Endpoint
// ---------------------------
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
- Analyze the exact cause(s) of the obedience issues
- Create a personalized and realistic training plan
- Keep explanations practical

Return the result in the following JSON format:

{
  "cause_of_issue": "Explain here",
  "training_plan": "Step-by-step plan here"
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
