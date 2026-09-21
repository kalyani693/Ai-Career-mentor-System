import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  FileSearch,
  MapPin,
  HelpCircle,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Zap,
} from 'lucide-react';
import Button from '../components/Button';

import CSS from './LandingPage.module.css'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header Navigation */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

          <div className="flex items-center space-x-3">
            
            <span className="font-extrabold text-slate-900 text-xl tracking-tight">
              AI Career <span className="text-brand-700">Mentor</span>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Link to="/login">
              <Button variant="ghost" size="md">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="secondary" size="md" icon={Sparkles}>
                Get Started Free
              </Button>
            </Link>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 bg-gradient-to-b from-white via-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-semibold mb-8 shadow-xs">
            <Sparkles className="w-4 h-4 text-brand-600 animate-pulse" />
            <span>AI-Powered Career Intelligence Platform</span>
          </div>

          <h1 className={`text-5xl sm:text-6xl lg:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight max-w-4xl mx-auto ${CSS.hero_heading}`}>
            Supercharge Your Career with <span className="text-brand-900">Real-Time AI Mentorship</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Upload your resume, generate personalized career roadmaps, practice tailored interview questions, and simulate real AI mock interviews—all connected to an intelligent backend engine.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" icon={ArrowRight} className="w-full">
                Create Free Account
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full">
                Sign In to Dashboard
              </Button>
            </Link>
          </div>

          {/* Key Value Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-slate-500">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-brand-700" />
              <span>Instant Resume Scoring</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-brand-700" />
              <span>Tailored Skill Gap Roadmaps</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-brand-700" />
              <span>Top 10 Personalised Interview Prep</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Everything You Need to Land Your Dream Role
            </h2>
            <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
              Engineered with FastAPI intelligence to deliver personalized, actionable feedback at every step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-50/70 p-8 rounded-2xl border border-slate-200/80 hover:shadow-lg transition-all hover:border-brand-300 group">
              <div className="w-12 h-12 rounded-xl bg-brand-800 text-white flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <FileSearch className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Resume Analyzer</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Extract qualifications, calculate ATS scores, identify missing skills, and receive actionable recommendations.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50/70 p-8 rounded-2xl border border-slate-200/80 hover:shadow-lg transition-all hover:border-brand-300 group">
              <div className="w-12 h-12 rounded-xl bg-brand-800 text-white flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Career Roadmap</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Get a step-by-step personalized learning milestone timeline targeting your exact dream job.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50/70 p-8 rounded-2xl border border-slate-200/80 hover:shadow-lg transition-all hover:border-brand-300 group">
              <div className="w-12 h-12 rounded-xl bg-brand-800 text-white flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Interview Prep</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Practice top 10 frequently asked questions filtered by difficulty (Easy, Medium, Difficult) with custom answers.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-50/70 p-8 rounded-2xl border border-slate-200/80 hover:shadow-lg transition-all hover:border-brand-300 group">
              <div className="w-12 h-12 rounded-xl bg-brand-800 text-white flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">AI Mock Interview</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Simulate realistic interview conversations with interactive questions and automated feedback evaluation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Portal Link Banner */}
      <section className="py-12 bg-slate-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <ShieldCheck className="w-8 h-8 text-brand-400 flex-shrink-0" />
            <div>
              <h4 className="text-lg font-bold">System Administrator Access</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage registered user databases, view platform statistics, and conduct user email lookups.
              </p>
            </div>
          </div>
          <Link to="/admin/login">
            <Button variant="secondary" size="md">
              Admin Login Portal
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} AI Career Mentor System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
