import React, { useEffect, useState } from 'react';
import { Brain, FileText, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { Document, Persona, JobToBeDone, ProcessingResult } from '../App';

interface ProcessingInterfaceProps {
  documents: Document[];
  persona: Persona;
  jobToBeDone: JobToBeDone;
  onComplete: (results: ProcessingResult) => void;
}

interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  duration: number;
  completed: boolean;
  error?: boolean;
}

export const ProcessingInterface: React.FC<ProcessingInterfaceProps> = ({
  documents,
  persona,
  jobToBeDone,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [processingTime, setProcessingTime] = useState(0);
  const [steps, setSteps] = useState<ProcessingStep[]>([
    {
      id: 'parse',
      title: 'Document Parsing',
      description: 'Extracting text and structure from PDF documents',
      duration: 15,
      completed: false,
    },
    {
      id: 'analyze',
      title: 'Content Analysis',
      description: 'Analyzing document content and identifying key sections',
      duration: 20,
      completed: false,
    },
    {
      id: 'match',
      title: 'Persona Matching',
      description: 'Matching content relevance to persona expertise',
      duration: 15,
      completed: false,
    },
    {
      id: 'rank',
      title: 'Importance Ranking',
      description: 'Ranking sections by relevance to job-to-be-done',
      duration: 10,
      completed: false,
    },
    {
      id: 'extract',
      title: 'Content Extraction',
      description: 'Extracting and refining most relevant sections',
      duration: 10,
      completed: false,
    },
  ]);

  useEffect(() => {
    const startTime = Date.now();
    let stepTimer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;

    const processSteps = () => {
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        const stepDuration = (step.duration / 100) * 1000; // Convert percentage to milliseconds

        // Update progress within current step
        let stepProgress = 0;
        progressTimer = setInterval(() => {
          stepProgress += 2;
          const totalProgress = (currentStep * 100 + stepProgress) / steps.length;
          setProgress(totalProgress);
          setProcessingTime(Date.now() - startTime);

          if (stepProgress >= 100) {
            clearInterval(progressTimer);
            // Mark current step as completed
            setSteps(prevSteps => 
              prevSteps.map((s, index) => 
                index === currentStep ? { ...s, completed: true } : s
              )
            );
            setCurrentStep(prev => prev + 1);
          }
        }, stepDuration / 50);

      } else {
        // All steps completed, generate results
        generateResults();
      }
    };

    stepTimer = setTimeout(processSteps, 500);

    return () => {
      clearTimeout(stepTimer);
      clearInterval(progressTimer);
    };
  }, [currentStep, steps.length]);

  const generateResults = () => {
    // Generate mock results based on the input
    const mockResults: ProcessingResult = {
      metadata: {
        inputDocuments: documents.map(doc => doc.name),
        persona,
        jobToBeDone,
        processingTimestamp: new Date().toISOString(),
        processingTime: Math.round(processingTime / 1000),
      },
      extractedSections: generateMockSections(),
      subSectionAnalysis: generateMockSubSections(),
    };

    setTimeout(() => {
      onComplete(mockResults);
    }, 1000);
  };

  const generateMockSections = () => {
    const sections = [];
    const sectionTitles = [
      'Introduction and Methodology',
      'Literature Review',
      'Data Analysis and Results',
      'Discussion and Implications',
      'Conclusion and Future Work',
      'Technical Implementation',
      'Performance Evaluation',
      'Comparative Analysis'
    ];

    for (let i = 0; i < Math.min(8, documents.length * 2); i++) {
      sections.push({
        document: documents[i % documents.length].name,
        pageNumber: Math.floor(Math.random() * 20) + 1,
        sectionTitle: sectionTitles[i % sectionTitles.length],
        importanceRank: i + 1,
        content: `This section contains highly relevant information for ${persona.role} regarding ${jobToBeDone.task.substring(0, 50)}...`,
      });
    }

    return sections.sort((a, b) => a.importanceRank - b.importanceRank);
  };

  const generateMockSubSections = () => {
    const subSections = [];
    const insights = [
      'Key methodology identified',
      'Performance benchmark established',
      'Dataset characteristics analyzed',
      'Comparative results available',
      'Implementation details provided',
      'Future research directions outlined'
    ];

    for (let i = 0; i < Math.min(6, documents.length * 1.5); i++) {
      subSections.push({
        document: documents[i % documents.length].name,
        refinedText: `Refined analysis of content specifically relevant to ${persona.focusAreas[i % persona.focusAreas.length]} focus area. This extracted text has been processed to highlight the most pertinent information for the specified job requirements.`,
        pageNumber: Math.floor(Math.random() * 20) + 1,
        relevanceScore: Math.round((95 - i * 5) * 100) / 100,
        keyInsights: insights.slice(0, Math.floor(Math.random() * 3) + 2),
      });
    }

    return subSections.sort((a, b) => b.relevanceScore - a.relevanceScore);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-16 h-16 text-blue-400 animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">AI Processing</h2>
          <p className="text-blue-200">
            Analyzing documents with persona-driven intelligence
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-medium">Overall Progress</span>
            <span className="text-blue-300">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-center text-white/70 text-sm">
            Processing time: {Math.round(processingTime / 1000)}s
          </div>
        </div>

        {/* Processing Steps */}
        <div className="space-y-4 mb-8">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`
                flex items-center p-4 rounded-lg border transition-all duration-300
                ${index === currentStep 
                  ? 'bg-blue-500/20 border-blue-400 shadow-lg shadow-blue-500/20' 
                  : step.completed 
                  ? 'bg-green-500/20 border-green-400' 
                  : 'bg-white/5 border-white/20'
                }
              `}
            >
              <div className="mr-4">
                {step.completed ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : index === currentStep ? (
                  <Zap className="w-6 h-6 text-blue-400 animate-pulse" />
                ) : (
                  <FileText className="w-6 h-6 text-white/40" />
                )}
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold ${
                  step.completed ? 'text-green-300' : 
                  index === currentStep ? 'text-blue-300' : 'text-white/60'
                }`}>
                  {step.title}
                </h3>
                <p className={`text-sm ${
                  step.completed ? 'text-green-200' : 
                  index === currentStep ? 'text-blue-200' : 'text-white/50'
                }`}>
                  {step.description}
                </p>
              </div>
              {index === currentStep && (
                <div className="ml-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Processing Summary */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center mb-2">
              <FileText className="w-5 h-5 text-blue-400 mr-2" />
              <span className="text-white font-medium">Documents</span>
            </div>
            <p className="text-2xl font-bold text-white">{documents.length}</p>
            <p className="text-white/60 text-sm">PDF files analyzed</p>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center mb-2">
              <Brain className="w-5 h-5 text-green-400 mr-2" />
              <span className="text-white font-medium">Persona</span>
            </div>
            <p className="text-lg font-bold text-white line-clamp-1">{persona.role}</p>
            <p className="text-white/60 text-sm">{persona.expertise.length} expertise areas</p>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center mb-2">
              <AlertCircle className="w-5 h-5 text-orange-400 mr-2" />
              <span className="text-white font-medium">Priority</span>
            </div>
            <p className="text-lg font-bold text-white capitalize">{jobToBeDone.priority}</p>
            <p className="text-white/60 text-sm capitalize">{jobToBeDone.timeline.replace('-', ' ')}</p>
          </div>
        </div>

        {currentStep >= steps.length && (
          <div className="text-center">
            <div className="animate-pulse text-green-400 mb-2">
              <CheckCircle className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-white font-semibold">Processing completed! Generating results...</p>
          </div>
        )}
      </div>
    </div>
  );
};