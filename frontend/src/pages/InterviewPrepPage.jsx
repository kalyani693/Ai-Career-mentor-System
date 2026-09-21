import React, { useState } from 'react';
import { getPracticeQuestions } from '../api/career';
import { HelpCircle, Sparkles, ChevronDown, ChevronUp, RefreshCw, CheckCircle, BookOpen } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Alert from '../components/Alert';
import Skeleton from '../components/Skeleton';

const InterviewPrepPage = () => {
  const [level, setLevel] = useState('Easy'); // 'Easy' | 'Medium' | 'Difficult'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [qaList, setQaList] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const parseQuestions = (raw) => {
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
        return Array.isArray(parsed) ? parsed : null;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const handleFetchQuestions = async (selectedLevel = level) => {
    setErrorMsg('');
    setLoading(true);
    setQaList(null);
    setExpandedIndex(0); // Open first question by default

    try {
      const res = await getPracticeQuestions(selectedLevel);
      const parsed = parseQuestions(res.response);
      if (parsed) {
        setQaList(parsed);
      } else if (res.response) {
        setQaList(res.response); // Fallback
      }
    } catch (err) {
      const detail = err.response?.data?.detail || err.message || 'Failed to fetch interview questions.';
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
            <HelpCircle className="w-4 h-4 text-brand-600" />
            <span>Personalized Q&A Engine</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Top 10 Frequently Asked Interview Questions
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Generate customized questions and high-impact sample answers tailored to your resume data.
          </p>
        </div>
      </div>

      {errorMsg && <Alert type="error" message={errorMsg} onClose={() => setErrorMsg('')} />}

      {/* User Input Difficulty Level Selector */}
      <Card title="Select Difficulty Level" icon={Sparkles}>
        <div className="space-y-6">
          <p className="text-xs text-slate-600">
            Choose your target interview difficulty level to generate 10 tailored technical & behavioral questions:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['Easy', 'Medium', 'Difficult'].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setLevel(lvl)}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  level === lvl
                    ? 'border-brand-700 bg-brand-50/80 shadow-xs ring-2 ring-brand-700/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 text-base">{lvl} Level</span>
                    {level === lvl && <CheckCircle className="w-4 h-4 text-brand-700" />}
                  </div>
                  <p className="text-xs text-slate-500">
                    {lvl === 'Easy' && 'Fundamental concepts & basic technical questions.'}
                    {lvl === 'Medium' && 'Practical application & moderate problem solving.'}
                    {lvl === 'Difficult' && 'Deep technical depth, system design & complex logic.'}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <Button
              variant="primary"
              size="lg"
              loading={loading}
              icon={Sparkles}
              onClick={() => handleFetchQuestions(level)}
            >
              Fetch Top 10 Questions ({level})
            </Button>
          </div>
        </div>
      </Card>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" count={5} />
        </div>
      )}

      {/* Questions Accordion Display */}
      {qaList && !loading && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-brand-700" />
              <span>Generated Questions ({level} Mode)</span>
            </h2>
            <Button
              variant="secondary"
              size="sm"
              icon={RefreshCw}
              onClick={() => handleFetchQuestions(level)}
            >
              Regenerate
            </Button>
          </div>

          {Array.isArray(qaList) ? (
            <div className="space-y-3">
              {qaList.map((item, idx) => {
                const questionText = item.Q || item.question || `Question ${idx + 1}`;
                const answerText = item.A || item.answer || 'No answer generated';
                const isExpanded = expandedIndex === idx;

                return (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-xs hover:border-brand-300 transition-all"
                  >
                    <button
                      onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none bg-slate-50/50 hover:bg-brand-50/30 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="w-7 h-7 rounded-lg bg-brand-800 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-slate-900 text-sm sm:text-base">
                          {questionText}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0 ml-2" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0 ml-2" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="px-6 py-4 bg-white border-t border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
                        <div className="font-semibold text-brand-800 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                          <span>Personalized Model Answer:</span>
                        </div>
                        <p className="whitespace-pre-line text-slate-800 bg-slate-50/80 p-4 rounded-xl border border-slate-200/60">
                          {answerText}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <Card title="Interview Questions Output">
              <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {String(qaList)}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default InterviewPrepPage;
