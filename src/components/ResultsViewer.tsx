import React, { useState } from 'react';
import { Download, RefreshCw, FileText, TrendingUp, Eye, Copy, Check } from 'lucide-react';
import { ProcessingResult } from '../App';

interface ResultsViewerProps {
  results: ProcessingResult;
  onReset: () => void;
}

export const ResultsViewer: React.FC<ResultsViewerProps> = ({ results, onReset }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'sections' | 'analysis' | 'json'>('overview');
  const [copied, setCopied] = useState(false);

  const downloadJSON = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `document-analysis-${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const copyJSON = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(results, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy JSON:', err);
    }
  };

  const getRoleColor = (rank: number) => {
    if (rank <= 3) return 'text-green-400 bg-green-400/20';
    if (rank <= 6) return 'text-yellow-400 bg-yellow-400/20';
    return 'text-red-400 bg-red-400/20';
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Analysis Results</h2>
              <p className="text-blue-200">
                Processed {results.metadata.inputDocuments.length} documents in {results.metadata.processingTime}s
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={downloadJSON}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                <Download className="w-5 h-5 mr-2" />
                Download JSON
              </button>
              <button
                onClick={onReset}
                className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                New Analysis
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mt-6 bg-white/10 rounded-lg p-1">
            {[
              { id: 'overview', label: 'Overview', icon: Eye },
              { id: 'sections', label: 'Extracted Sections', icon: FileText },
              { id: 'analysis', label: 'Sub-Analysis', icon: TrendingUp },
              { id: 'json', label: 'JSON Output', icon: Download },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    flex items-center px-4 py-2 rounded-md transition-all duration-200 font-medium
                    ${activeTab === tab.id 
                      ? 'bg-white text-blue-900 shadow-lg' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-2xl font-bold text-white">{results.extractedSections.length}</div>
                  <div className="text-white/60 text-sm">Extracted Sections</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-2xl font-bold text-white">{results.subSectionAnalysis.length}</div>
                  <div className="text-white/60 text-sm">Sub-Analyses</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-2xl font-bold text-white">
                    {results.subSectionAnalysis.reduce((sum, item) => sum + item.keyInsights.length, 0)}
                  </div>
                  <div className="text-white/60 text-sm">Key Insights</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-2xl font-bold text-white">
                    {Math.round(results.subSectionAnalysis.reduce((sum, item) => sum + item.relevanceScore, 0) / results.subSectionAnalysis.length)}%
                  </div>
                  <div className="text-white/60 text-sm">Avg Relevance</div>
                </div>
              </div>

              {/* Persona & Job Summary */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">Persona Profile</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-white/60">Role:</span>
                      <p className="text-white font-medium">{results.metadata.persona.role}</p>
                    </div>
                    <div>
                      <span className="text-white/60">Expertise:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {results.metadata.persona.expertise.map((exp, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-600/30 text-blue-200 rounded text-sm">
                            {exp}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-white/60">Focus Areas:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {results.metadata.persona.focusAreas.map((area, index) => (
                          <span key={index} className="px-2 py-1 bg-green-600/30 text-green-200 rounded text-sm">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">Job Requirements</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-white/60">Task:</span>
                      <p className="text-white">{results.metadata.jobToBeDone.task}</p>
                    </div>
                    <div>
                      <span className="text-white/60">Expected Output:</span>
                      <p className="text-white text-sm">{results.metadata.jobToBeDone.expectedOutput}</p>
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <span className="text-white/60">Priority:</span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs font-medium capitalize ${
                          results.metadata.jobToBeDone.priority === 'high' ? 'bg-red-600/20 text-red-300' :
                          results.metadata.jobToBeDone.priority === 'medium' ? 'bg-yellow-600/20 text-yellow-300' :
                          'bg-blue-600/20 text-blue-300'
                        }`}>
                          {results.metadata.jobToBeDone.priority}
                        </span>
                      </div>
                      <div>
                        <span className="text-white/60">Timeline:</span>
                        <span className="ml-2 text-white text-sm capitalize">
                          {results.metadata.jobToBeDone.timeline.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Sections Preview */}
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Top Extracted Sections</h3>
                <div className="space-y-3">
                  {results.extractedSections.slice(0, 3).map((section, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/10">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${getRoleColor(section.importanceRank)}`}>
                            #{section.importanceRank}
                          </span>
                          <span className="text-white font-medium">{section.sectionTitle}</span>
                        </div>
                        <p className="text-white/60 text-sm mt-1">
                          {section.document} • Page {section.pageNumber}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sections' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4">
                Extracted Sections ({results.extractedSections.length})
              </h3>
              {results.extractedSections.map((section, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${getRoleColor(section.importanceRank)}`}>
                        Rank #{section.importanceRank}
                      </span>
                      <h4 className="text-white font-semibold">{section.sectionTitle}</h4>
                    </div>
                    <div className="text-white/60 text-sm">
                      Page {section.pageNumber}
                    </div>
                  </div>
                  <div className="mb-3">
                    <span className="text-blue-300 text-sm font-medium">{section.document}</span>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">{section.content}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4">
                Sub-Section Analysis ({results.subSectionAnalysis.length})
              </h3>
              {results.subSectionAnalysis.map((analysis, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`text-lg font-bold ${getRelevanceColor(analysis.relevanceScore)}`}>
                        {analysis.relevanceScore}%
                      </span>
                      <span className="text-white/60">relevance</span>
                    </div>
                    <div className="text-white/60 text-sm">
                      Page {analysis.pageNumber}
                    </div>
                  </div>
                  <div className="mb-3">
                    <span className="text-blue-300 text-sm font-medium">{analysis.document}</span>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed mb-3">{analysis.refinedText}</p>
                  <div>
                    <span className="text-white/60 text-sm">Key Insights:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {analysis.keyInsights.map((insight, idx) => (
                        <span key={idx} className="px-2 py-1 bg-green-600/20 text-green-300 rounded text-xs">
                          {insight}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'json' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">JSON Output</h3>
                <button
                  onClick={copyJSON}
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? 'Copied!' : 'Copy JSON'}
                </button>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 border border-white/20 overflow-auto max-h-96">
                <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};