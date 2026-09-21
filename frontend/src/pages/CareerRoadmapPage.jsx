import React, { useState } from 'react';
import { generateRoadmap } from '../api/career';
import { Compass, Sparkles, Upload, Clock, CheckCircle2, BookOpen, RotateCcw, FileCheck } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Alert from '../components/Alert';
import Skeleton from '../components/Skeleton';

const CareerRoadmapPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [roadmapSteps, setRoadmapSteps] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setErrorMsg('');
    }
  };

  const parseRoadmap = (raw) => {
    if (!raw) return null;
    if (Array.isArray(raw)) return raw;

    if (typeof raw === 'string') {
      try {
        let clean = raw.trim();
        if (clean.startsWith('```json')) {
          clean = clean.replace(/^```json/, '').replace(/```$/, '').trim();
        } else if (clean.startsWith('```')) {
          clean = clean.replace(/^```/, '').replace(/```$/, '').trim();
        }
        const parsed = JSON.parse(clean);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        return null; // Fallback plain text representation if not json list
      }
    }
    return null;
  };

  const handleGenerate = async () => {
    setErrorMsg('');
    setLoading(true);
    setRoadmapSteps(null);

    try {
      const res = await generateRoadmap(selectedFile);
      const parsed = parseRoadmap(res.response);
      if (parsed) {
        setRoadmapSteps(parsed);
      } else if (res.response) {
        setRoadmapSteps(res.response); // String fallback
      }
    } catch (err) {
      const detail = err.response?.data?.detail || err.message || 'Failed to generate roadmap.';
      setErrorMsg(typeof detail === 'object' ? JSON.stringify(detail) : detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-brand-700 uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4 text-brand-600" />
            <span>Personalized Milestone Generator</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            AI Career Learning Roadmap
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Generate an end-to-end skill progression path based on your resume and target role.
          </p>
        </div>

        {roadmapSteps && (
          <Button
            variant="outline"
            size="sm"
            icon={RotateCcw}
            onClick={() => {
              setRoadmapSteps(null);
              setSelectedFile(null);
            }}
          >
            Generate New Path
          </Button>
        )}
      </div>

      {errorMsg && <Alert type="error" message={errorMsg} onClose={() => setErrorMsg('')} />}

      {/* Generator Input Section */}
      {!roadmapSteps && !loading && (
        <Card title="Career Roadmap Generator" icon={Sparkles}>
          <div className="space-y-6">
            <div className="bg-brand-50/60 border border-brand-100 rounded-xl p-4 text-xs text-brand-900">
              <p className="font-semibold mb-1">How it works:</p>
              <p>
                Our AI analyzes your registered background & career goal to outline sequential learning steps, required topics, prerequisites, and completion time estimates.
              </p>
            </div>

            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50/50">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="roadmap-pdf-file"
              />
              <label htmlFor="roadmap-pdf-file" className="cursor-pointer flex flex-col items-center">
                {selectedFile ? (
                  <div className="flex items-center space-x-2 text-brand-800 font-bold text-sm">
                    <FileCheck className="w-5 h-5 text-emerald-600" />
                    <span>{selectedFile.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2">
                    <Upload className="w-6 h-6 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-700">
                      Optional: Attach PDF Resume to customize roadmap further
                    </span>
                  </div>
                )}
              </label>
            </div>

            <div className="flex justify-end">
              <Button
                variant="primary"
                size="lg"
                loading={loading}
                icon={Compass}
                onClick={handleGenerate}
              >
                Generate Personal Roadmap
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Skeleton Loading State */}
      {loading && (
        <div className="space-y-6">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {/* Timeline Steps Display */}
      {roadmapSteps && !loading && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {Array.isArray(roadmapSteps) ? (
            <div className="relative border-l-2 border-brand-200 ml-4 pl-6 space-y-8">
              {roadmapSteps.map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Step Icon Badge */}
                  <div className="absolute -left-[35px] top-0 w-8 h-8 rounded-full bg-brand-800 text-white font-extrabold text-xs flex items-center justify-center shadow-md border-2 border-white">
                    {item.step || idx + 1}
                  </div>

                  <Card className="hover:border-brand-300 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <h3 className="text-lg font-bold text-slate-900">
                        {item.Topic || `Milestone Step ${idx + 1}`}
                      </h3>
                      {item.Estimated_completion_time && (
                        <Badge variant="brand" className="w-fit flex items-center space-x-1">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>{item.Estimated_completion_time}</span>
                        </Badge>
                      )}
                    </div>

                    {item.Why_this_topic_is_required && (
                      <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
                        {item.Why_this_topic_is_required}
                      </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs">
                      {item.Prerequisites && (
                        <div>
                          <span className="font-semibold text-slate-700 block mb-1">
                            Prerequisites:
                          </span>
                          <span className="text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md inline-block">
                            {item.Prerequisites}
                          </span>
                        </div>
                      )}

                      {item.Recommended_learning_areas && (
                        <div>
                          <span className="font-semibold text-slate-700 block mb-1">
                            Recommended Areas:
                          </span>
                          <span className="text-slate-600 bg-brand-50 text-brand-900 px-2.5 py-1 rounded-md inline-block">
                            {item.Recommended_learning_areas}
                          </span>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <Card title="Career Roadmap Report">
              <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {String(roadmapSteps)}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default CareerRoadmapPage;
