// client/src/pages/TrainingForm.jsx

import React, { useState } from 'react';
import axios from 'axios';

const TrainingForm = () => {
  const [activeForm, setActiveForm] = useState('behavioral'); // Switch between forms
  const [behavioralData, setBehavioralData] = useState({
    petType: '',
    breed: '',
    behavioralIssues: [],
    frequency: '',
    triggers: '',
    previousAttempts: '',
    methodsUsed: '',
    outcome: '',
    reactionToStrangers: '',
    reactionToChildren: '',
    reactionToAnimals: '',
    biteHistory: '',
    biteDetails: '',
    environment: '',
    otherPets: '',
    otherPetsDetails: '',
    otherIssues: ''
  });

  const [obedienceData, setObedienceData] = useState({
    petType: '',
    breed: '',
    currentTrainingLevel: '',
    priorTraining: '',
    priorTrainingType: '',
    commandsKnown: '',
    skillsToLearn: [],
    commandReliability: '',
    responseInDistractions: '',
    trainingMethod: '',
    sessionFormat: '',
    trainingGoals: '',
    trainingDifficulties: '',
    struggleSituations: ''
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle behavioral form change
  const handleBehavioralChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setBehavioralData(prev => {
        const updatedIssues = checked
          ? [...prev.behavioralIssues, value]
          : prev.behavioralIssues.filter(issue => issue !== value);
        return { ...prev, behavioralIssues: updatedIssues };
      });
    } else {
      setBehavioralData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle obedience form change
  const handleObedienceChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setObedienceData(prev => {
        const updatedSkills = checked
          ? [...prev.skillsToLearn, value]
          : prev.skillsToLearn.filter(skill => skill !== value);
        return { ...prev, skillsToLearn: updatedSkills };
      });
    } else {
      setObedienceData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url = activeForm === 'behavioral'
      ? 'http://localhost:8090/gemini/behavioral'
      : 'http://localhost:8090/gemini/obedience';

    const dataToSend = activeForm === 'behavioral' ? behavioralData : obedienceData;

    try {
      const response = await axios.post(url, dataToSend);
      setResult(response.data);
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Pet Training Form</h1>

      {/* Buttons to switch between Behavioral / Obedience */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setActiveForm('behavioral')}>Behavioral Training</button>
        <button onClick={() => setActiveForm('obedience')}>Obedience Training</button>
      </div>

      {/* Behavioral Form */}
      {activeForm === 'behavioral' && (
        <form onSubmit={handleSubmit}>
          <h2>Behavioral Training Form</h2>
          <input name="petType" placeholder="Pet Type (Dog, Cat, etc.)" onChange={handleBehavioralChange} />
          <input name="breed" placeholder="Breed" onChange={handleBehavioralChange} />

          <h4>Behavioral Issues:</h4>
          <label><input type="checkbox" value="Aggression" onChange={handleBehavioralChange} /> Aggression</label><br/>
          <label><input type="checkbox" value="Fear or anxiety" onChange={handleBehavioralChange} /> Fear or anxiety</label><br/>
          <label><input type="checkbox" value="Resource guarding" onChange={handleBehavioralChange} /> Resource guarding</label><br/>
          <label><input type="checkbox" value="Excessive barking" onChange={handleBehavioralChange} /> Excessive barking</label><br/>
          {/* Add other issues similarly */}
          <input name="otherIssues" placeholder="Other behavioral issues" onChange={handleBehavioralChange} />

          <input name="frequency" placeholder="How often does it occur?" onChange={handleBehavioralChange} />
          <input name="triggers" placeholder="What triggers the behavior?" onChange={handleBehavioralChange} />

          <h4>Previous Attempts to Correct:</h4>
          <input name="previousAttempts" placeholder="Have you tried to correct it? (Yes/No)" onChange={handleBehavioralChange} />
          <input name="methodsUsed" placeholder="Methods used" onChange={handleBehavioralChange} />
          <input name="outcome" placeholder="Outcome of attempts" onChange={handleBehavioralChange} />

          <h4>Socialization:</h4>
          <input name="reactionToStrangers" placeholder="Reaction to strangers" onChange={handleBehavioralChange} />
          <input name="reactionToChildren" placeholder="Reaction to children" onChange={handleBehavioralChange} />
          <input name="reactionToAnimals" placeholder="Reaction to other animals" onChange={handleBehavioralChange} />
          <input name="biteHistory" placeholder="Has your pet bitten? (Yes/No)" onChange={handleBehavioralChange} />
          <input name="biteDetails" placeholder="Bite incident details" onChange={handleBehavioralChange} />

          <h4>Environment:</h4>
          <input name="environment" placeholder="Where does behavior occur?" onChange={handleBehavioralChange} />
          <input name="otherPets" placeholder="Other pets? (Yes/No)" onChange={handleBehavioralChange} />
          <input name="otherPetsDetails" placeholder="Details about other pets" onChange={handleBehavioralChange} />

          <button type="submit" style={{ marginTop: '20px' }}>Submit Behavioral Form</button>
        </form>
      )}

      {/* Obedience Form */}
      {activeForm === 'obedience' && (
        <form onSubmit={handleSubmit}>
          <h2>Obedience Training Form</h2>
          <input name="petType" placeholder="Pet Type (Dog, Cat, etc.)" onChange={handleObedienceChange} />
          <input name="breed" placeholder="Breed" onChange={handleObedienceChange} />
          <input name="currentTrainingLevel" placeholder="Current Training Level" onChange={handleObedienceChange} />
          <input name="priorTraining" placeholder="Prior Training (Yes/No)" onChange={handleObedienceChange} />
          <input name="priorTrainingType" placeholder="Type of Prior Training" onChange={handleObedienceChange} />
          <input name="commandsKnown" placeholder="Commands Known (Sit, Stay...)" onChange={handleObedienceChange} />

          <h4>Skills to Learn/Improve:</h4>
          <label><input type="checkbox" value="Sit" onChange={handleObedienceChange} /> Sit</label><br/>
          <label><input type="checkbox" value="Down" onChange={handleObedienceChange} /> Down</label><br/>
          <label><input type="checkbox" value="Stay" onChange={handleObedienceChange} /> Stay</label><br/>
          {/* Add other skills similarly */}

          <input name="commandReliability" placeholder="Command Reliability (Always, Sometimes, Rarely)" onChange={handleObedienceChange} />
          <input name="responseInDistractions" placeholder="Response in Distracting Environments (Yes/No)" onChange={handleObedienceChange} />
          <input name="trainingMethod" placeholder="Preferred Training Method" onChange={handleObedienceChange} />
          <input name="sessionFormat" placeholder="Session Format (Group, Private, Online)" onChange={handleObedienceChange} />
          <input name="trainingGoals" placeholder="Training Goals" onChange={handleObedienceChange} />
          <input name="trainingDifficulties" placeholder="Training Difficulties" onChange={handleObedienceChange} />
          <input name="struggleSituations" placeholder="Situations where struggles happen" onChange={handleObedienceChange} />

          <button type="submit" style={{ marginTop: '20px' }}>Submit Obedience Form</button>
        </form>
      )}

      {/* Loading or Result Section */}
      {loading && <p>Loading...</p>}

      {result && (
        <div style={{ marginTop: '30px' }}>
          <h2>Result from Gemini AI</h2>
          <h3>Cause of Issue:</h3>
          <p>{result.cause_of_issue}</p>
          <h3>Training Plan:</h3>
          <p>{result.training_plan}</p>
        </div>
      )}
    </div>
  );
};

export default TrainingForm;
