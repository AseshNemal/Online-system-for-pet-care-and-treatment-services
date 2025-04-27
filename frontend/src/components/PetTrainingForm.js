"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "../petTrainingForm.css"

const PetTrainingForm = () => {
  const [activeTab, setActiveTab] = useState("behavioral")
  const [behavioralData, setBehavioralData] = useState({
    petType: "",
    breed: "",
    behavioralIssues: [],
    frequency: "",
    triggers: "",
    previousAttempts: "",
    methodsUsed: "",
    outcome: "",
    reactionToStrangers: "",
    reactionToChildren: "",
    reactionToAnimals: "",
    biteHistory: "",
    biteDetails: "",
    environment: "",
    otherPets: "",
    otherPetsDetails: "",
    otherIssues: "",
  })

  const [obedienceData, setObedienceData] = useState({
    petType: "",
    breed: "",
    currentTrainingLevel: "",
    priorTraining: "",
    priorTrainingType: "",
    commandsKnown: "",
    skillsToLearn: [],
    commandReliability: "",
    responseInDistractions: "",
    trainingMethod: "",
    sessionFormat: "",
    trainingGoals: "",
    trainingDifficulties: "",
    struggleSituations: "",
  })

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [behavioralFormValid, setBehavioralFormValid] = useState(false)
  const [obedienceFormValid, setObedienceFormValid] = useState(false)

  // Pet type options
  const petTypeOptions = [
    { value: "dog", label: "Dog" },
    { value: "cat", label: "Cat" },
    { value: "bird", label: "Bird" },
    { value: "rabbit", label: "Rabbit" },
    { value: "hamster", label: "Hamster" },
    { value: "guinea_pig", label: "Guinea Pig" },
    { value: "reptile", label: "Reptile" },
    { value: "other", label: "Other" },
  ]

  // Behavioral issues options
  const behavioralIssuesOptions = [
    { id: "aggression", label: "Aggression (toward people, dogs, other animals)" },
    { id: "fear", label: "Fear or anxiety (noises, strangers, separation)" },
    { id: "guarding", label: "Resource guarding (food, toys, space)" },
    { id: "barking", label: "Excessive barking or vocalization" },
    { id: "destructive", label: "Destructive behavior (chewing, digging)" },
    { id: "soiling", label: "House soiling (inappropriate urination/defecation)" },
    { id: "jumping", label: "Jumping on people" },
    { id: "chasing", label: "Chasing (cars, animals, people)" },
    { id: "mounting", label: "Mounting/humping" },
    { id: "escaping", label: "Escaping/running away" },
  ]

  // Obedience skills options
  const obedienceSkillsOptions = [
    { id: "sit", label: "Sit" },
    { id: "down", label: "Down" },
    { id: "stay", label: "Stay" },
    { id: "come", label: "Come/Recall" },
    { id: "leave", label: "Leave it/Drop it" },
    { id: "heel", label: "Heel/Leash walking" },
    { id: "place", label: "Place/Go to bed" },
    { id: "wait", label: "Wait at door" },
    { id: "crate", label: "Crate training" },
  ]

  function formatText(text) {
    if (!text) return ""
    // Replace **text** with <strong>text</strong>
    return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
  }

  // Handle behavioral form change
  const handleBehavioralChange = (e) => {
    const { name, value } = e.target
    setBehavioralData((prev) => ({ ...prev, [name]: value }))
  }

  // Validate behavioral form
  useEffect(() => {
    const validateBehavioralForm = () => {
      // Check required fields
      const requiredFields = [
        behavioralData.petType,
        behavioralData.breed,
        behavioralData.frequency,
        behavioralData.triggers,
        behavioralData.previousAttempts,
        behavioralData.reactionToStrangers,
        behavioralData.reactionToChildren,
        behavioralData.reactionToAnimals,
        behavioralData.biteHistory,
        behavioralData.environment,
        behavioralData.otherPets,
      ]

      // Check conditional fields
      if (behavioralData.previousAttempts === "yes") {
        requiredFields.push(behavioralData.methodsUsed, behavioralData.outcome)
      }

      if (behavioralData.biteHistory === "yes") {
        requiredFields.push(behavioralData.biteDetails)
      }

      if (behavioralData.otherPets === "yes") {
        requiredFields.push(behavioralData.otherPetsDetails)
      }

      // Check if at least one behavioral issue is selected
      const hasSelectedIssue = behavioralData.behavioralIssues.length > 0

      // All required fields must be filled and at least one issue selected
      const isValid = requiredFields.every((field) => field.trim() !== "") && hasSelectedIssue

      setBehavioralFormValid(isValid)
    }

    validateBehavioralForm()
  }, [behavioralData])

  // Handle behavioral checkbox change
  const handleBehavioralCheckboxChange = (id) => {
    setBehavioralData((prev) => {
      const isSelected = prev.behavioralIssues.includes(id)
      const updatedIssues = isSelected
        ? prev.behavioralIssues.filter((issue) => issue !== id)
        : [...prev.behavioralIssues, id]
      return { ...prev, behavioralIssues: updatedIssues }
    })
  }

  // Handle obedience form change
  const handleObedienceChange = (e) => {
    const { name, value } = e.target
    setObedienceData((prev) => ({ ...prev, [name]: value }))
  }

  // Validate obedience form
  useEffect(() => {
    const validateObedienceForm = () => {
      // Check required fields
      const requiredFields = [
        obedienceData.petType,
        obedienceData.breed,
        obedienceData.currentTrainingLevel,
        obedienceData.priorTraining,
        obedienceData.commandsKnown,
        obedienceData.commandReliability,
        obedienceData.responseInDistractions,
        obedienceData.trainingMethod,
        obedienceData.sessionFormat,
        obedienceData.trainingGoals,
        obedienceData.trainingDifficulties,
        obedienceData.struggleSituations,
      ]

      // Check conditional fields
      if (obedienceData.priorTraining === "yes") {
        requiredFields.push(obedienceData.priorTrainingType)
      }

      // Check if at least one skill is selected
      const hasSelectedSkill = obedienceData.skillsToLearn.length > 0

      // All required fields must be filled and at least one skill selected
      const isValid = requiredFields.every((field) => field.trim() !== "") && hasSelectedSkill

      setObedienceFormValid(isValid)
    }

    validateObedienceForm()
  }, [obedienceData])

  // Handle obedience checkbox change
  const handleObedienceCheckboxChange = (id) => {
    setObedienceData((prev) => {
      const isSelected = prev.skillsToLearn.includes(id)
      const updatedSkills = isSelected
        ? prev.skillsToLearn.filter((skill) => skill !== id)
        : [...prev.skillsToLearn, id]
      return { ...prev, skillsToLearn: updatedSkills }
    })
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const url =
      activeTab === "behavioral" ? "http://localhost:8090/gemini/behavioral" : "http://localhost:8090/gemini/obedience"

    const dataToSend = activeTab === "behavioral" ? behavioralData : obedienceData

    try {
      const response = await axios.post(url, dataToSend)
      setResult(response.data)
    } catch (error) {
      console.error("Error:", error)
      alert("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="training-form-container">
      <h1 className="form-title">Pet Training Assessment</h1>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === "behavioral" ? "active" : ""}`}
          onClick={() => setActiveTab("behavioral")}
        >
          Behavioral Training
        </button>
        <button
          className={`tab-button ${activeTab === "obedience" ? "active" : ""}`}
          onClick={() => setActiveTab("obedience")}
        >
          Obedience Training
        </button>
      </div>

      {/* Behavioral Training Form */}
      {activeTab === "behavioral" && (
        <div className="form-card">
          <div className="card-header">
            <h2>Behavioral Training Assessment</h2>
            <p>Help us understand your pet's behavioral issues so we can create a customized training plan.</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="card-content">
              {/* Basic Information */}
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="petType" className="required-label">
                    Pet Type
                  </label>
                  <select
                    id="petType"
                    name="petType"
                    value={behavioralData.petType}
                    onChange={handleBehavioralChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select pet type</option>
                    {petTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="breed" className="required-label">
                    Breed
                  </label>
                  <input
                    id="breed"
                    name="breed"
                    type="text"
                    placeholder="Breed"
                    value={behavioralData.breed}
                    onChange={handleBehavioralChange}
                    required
                  />
                </div>
              </div>

              <div className="form-divider"></div>

              {/* Behavioral Issues */}
              <div className="form-section">
                <h3>
                  Behavioral Issues to Address <span className="required-indicator">*</span>
                </h3>
                <div className="checkbox-container">
                  {behavioralIssuesOptions.map((issue) => (
                    <div key={issue.id} className="checkbox-item">
                      <input
                        type="checkbox"
                        id={`behavioral-${issue.id}`}
                        checked={behavioralData.behavioralIssues.includes(issue.id)}
                        onChange={() => handleBehavioralCheckboxChange(issue.id)}
                      />
                      <label htmlFor={`behavioral-${issue.id}`}>{issue.label}</label>
                    </div>
                  ))}
                </div>
                <div className="form-group">
                  <label htmlFor="otherIssues">Other Issues</label>
                  <input
                    id="otherIssues"
                    name="otherIssues"
                    type="text"
                    placeholder="Any other behavioral issues"
                    value={behavioralData.otherIssues}
                    onChange={handleBehavioralChange}
                  />
                </div>
              </div>

              <div className="form-divider"></div>

              {/* Frequency and Triggers */}
              <div className="form-section">
                <h3>Frequency and Triggers</h3>
                <div className="form-group">
                  <label htmlFor="frequency" className="required-label">
                    How often does this behavior occur?
                  </label>
                  <select
                    id="frequency"
                    name="frequency"
                    value={behavioralData.frequency}
                    onChange={handleBehavioralChange}
                    required
                  >
                    <option value="">Select frequency</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="occasionally">Occasionally</option>
                    <option value="rarely">Rarely</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="triggers" className="required-label">
                    What triggers this behavior?
                  </label>
                  <textarea
                    id="triggers"
                    name="triggers"
                    placeholder="Describe what seems to trigger this behavior"
                    value={behavioralData.triggers}
                    onChange={handleBehavioralChange}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="form-divider"></div>

              {/* Previous Attempts */}
              <div className="form-section">
                <h3>Previous Attempts to Correct</h3>
                <div className="form-group">
                  <label className="required-label">Have you tried to address this behavior before?</label>
                  <div className="radio-group">
                    <div className="radio-item">
                      <input
                        type="radio"
                        id="previous-yes"
                        name="previousAttempts"
                        value="yes"
                        checked={behavioralData.previousAttempts === "yes"}
                        onChange={handleBehavioralChange}
                        required
                      />
                      <label htmlFor="previous-yes">Yes</label>
                    </div>
                    <div className="radio-item">
                      <input
                        type="radio"
                        id="previous-no"
                        name="previousAttempts"
                        value="no"
                        checked={behavioralData.previousAttempts === "no"}
                        onChange={handleBehavioralChange}
                        required
                      />
                      <label htmlFor="previous-no">No</label>
                    </div>
                  </div>
                </div>
                {behavioralData.previousAttempts === "yes" && (
                  <>
                    <div className="form-group">
                      <label htmlFor="methodsUsed" className="required-label">
                        Methods Used
                      </label>
                      <textarea
                        id="methodsUsed"
                        name="methodsUsed"
                        placeholder="What methods have you tried?"
                        value={behavioralData.methodsUsed}
                        onChange={handleBehavioralChange}
                        required
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <label htmlFor="outcome" className="required-label">
                        Outcome
                      </label>
                      <textarea
                        id="outcome"
                        name="outcome"
                        placeholder="What was the outcome of these attempts?"
                        value={behavioralData.outcome}
                        onChange={handleBehavioralChange}
                        required
                      ></textarea>
                    </div>
                  </>
                )}
              </div>

              <div className="form-divider"></div>

              {/* Socialization */}
              <div className="form-section">
                <h3>Socialization</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="reactionToStrangers" className="required-label">
                      Reaction to Strangers
                    </label>
                    <select
                      id="reactionToStrangers"
                      name="reactionToStrangers"
                      value={behavioralData.reactionToStrangers}
                      onChange={handleBehavioralChange}
                      required
                    >
                      <option value="">Select reaction</option>
                      <option value="friendly">Friendly</option>
                      <option value="cautious">Cautious</option>
                      <option value="fearful">Fearful</option>
                      <option value="aggressive">Aggressive</option>
                      <option value="indifferent">Indifferent</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="reactionToChildren" className="required-label">
                      Reaction to Children
                    </label>
                    <select
                      id="reactionToChildren"
                      name="reactionToChildren"
                      value={behavioralData.reactionToChildren}
                      onChange={handleBehavioralChange}
                      required
                    >
                      <option value="">Select reaction</option>
                      <option value="friendly">Friendly</option>
                      <option value="cautious">Cautious</option>
                      <option value="fearful">Fearful</option>
                      <option value="aggressive">Aggressive</option>
                      <option value="indifferent">Indifferent</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="reactionToAnimals" className="required-label">
                      Reaction to Other Animals
                    </label>
                    <select
                      id="reactionToAnimals"
                      name="reactionToAnimals"
                      value={behavioralData.reactionToAnimals}
                      onChange={handleBehavioralChange}
                      required
                    >
                      <option value="">Select reaction</option>
                      <option value="friendly">Friendly</option>
                      <option value="cautious">Cautious</option>
                      <option value="fearful">Fearful</option>
                      <option value="aggressive">Aggressive</option>
                      <option value="indifferent">Indifferent</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="required-label">Has your pet ever bitten or attempted to bite?</label>
                  <div className="radio-group">
                    <div className="radio-item">
                      <input
                        type="radio"
                        id="bite-yes"
                        name="biteHistory"
                        value="yes"
                        checked={behavioralData.biteHistory === "yes"}
                        onChange={handleBehavioralChange}
                        required
                      />
                      <label htmlFor="bite-yes">Yes</label>
                    </div>
                    <div className="radio-item">
                      <input
                        type="radio"
                        id="bite-no"
                        name="biteHistory"
                        value="no"
                        checked={behavioralData.biteHistory === "no"}
                        onChange={handleBehavioralChange}
                        required
                      />
                      <label htmlFor="bite-no">No</label>
                    </div>
                  </div>
                </div>
                {behavioralData.biteHistory === "yes" && (
                  <div className="form-group">
                    <label htmlFor="biteDetails" className="required-label">
                      Bite Incident Details
                    </label>
                    <textarea
                      id="biteDetails"
                      name="biteDetails"
                      placeholder="Please describe the incident(s)"
                      value={behavioralData.biteDetails}
                      onChange={handleBehavioralChange}
                      required
                    ></textarea>
                  </div>
                )}
              </div>

              <div className="form-divider"></div>

              {/* Environment */}
              <div className="form-section">
                <h3>Environment</h3>
                <div className="form-group">
                  <label htmlFor="environment" className="required-label">
                    Where does the behavior mostly occur?
                  </label>
                  <textarea
                    id="environment"
                    name="environment"
                    placeholder="Home, park, walks, etc."
                    value={behavioralData.environment}
                    onChange={handleBehavioralChange}
                    required
                  ></textarea>
                </div>
                <div className="form-group">
                  <label className="required-label">Are there other pets in the household?</label>
                  <div className="radio-group">
                    <div className="radio-item">
                      <input
                        type="radio"
                        id="pets-yes"
                        name="otherPets"
                        value="yes"
                        checked={behavioralData.otherPets === "yes"}
                        onChange={handleBehavioralChange}
                        required
                      />
                      <label htmlFor="pets-yes">Yes</label>
                    </div>
                    <div className="radio-item">
                      <input
                        type="radio"
                        id="pets-no"
                        name="otherPets"
                        value="no"
                        checked={behavioralData.otherPets === "no"}
                        onChange={handleBehavioralChange}
                        required
                      />
                      <label htmlFor="pets-no">No</label>
                    </div>
                  </div>
                </div>
                {behavioralData.otherPets === "yes" && (
                  <div className="form-group">
                    <label htmlFor="otherPetsDetails" className="required-label">
                      Details about other pets
                    </label>
                    <textarea
                      id="otherPetsDetails"
                      name="otherPetsDetails"
                      placeholder="Species, ages, and how they interact"
                      value={behavioralData.otherPetsDetails}
                      onChange={handleBehavioralChange}
                      required
                    ></textarea>
                  </div>
                )}
              </div>
            </div>
            <div className="card-footer">
              <button type="submit" className="submit-button" disabled={loading || !behavioralFormValid}>
                {loading ? "Processing..." : "Submit Behavioral Assessment"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Obedience Training Form */}
      {activeTab === "obedience" && (
        <div className="form-card">
          <div className="card-header">
            <h2>Obedience Training Assessment</h2>
            <p>Help us understand your pet's current training level and goals.</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="card-content">
              {/* Basic Information */}
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="obedience-petType" className="required-label">
                    Pet Type
                  </label>
                  <select
                    id="obedience-petType"
                    name="petType"
                    value={obedienceData.petType}
                    onChange={handleObedienceChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select pet type</option>
                    {petTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="obedience-breed" className="required-label">
                    Breed
                  </label>
                  <input
                    id="obedience-breed"
                    name="breed"
                    type="text"
                    placeholder="Breed"
                    value={obedienceData.breed}
                    onChange={handleObedienceChange}
                    required
                  />
                </div>
              </div>

              <div className="form-divider"></div>

              {/* Current Training Level */}
              <div className="form-section">
                <h3>Current Training Level</h3>
                <div className="form-group">
                  <label htmlFor="currentTrainingLevel" className="required-label">
                    Current Training Level
                  </label>
                  <select
                    id="currentTrainingLevel"
                    name="currentTrainingLevel"
                    value={obedienceData.currentTrainingLevel}
                    onChange={handleObedienceChange}
                    required
                  >
                    <option value="">Select level</option>
                    <option value="none">No training</option>
                    <option value="basic">Basic training</option>
                    <option value="intermediate">Intermediate training</option>
                    <option value="advanced">Advanced training</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="required-label">Has your pet received any prior obedience training?</label>
                  <div className="radio-group">
                    <div className="radio-item">
                      <input
                        type="radio"
                        id="training-yes"
                        name="priorTraining"
                        value="yes"
                        checked={obedienceData.priorTraining === "yes"}
                        onChange={handleObedienceChange}
                        required
                      />
                      <label htmlFor="training-yes">Yes</label>
                    </div>
                    <div className="radio-item">
                      <input
                        type="radio"
                        id="training-no"
                        name="priorTraining"
                        value="no"
                        checked={obedienceData.priorTraining === "no"}
                        onChange={handleObedienceChange}
                        required
                      />
                      <label htmlFor="training-no">No</label>
                    </div>
                  </div>
                </div>
                {obedienceData.priorTraining === "yes" && (
                  <div className="form-group">
                    <label htmlFor="priorTrainingType" className="required-label">
                      Type of Prior Training
                    </label>
                    <select
                      id="priorTrainingType"
                      name="priorTrainingType"
                      value={obedienceData.priorTrainingType}
                      onChange={handleObedienceChange}
                      required
                    >
                      <option value="">Select type</option>
                      <option value="puppy">Puppy class</option>
                      <option value="group">Group lessons</option>
                      <option value="private">Private lessons</option>
                      <option value="self">Self-taught</option>
                      <option value="online">Online training</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                )}
                <div className="form-group">
                  <label htmlFor="commandsKnown" className="required-label">
                    Commands Already Known
                  </label>
                  <textarea
                    id="commandsKnown"
                    name="commandsKnown"
                    placeholder="Sit, stay, come, etc."
                    value={obedienceData.commandsKnown}
                    onChange={handleObedienceChange}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="form-divider"></div>

              {/* Skills to Learn */}
              <div className="form-section">
                <h3>
                  Skills to Learn/Improve <span className="required-indicator">*</span>
                </h3>
                <div className="checkbox-container">
                  {obedienceSkillsOptions.map((skill) => (
                    <div key={skill.id} className="checkbox-item">
                      <input
                        type="checkbox"
                        id={`obedience-${skill.id}`}
                        checked={obedienceData.skillsToLearn.includes(skill.id)}
                        onChange={() => handleObedienceCheckboxChange(skill.id)}
                      />
                      <label htmlFor={`obedience-${skill.id}`}>{skill.label}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-divider"></div>

              {/* Response to Commands */}
              <div className="form-section">
                <h3>Response to Commands</h3>
                <div className="form-group">
                  <label htmlFor="commandReliability" className="required-label">
                    How reliably does your pet respond to known commands?
                  </label>
                  <select
                    id="commandReliability"
                    name="commandReliability"
                    value={obedienceData.commandReliability}
                    onChange={handleObedienceChange}
                    required
                  >
                    <option value="">Select reliability</option>
                    <option value="always">Always</option>
                    <option value="usually">Usually</option>
                    <option value="sometimes">Sometimes</option>
                    <option value="rarely">Rarely</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="required-label">
                    Does your pet respond to commands in distracting environments?
                  </label>
                  <div className="radio-group">
                    <div className="radio-item">
                      <input
                        type="radio"
                        id="distraction-yes"
                        name="responseInDistractions"
                        value="yes"
                        checked={obedienceData.responseInDistractions === "yes"}
                        onChange={handleObedienceChange}
                        required
                      />
                      <label htmlFor="distraction-yes">Yes</label>
                    </div>
                    <div className="radio-item">
                      <input
                        type="radio"
                        id="distraction-no"
                        name="responseInDistractions"
                        value="no"
                        checked={obedienceData.responseInDistractions === "no"}
                        onChange={handleObedienceChange}
                        required
                      />
                      <label htmlFor="distraction-no">No</label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-divider"></div>

              {/* Training Preferences */}
              <div className="form-section">
                <h3>Training Preferences</h3>
                <div className="form-group">
                  <label htmlFor="trainingMethod" className="required-label">
                    Preferred Training Method
                  </label>
                  <select
                    id="trainingMethod"
                    name="trainingMethod"
                    value={obedienceData.trainingMethod}
                    onChange={handleObedienceChange}
                    required
                  >
                    <option value="">Select method</option>
                    <option value="positive">Positive reinforcement</option>
                    <option value="clicker">Clicker training</option>
                    <option value="balanced">Balanced training</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="sessionFormat" className="required-label">
                    Preferred Session Format
                  </label>
                  <select
                    id="sessionFormat"
                    name="sessionFormat"
                    value={obedienceData.sessionFormat}
                    onChange={handleObedienceChange}
                    required
                  >
                    <option value="">Select format</option>
                    <option value="group">Group classes</option>
                    <option value="private">Private lessons</option>
                    <option value="online">Online training</option>
                    <option value="board">Board and train</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="trainingGoals" className="required-label">
                    Training Goals
                  </label>
                  <textarea
                    id="trainingGoals"
                    name="trainingGoals"
                    placeholder="What do you hope to achieve with training?"
                    value={obedienceData.trainingGoals}
                    onChange={handleObedienceChange}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="form-divider"></div>

              {/* Challenges with Training */}
              <div className="form-section">
                <h3>Challenges with Training</h3>
                <div className="form-group">
                  <label htmlFor="trainingDifficulties" className="required-label">
                    Any specific difficulties during training?
                  </label>
                  <textarea
                    id="trainingDifficulties"
                    name="trainingDifficulties"
                    placeholder="Easily distracted, stubborn, fearful, etc."
                    value={obedienceData.trainingDifficulties}
                    onChange={handleObedienceChange}
                    required
                  ></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="struggleSituations" className="required-label">
                    Particular situations where your pet struggles to obey
                  </label>
                  <textarea
                    id="struggleSituations"
                    name="struggleSituations"
                    placeholder="Around other dogs, in public, at home, etc."
                    value={obedienceData.struggleSituations}
                    onChange={handleObedienceChange}
                    required
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <button type="submit" className="submit-button" disabled={loading || !obedienceFormValid}>
                {loading ? "Processing..." : "Submit Obedience Assessment"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="result-card">
          <div className="card-header">
            <h2>Training Assessment Results</h2>
            <p>Based on your input, here's our AI-generated training assessment</p>
          </div>
          <div className="card-content">
            <div className="result-section">
              <h3>Cause of Issue:</h3>
              <p dangerouslySetInnerHTML={{ __html: formatText(result.cause_of_issue) }}></p>
            </div>
            <div className="form-divider"></div>
            <div className="result-section">
              <h3>Training Plan:</h3>
              <p dangerouslySetInnerHTML={{ __html: formatText(result.training_plan) }}></p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PetTrainingForm
