import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  completed: boolean;
}

interface HeaderProps {
  steps: Step[];
  currentStep: string;
}

export const Header: React.FC<HeaderProps> = ({ steps, currentStep }) => {
  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Document Intelligence System
          </h1>
          <p className="text-blue-200 text-lg">
            Connect What Matters — For the User Who Matters
          </p>
        </div>

        <div className="flex items-center justify-center space-x-4 md:space-x-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = step.completed;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                      ${isActive 
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                        : isCompleted 
                        ? 'bg-green-500 text-white' 
                        : 'bg-white/20 text-white/60'
                      }
                    `}
                  >
                    {isCompleted && !isActive ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <span
                    className={`
                      mt-2 text-sm font-medium transition-colors duration-300
                      ${isActive ? 'text-white' : isCompleted ? 'text-green-300' : 'text-white/60'}
                    `}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`
                      w-8 h-0.5 mx-4 transition-colors duration-300
                      ${isCompleted ? 'bg-green-400' : 'bg-white/20'}
                    `}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
};