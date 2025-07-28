import React, { useState } from 'react';
import { Target, ArrowLeft } from 'lucide-react';
import { JobToBeDone } from '../App';

interface JobDefinitionProps {
  onSubmit: (job: JobToBeDone) => void;
  onBack: () => void;
}

export const JobDefinition: React.FC<JobDefinitionProps> = ({ onSubmit, onBack }) => {
  const [task, setTask] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');
  const [priority, setPriority] = useState('');
  const [timeline, setTimeline] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim() && expectedOutput.trim() && priority && timeline) {
      onSubmit({
        task: task.trim(),
        expectedOutput: expectedOutput.trim(),
        priority,
        timeline,
      });
    }
  };

  const sampleJobs = [
    {
      task: 'Prepare a comprehensive literature review focusing on methodologies, datasets, and performance benchmarks',
      expectedOutput: 'Structured literature review with methodology comparison table, dataset analysis, and performance benchmarks summary',
      priority: 'high',
      timeline: 'within-week'
    },
    {
      task: 'Analyze revenue trends, R&D investments, and market positioning strategies',
      expectedOutput: 'Financial analysis report with trend charts, investment comparisons, and strategic positioning assessment',
      priority: 'high',
      timeline: 'within-day'
    },
    {
      task: 'Identify key concepts and mechanisms for exam preparation on reaction kinetics',
      expectedOutput: 'Study guide with key concepts, mechanism summaries, and practice problem references',
      priority: 'medium',
      timeline: 'within-week'
    }
  ];

  const loadSampleJob = (job: typeof sampleJobs[0]) => {
    setTask(job.task);
    setExpectedOutput(job.expectedOutput);
    setPriority(job.priority);
    setTimeline(job.timeline);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Job To Be Done</h2>
            <p className="text-blue-200">
              Define the specific task this persona needs to accomplish
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
                  Task Description *
                </label>
                <textarea
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  placeholder="Describe the specific task to be accomplished using the documents"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 h-24"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Expected Output *
                </label>
                <textarea
                  value={expectedOutput}
                  onChange={(e) => setExpectedOutput(e.target.value)}
                  placeholder="Describe what kind of output or deliverable is expected"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 h-24"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Priority Level *
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                  required
                >
                  <option value="">Select priority</option>
                  <option value="low">Low - Nice to have</option>
                  <option value="medium">Medium - Important</option>
                  <option value="high">High - Critical</option>
                  <option value="urgent">Urgent - Immediate need</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Timeline *
                </label>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                  required
                >
                  <option value="">Select timeline</option>
                  <option value="within-hour">Within 1 hour</option>
                  <option value="within-day">Within 1 day</option>
                  <option value="within-week">Within 1 week</option>
                  <option value="within-month">Within 1 month</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={!task.trim() || !expectedOutput.trim() || !priority || !timeline}
                className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors duration-200"
              >
                Start AI Processing
              </button>
            </form>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Sample Jobs</h3>
            <div className="space-y-4">
              {sampleJobs.map((job, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/10 transition-colors duration-200"
                  onClick={() => loadSampleJob(job)}
                >
                  <div className="flex items-center mb-2">
                    <Target className="w-5 h-5 text-green-400 mr-2" />
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        job.priority === 'high' ? 'bg-red-600/20 text-red-300' :
                        job.priority === 'medium' ? 'bg-yellow-600/20 text-yellow-300' :
                        'bg-blue-600/20 text-blue-300'
                      }`}>
                        {job.priority.toUpperCase()}
                      </span>
                      <span className="px-2 py-1 bg-gray-600/20 text-gray-300 rounded text-xs">
                        {job.timeline.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <p className="text-white text-sm mb-2 line-clamp-2">{job.task}</p>
                  <p className="text-white/60 text-xs line-clamp-2">{job.expectedOutput}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <h4 className="text-blue-200 font-semibold mb-2">💡 Tips for Better Results</h4>
              <ul className="text-blue-200 text-sm space-y-1">
                <li>• Be specific about what you need from the documents</li>
                <li>• Mention the format of expected output</li>
                <li>• Consider the persona's expertise when defining tasks</li>
                <li>• Set realistic timelines based on document complexity</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};