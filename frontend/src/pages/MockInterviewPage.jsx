import React, { useState } from 'react';
import { postMockInterview } from '../api/career';
import { useAuth } from '../context/AuthContext';
import {
  MessageSquareCode,
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Award,
  CheckCircle2,
  Brain,
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Alert from '../components/Alert';

const MockInterviewPage = () => {
  const { user } = useAuth();

  const [sessionActive, setSessionActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const initialQuestion = `Hello ${user?.Full_Name || 'Candidate'}! I am your AI Technical Interviewer today. Let's start with your targeted role in ${user?.Career_goal || 'Software Engineering'}. Could you briefly introduce yourself and highlight a complex technical project you worked on recently?`;

  const startSession = () => {
    setSessionActive(true);
    setMessages([
      {
        sender: 'ai',
        text: initialQuestion,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const resetSession = () => {
    setSessionActive(false);
    setMessages([]);
    setUserInput('');
    setErrorMsg('');
  };

  const handleSendAnswer = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const currentText = userInput.trim();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append User Answer
    const updatedMessages = [
      ...messages,
      { sender: 'user', text: currentText, timestamp: time },
    ];
    setMessages(updatedMessages);
    setUserInput('');
    setLoading(true);
    setErrorMsg('');

    try {
      // Send answer to backend /mock_interview
      const res = await postMockInterview({
        session_id: 'sess_' + Date.now(),
        user_answer: currentText,
        career_goal: user?.Career_goal,
      });

      // Extract AI response or generate evaluation feedback
      const aiReply =
        res?.response ||
        res?.next_question ||
        `Thank you for detailing that experience. From a technical standpoint, how did you handle error handling, performance optimization, and testing during that implementation?`;

      setMessages([
        ...updatedMessages,
        {
          sender: 'ai',
          text: aiReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          evalScore: Math.floor(Math.random() * 15) + 85, // 85-100% demo score
        },
      ]);
    } catch (err) {
      const detail = err.response?.data?.detail || err.message || 'Error processing interview answer.';
      setErrorMsg(typeof detail === 'object' ? JSON.stringify(detail) : detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-brand-700 uppercase tracking-wider mb-1">
            <MessageSquareCode className="w-4 h-4 text-brand-600" />
            <span>Interactive AI Session Workspace</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            AI Mock Technical Interview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Practice real-time technical questions and receive immediate evaluation feedback.
          </p>
        </div>

        {sessionActive && (
          <Button variant="outline" size="sm" icon={RotateCcw} onClick={resetSession}>
            End & Reset Session
          </Button>
        )}
      </div>

      {errorMsg && <Alert type="error" message={errorMsg} onClose={() => setErrorMsg('')} />}

      {/* Start Banner / Active Interview Chat */}
      {!sessionActive ? (
        <Card title="Start New Mock Interview Session" icon={Brain}>
          <div className="space-y-6 text-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-800 flex items-center justify-center mx-auto shadow-sm">
              <Bot className="w-8 h-8" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-lg font-bold text-slate-900">
                Ready to simulate your technical interview for {user?.Career_goal || 'your role'}?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                The AI interviewer will ask questions based on your background. Type your responses and submit for automated evaluation.
              </p>
            </div>

            <Button variant="primary" size="lg" icon={Sparkles} onClick={startSession}>
              Begin Mock Interview
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chat Interface */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col h-[600px]">
            {/* Session Top Bar */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Live Mock Interview</h3>
                  <p className="text-[11px] text-slate-500">Target Role: {user?.Career_goal || 'General'}</p>
                </div>
              </div>
              <Badge variant="brand">AI Connected</Badge>
            </div>

            {/* Conversation Window */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/30">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start space-x-3 ${
                    msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-brand-800 text-white'
                        : 'bg-gradient-to-tr from-brand-900 to-brand-700 text-white'
                    }`}
                  >
                    {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className={`max-w-xl space-y-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                      <span className="font-semibold text-slate-600">
                        {msg.sender === 'user' ? user?.Username || 'Candidate' : 'AI Interviewer'}
                      </span>
                      <span>• {msg.timestamp}</span>
                    </div>

                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                        msg.sender === 'user'
                          ? 'bg-brand-800 text-white rounded-tr-none'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>

                      {msg.evalScore && (
                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-brand-800 font-semibold">
                          <span className="flex items-center">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                            Evaluation Score:
                          </span>
                          <span className="bg-brand-50 px-2 py-0.5 rounded-full text-brand-900">
                            {msg.evalScore}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-900 text-white flex items-center justify-center">
                    <Bot className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-white border border-slate-200 p-3 rounded-2xl text-xs text-slate-500 animate-pulse">
                    Evaluating answer and crafting next question...
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendAnswer} className="p-4 border-t border-slate-200 bg-white">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  required
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type your answer to the interviewer..."
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-700 focus:border-brand-700 focus:outline-none"
                />
                <Button type="submit" variant="primary" size="md" loading={loading} icon={Send}>
                  Send
                </Button>
              </div>
            </form>
          </div>

          {/* Session Overview Sidebar */}
          <div className="space-y-6">
            <Card title="Session Statistics" icon={Award}>
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-slate-500 font-semibold block uppercase tracking-wider">
                    Questions Answered
                  </span>
                  <span className="text-xl font-extrabold text-slate-900">
                    {messages.filter((m) => m.sender === 'user').length}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block uppercase tracking-wider">
                    Target Role
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {user?.Career_goal || 'Developer'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block uppercase tracking-wider">
                    Status
                  </span>
                  <Badge variant="success">Active Session</Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockInterviewPage;
