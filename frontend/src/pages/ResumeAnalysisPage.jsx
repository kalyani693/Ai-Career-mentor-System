import React, { useState } from 'react';
import { analyzeResume } from '../api/career';
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  Lightbulb,
  FileCheck,
  RotateCcw,
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Alert from '../components/Alert';
import Skeleton from '../components/Skeleton';

const ResumeAnalysisPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [analysisData, setAnalysisData] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setErrorMsg('Only PDF files are supported for resume analysis.');
        return;
      }
      setSelectedFile(file);
      setErrorMsg('');
    }
  };

  const parseBackendResponse = (raw) => {
    if (!raw) return null;
    if (typeof raw === 'object') return raw;

    if (typeof raw === 'string') {
      try {
        let clean = raw.trim();
        if (clean.startsWith('```json')) {
          clean = clean.replace(/^```json/, '').replace(/```$/, '').trim();
        } else if (clean.startsWith('```')) {
          clean = clean.replace(/^```/, '').replace(/```$/, '').trim();
        }
        return JSON.parse(clean);
      } catch (e) {
        // Return raw text wrapped in summary if not strict JSON
        return { Summary: raw };
      }
    }
    return null;
  };

  const handleAnalyze = async () => {
    setErrorMsg('');
    setLoading(true);
    setAnalysisData(null);

    try {
      const res = await analyzeResume(selectedFile);
      const parsed = parseBackendResponse(res.response);
      setAnalysisData(parsed);
    } catch (err) {
      const detail = err.response?.data?.detail || err.message || 'Failed to analyze resume.';
      setErrorMsg(typeof detail === 'object' ? JSON.stringify(detail) : detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-brand-700 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>AI Resume Intelligence</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            AI Resume Analyzer & ATS Scorer
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Upload an updated PDF resume or evaluate your profile resume against your target career goal.
          </p>
        </div>

        {analysisData && (
          <Button
            variant="outline"
            size="sm"
            icon={RotateCcw}
            onClick={() => {
              setAnalysisData(null);
              setSelectedFile(null);
            }}
          >
            New Analysis
          </Button>
        )}
      </div>

      {errorMsg && <Alert type="error" message={errorMsg} onClose={() => setErrorMsg('')} />}

      {/* File Upload Dropzone Card */}
      {!analysisData && !loading && (
        <Card title="Upload PDF Resume (Optional)" icon={Upload}>
          <div className="space-y-6">
            <div className="border-2 border-dashed border-slate-300 hover:border-brand-700 rounded-2xl p-8 text-center bg-slate-50/50 transition-colors">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="resume-file-input"
              />
              <label htmlFor="resume-file-input" className="cursor-pointer flex flex-col items-center">
                {selectedFile ? (
                  <div className="flex flex-col items-center space-y-2">
                    <FileCheck className="w-12 h-12 text-emerald-600 animate-bounce" />
                    <span className="font-bold text-slate-900 text-sm">{selectedFile.name}</span>
                    <span className="text-xs text-slate-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB PDF
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-800 flex items-center justify-center">
                      <FileText className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Click to select your PDF resume
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        If no file is selected, the AI will use your previously registered resume data.
                      </p>
                    </div>
                  </div>
                )}
              </label>
            </div>

            <div className="flex justify-end">
              <Button
                variant="primary"
                size="lg"
                loading={loading}
                icon={Sparkles}
                onClick={handleAnalyze}
              >
                Run AI Resume Analysis
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Skeleton Loading State */}
      {loading && (
        <div className="space-y-6">
          <Card>
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-20 w-full" />
            </div>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card><Skeleton className="h-40 w-full" /></Card>
            <Card><Skeleton className="h-40 w-full" /></Card>
          </div>
        </div>
      )}

      {/* Analysis Results Display */}
      {analysisData && !loading && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* ATS Score Banner (If present) */}
          {analysisData.ATS_Score !== undefined && (
            <div className="bg-gradient-to-r from-brand-900 to-brand-800 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs font-semibold text-brand-300 uppercase tracking-wider">
                  ATS Match Score
                </span>
                <h3 className="text-3xl font-extrabold mt-1">
                  {analysisData.ATS_Score}% Compatibility
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Based on AI role comparison against your declared career target.
                </p>
              </div>
              <div className="w-24 h-24 rounded-full border-4 border-brand-400/30 flex items-center justify-center bg-brand-800/80 font-black text-2xl text-brand-200 shadow-inner">
                {analysisData.ATS_Score}%
              </div>
            </div>
          )}

          {/* Executive Summary */}
          {analysisData.Summary && (
            <Card title="Candidate Summary & Qualifications" icon={FileText}>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                {analysisData.Summary}
              </p>
            </Card>
          )}

          {/* Strengths & Weaknesses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            {analysisData.Strengths && (
              <Card title="Key Strengths" icon={CheckCircle}>
                {Array.isArray(analysisData.Strengths) ? (
                  <ul className="space-y-2.5">
                    {analysisData.Strengths.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-700">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-700">{String(analysisData.Strengths)}</p>
                )}
              </Card>
            )}

            {/* Weaknesses */}
            {analysisData.Weaknesses && (
              <Card title="Areas for Improvement" icon={AlertTriangle}>
                {Array.isArray(analysisData.Weaknesses) ? (
                  <ul className="space-y-2.5">
                    {analysisData.Weaknesses.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-700">
                        <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-700">{String(analysisData.Weaknesses)}</p>
                )}
              </Card>
            )}
          </div>

          {/* Missing Skills */}
          {analysisData.Missing_skills && (
            <Card title="Identified Skill Gaps" icon={HelpCircle}>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(analysisData.Missing_skills) ? (
                  analysisData.Missing_skills.map((skill, idx) => (
                    <Badge key={idx} variant="warning" className="px-3 py-1 text-xs">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-slate-700">{String(analysisData.Missing_skills)}</p>
                )}
              </div>
            </Card>
          )}

          {/* Recommendations */}
          {analysisData.Recommendations && (
            <Card title="Actionable AI Recommendations" icon={Lightbulb}>
              {Array.isArray(analysisData.Recommendations) ? (
                <ul className="space-y-3">
                  {analysisData.Recommendations.map((rec, idx) => (
                    <li key={idx} className="p-3 bg-brand-50/60 border border-brand-100 rounded-xl text-xs sm:text-sm text-brand-900">
                      {rec}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-700 whitespace-pre-line">{String(analysisData.Recommendations)}</p>
              )}
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeAnalysisPage;
