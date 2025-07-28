import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { PersonaForm } from './components/PersonaForm';
import { JobDefinition } from './components/JobDefinition';
import { ProcessingInterface } from './components/ProcessingInterface';
import { ResultsViewer } from './components/ResultsViewer';
import { Header } from './components/Header';
import { FileText, User, Target, Brain } from 'lucide-react';

export interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
}

export interface Persona {
  role: string;
  expertise: string[];
  focusAreas: string[];
  experience: string;
}

export interface JobToBeDone {
  task: string;
  expectedOutput: string;
  priority: string;
  timeline: string;
}

export interface ProcessingResult {
  metadata: {
    inputDocuments: string[];
    persona: Persona;
    jobToBeDone: JobToBeDone;
    processingTimestamp: string;
    processingTime: number;
  };
  extractedSections: Array<{
    document: string;
    pageNumber: number;
    sectionTitle: string;
    importanceRank: number;
    content: string;
  }>;
  subSectionAnalysis: Array<{
    document: string;
    refinedText: string;
    pageNumber: number;
    relevanceScore: number;
    keyInsights: string[];
  }>;
}

type Step = 'upload' | 'persona' | 'job' | 'processing' | 'results';

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [persona, setPersona] = useState<Persona | null>(null);
  const [jobToBeDone, setJobToBeDone] = useState<JobToBeDone | null>(null);
  const [results, setResults] = useState<ProcessingResult | null>(null);

  const steps = [
    { id: 'upload', title: 'Upload Documents', icon: FileText, completed: documents.length > 0 },
    { id: 'persona', title: 'Define Persona', icon: User, completed: persona !== null },
    { id: 'job', title: 'Job To Be Done', icon: Target, completed: jobToBeDone !== null },
    { id: 'processing', title: 'AI Processing', icon: Brain, completed: results !== null },
  ];

  const handleDocumentsUploaded = (newDocuments: Document[]) => {
    setDocuments(newDocuments);
  };

  const handlePersonaSubmit = (personaData: Persona) => {
    setPersona(personaData);
    setCurrentStep('job');
  };

  const handleJobSubmit = (jobData: JobToBeDone) => {
    setJobToBeDone(jobData);
    setCurrentStep('processing');
  };

  const handleProcessingComplete = (processingResults: ProcessingResult) => {
    setResults(processingResults);
    setCurrentStep('results');
  };

  const resetFlow = () => {
    setCurrentStep('upload');
    setDocuments([]);
    setPersona(null);
    setJobToBeDone(null);
    setResults(null);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'upload':
        return (
          <FileUpload
            documents={documents}
            onDocumentsChange={handleDocumentsUploaded}
            onNext={() => setCurrentStep('persona')}
          />
        );
      case 'persona':
        return (
          <PersonaForm
            onSubmit={handlePersonaSubmit}
            onBack={() => setCurrentStep('upload')}
          />
        );
      case 'job':
        return (
          <JobDefinition
            onSubmit={handleJobSubmit}
            onBack={() => setCurrentStep('persona')}
          />
        );
      case 'processing':
        return (
          <ProcessingInterface
            documents={documents}
            persona={persona!}
            jobToBeDone={jobToBeDone!}
            onComplete={handleProcessingComplete}
          />
        );
      case 'results':
        return (
          <ResultsViewer
            results={results!}
            onReset={resetFlow}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header steps={steps} currentStep={currentStep} />
      <main className="container mx-auto px-4 py-8">
        {renderStep()}
      </main>
    </div>
  );
}

export default App;