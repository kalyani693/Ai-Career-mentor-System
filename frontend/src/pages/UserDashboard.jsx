import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Compass,
  HelpCircle,
  MessageSquareCode,
  User,
  GraduationCap,
  Target,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Split,
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';


function toTitlecase(str){
  return str.
  toLowerCase().
  split(' ').
  map(word=> word.charAt(0).
  toUpperCase()+ word.slice(1)).join(' ');

};

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-400 via-brand-600 to-brand-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-repeat pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-brand-100 text-xs font-semibold mb-4 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-300" />
            <span>AI Career Workspace Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {toTitlecase(user?.Full_Name || user?.Username || 'Candidate')}! 
          </h1>
          <p className="mt-2 text-slate-200 text-sm sm:text-base leading-relaxed">
            Your career target is set to <strong className="text-white font-semibold underline decoration-brand-400">{toTitlecase(user?.Career_goal || 'Not specified')}</strong>. Use our AI tools to analyze your resume, generate custom roadmaps, and practice mock interviews.
          </p>
        </div>
      </div>

      {/* User Information Summary Cards (Real Data from Backend) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-l-4 border-l-brand-800">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-brand-50 text-brand-800 rounded-xl">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Career Goal</p>
              <p className="text-base font-bold text-slate-900 truncate max-w-[160px]">
                {toTitlecase(user?.Career_goal || 'N/A')}
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-brand-700">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-brand-50 text-brand-800 rounded-xl">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Highest Class</p>
              <p className="text-base font-bold text-slate-900 truncate max-w-[160px]">
                {toTitlecase(user?.Highest_Class || 'N/A')}
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-brand-600">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-brand-50 text-brand-800 rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Academic CGPA</p>
              <p className="text-base font-bold text-slate-900">
                {user?.CGPA ? `${user.CGPA} / 10.0` : 'N/A'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-emerald-600">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">University</p>
              <p className="text-base font-bold text-slate-900 truncate max-w-[160px]">
                {toTitlecase(user?.University || 'N/A')}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Feature Navigation Grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Quick AI Feature Launchpad</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Resume Analysis */}
          <Link to="/resume-analysis" className="group">
            <Card interactive className="h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-800 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-brand-800 transition-colors">
                  AI Resume Analysis
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Upload PDF resumes, inspect ATS compatibility scores, strengths, weaknesses, and missing skill badges.
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-semibold text-brand-700 group-hover:translate-x-1 transition-transform">
                <span>Run Resume Analysis</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Card>
          </Link>

          {/* Card 2: Career Roadmap */}
          <Link to="/roadmap" className="group">
            <Card interactive className="h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-800 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-brand-800 transition-colors">
                  Career Roadmap Generation
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Generate milestone-driven learning steps based on your current resume and target career path.
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-semibold text-brand-700 group-hover:translate-x-1 transition-transform">
                <span>Generate Roadmap</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Card>
          </Link>

          {/* Card 3: Interview Preparation */}
          <Link to="/interview-prep" className="group">
            <Card interactive className="h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-800 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-brand-800 transition-colors">
                  Interview Preparation
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Access top 10 frequently asked questions with personalized answers based on your background.
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-semibold text-brand-700 group-hover:translate-x-1 transition-transform">
                <span>Practice Top Q&As</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Card>
          </Link>

          {/* Card 4: AI Mock Interview */}
          <Link to="/mock-interview" className="group">
            <Card interactive className="h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-800 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MessageSquareCode className="w-6 h-6" />
                </div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-brand-800 transition-colors">
                    AI Mock Interview
                  </h3>
                  <Badge variant="brand">Interactive</Badge>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Simulate live interview conversations with interactive questions and real-time evaluation feedback.
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-semibold text-brand-700 group-hover:translate-x-1 transition-transform">
                <span>Start Mock Session</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Card>
          </Link>

          {/* Card 5: Profile & Settings */}
          <Link to="/profile" className="group">
            <Card interactive className="h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-800 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <User className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-brand-800 transition-colors">
                  Profile & Settings
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Manage academic background, update career targets, upload new resume PDFs, or manage account settings.
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-semibold text-brand-700 group-hover:translate-x-1 transition-transform">
                <span>Edit Profile</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
