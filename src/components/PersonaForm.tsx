import React, { useState } from 'react';
import { User, Plus, X, ArrowLeft } from 'lucide-react';
import { Persona } from '../App';

interface PersonaFormProps {
  onSubmit: (persona: Persona) => void;
  onBack: () => void;
}

export const PersonaForm: React.FC<PersonaFormProps> = ({ onSubmit, onBack }) => {
  const [role, setRole] = useState('');
  const [expertise, setExpertise] = useState<string[]>([]);
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [experience, setExperience] = useState('');
  const [newExpertise, setNewExpertise] = useState('');
  const [newFocusArea, setNewFocusArea] = useState('');

  const addExpertise = () => {
    if (newExpertise.trim() && !expertise.includes(newExpertise.trim())) {
      setExpertise([...expertise, newExpertise.trim()]);
      setNewExpertise('');
    }
  };

  const removeExpertise = (item: string) => {
    setExpertise(expertise.filter(e => e !== item));
  };

  const addFocusArea = () => {
    if (newFocusArea.trim() && !focusAreas.includes(newFocusArea.trim())) {
      setFocusAreas([...focusAreas, newFocusArea.trim()]);
      setNewFocusArea('');
    }
  };

  const removeFocusArea = (item: string) => {
    setFocusAreas(focusAreas.filter(f => f !== item));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role.trim() && expertise.length > 0 && focusAreas.length > 0 && experience.trim()) {
      onSubmit({
        role: role.trim(),
        expertise,
        focusAreas,
        experience: experience.trim(),
      });
    }
  };

  const samplePersonas = [
    {
      role: 'PhD Researcher in Computational Biology',
      expertise: ['Machine Learning', 'Bioinformatics', 'Graph Neural Networks', 'Drug Discovery'],
      focusAreas: ['Methodology Analysis', 'Dataset Evaluation', 'Performance Benchmarking'],
      experience: '5+ years in computational biology research'
    },
    {
      role: 'Investment Analyst',
      expertise: ['Financial Analysis', 'Market Research', 'Company Valuation', 'Risk Assessment'],
      focusAreas: ['Revenue Analysis', 'R&D Investment Tracking', 'Competitive Positioning'],
      experience: '3+ years in investment analysis'
    },
    {
      role: 'Undergraduate Chemistry Student',
      expertise: ['Organic Chemistry', 'Reaction Mechanisms', 'Laboratory Techniques'],
      focusAreas: ['Exam Preparation', 'Concept Understanding', 'Problem Solving'],
      experience: '2 years of chemistry studies'
    }
  ];

  const loadSamplePersona = (persona: typeof samplePersonas[0]) => {
    setRole(persona.role);
    setExpertise(persona.expertise);
    setFocusAreas(persona.focusAreas);
    setExperience(persona.experience);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Define Persona</h2>
            <p className="text-blue-200">
              Describe the user who will analyze these documents
            </p>
          </div>
          <button
            onClick={onBack}
            className="flex items-center px-4 py-2 text-white/70 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  Role/Position
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g., PhD Researcher in Computational Biology"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Expertise Areas
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newExpertise}
                    onChange={(e) => setNewExpertise(e.target.value)}
                    placeholder="Add expertise area"
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExpertise())}
                  />
                  <button
                    type="button"
                    onClick={addExpertise}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {expertise.map((item) => (
                    <span
                      key={item}
                      className="flex items-center px-3 py-1 bg-blue-600/30 text-blue-200 rounded-full text-sm"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => removeExpertise(item)}
                        className="ml-2 text-blue-300 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Focus Areas
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newFocusArea}
                    onChange={(e) => setNewFocusArea(e.target.value)}
                    placeholder="Add focus area"
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFocusArea())}
                  />
                  <button
                    type="button"
                    onClick={addFocusArea}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {focusAreas.map((item) => (
                    <span
                      key={item}
                      className="flex items-center px-3 py-1 bg-green-600/30 text-green-200 rounded-full text-sm"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => removeFocusArea(item)}
                        className="ml-2 text-green-300 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Experience Level
                </label>
                <textarea
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="Describe relevant experience and background"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 h-24"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!role.trim() || expertise.length === 0 || focusAreas.length === 0 || !experience.trim()}
                className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors duration-200"
              >
                Continue to Job Definition
              </button>
            </form>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Sample Personas</h3>
            <div className="space-y-4">
              {samplePersonas.map((persona, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/10 transition-colors duration-200"
                  onClick={() => loadSamplePersona(persona)}
                >
                  <div className="flex items-center mb-2">
                    <User className="w-5 h-5 text-blue-400 mr-2" />
                    <h4 className="font-semibold text-white">{persona.role}</h4>
                  </div>
                  <p className="text-white/70 text-sm mb-2">{persona.experience}</p>
                  <div className="flex flex-wrap gap-1">
                    {persona.expertise.slice(0, 2).map((exp) => (
                      <span
                        key={exp}
                        className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded text-xs"
                      >
                        {exp}
                      </span>
                    ))}
                    {persona.expertise.length > 2 && (
                      <span className="px-2 py-1 bg-gray-600/20 text-gray-300 rounded text-xs">
                        +{persona.expertise.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};