import { useState } from 'react'
import { Zap, AlertTriangle, ExternalLink } from 'lucide-react'
import ResumeUploader from './ResumeUploader'
import ResultsPanel from './ResultsPanel'
import { analyzeResume } from '../api/claude'

const ERROR_MESSAGES = {
  MISSING_API_KEY: {
    title: 'API key not set',
    body: 'Add your OpenAI API key to the .env file as VITE_OPENAI_API_KEY, then restart the dev server.',
  },
  INVALID_API_KEY: {
    title: 'Invalid API key',
    body: 'Your OpenAI API key was rejected. Double-check it in .env and restart.',
  },
  RATE_LIMITED: {
    title: 'Rate limited',
    body: 'Too many requests. Wait a minute and try again.',
  },
  API_OVERLOADED: {
    title: 'Claude API overloaded',
    body: 'Anthropic\'s servers are busy. Try again in a moment.',
  },
  PARSE_ERROR: {
    title: 'Parsing error',
    body: 'Claude returned an unexpected format. Try again.',
  },
}

function ApiKeyBanner() {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  if (apiKey && apiKey !== 'your_key_here') return null

  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-[#f7971e10] border border-[#f7971e30] mb-5">
      <AlertTriangle size={16} className="text-[#f7971e] mt-0.5 shrink-0" />
      <div className="text-sm font-dm">
        <p className="text-[#f7971e] font-semibold">API key required</p>
        <p className="text-gray-400 mt-0.5">
          Open <code className="text-gray-200 bg-[#1e1e32] px-1.5 py-0.5 rounded text-xs">.env</code> and set{' '}
          <code className="text-gray-200 bg-[#1e1e32] px-1.5 py-0.5 rounded text-xs">VITE_OPENAI_API_KEY=sk-...</code>,
          then restart the dev server.
        </p>
      </div>
    </div>
  )
}

export default function Analyzer({ onSaveApplication }) {
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')

  const canAnalyze = resumeText.trim().length > 50 && jobDescription.trim().length > 50

  const handleAnalyze = async () => {
    if (!canAnalyze || loading) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await analyzeResume(resumeText, jobDescription)
      setResult(data)

      // Auto-save to tracker
      const app = {
        id: Date.now().toString(),
        company: company || 'Unknown Company',
        role: role || 'Unknown Role',
        date: new Date().toISOString().split('T')[0],
        score: data.overallScore,
        status: 'Applied',
        notes: data.verdict || '',
      }
      onSaveApplication(app)
    } catch (e) {
      const known = ERROR_MESSAGES[e.message]
      setError(known || { title: 'Error', body: e.message || 'Something went wrong.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      {/* LEFT: Inputs */}
      <div className="space-y-5">
        <ApiKeyBanner />

        {/* Company / Role hint */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 font-syne uppercase tracking-wider mb-1.5 block">Company (optional)</label>
            <input
              value={company}
              onChange={e => setCompany(e.target.value)}
              placeholder="e.g. Google"
              className="w-full px-3 py-2 rounded-xl bg-[#0a0a0f] border border-[#1e1e32] text-sm text-gray-200 font-dm placeholder-gray-600 focus:outline-none focus:border-[#6c63ff60] transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-syne uppercase tracking-wider mb-1.5 block">Role (optional)</label>
            <input
              value={role}
              onChange={e => setRole(e.target.value)}
              placeholder="e.g. ML Engineer"
              className="w-full px-3 py-2 rounded-xl bg-[#0a0a0f] border border-[#1e1e32] text-sm text-gray-200 font-dm placeholder-gray-600 focus:outline-none focus:border-[#6c63ff60] transition-colors"
            />
          </div>
        </div>

        {/* Resume */}
        <div>
          <label className="text-xs text-gray-500 font-syne uppercase tracking-wider mb-2 block">Your Resume</label>
          <ResumeUploader value={resumeText} onChange={setResumeText} />
        </div>

        {/* JD */}
        <div>
          <label className="text-xs text-gray-500 font-syne uppercase tracking-wider mb-2 block">Job Description</label>
          <textarea
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here…&#10;&#10;Include the entire posting for the most accurate analysis — requirements, responsibilities, preferred qualifications."
            rows={10}
            className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#1e1e32] text-sm text-gray-200 font-dm placeholder-gray-600 focus:outline-none focus:border-[#6c63ff60] resize-none transition-colors"
          />
          {jobDescription && (
            <p className="text-xs text-gray-600 font-dm mt-1">
              {jobDescription.split(/\s+/).filter(Boolean).length} words
            </p>
          )}
        </div>

        {/* Analyze button */}
        <button
          onClick={handleAnalyze}
          disabled={!canAnalyze || loading}
          className={`w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-syne font-bold text-sm transition-all ${
            canAnalyze && !loading
              ? 'btn-shine text-white cursor-pointer'
              : 'bg-[#1e1e32] text-gray-600 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing with Claude…
            </>
          ) : (
            <>
              <Zap size={16} />
              Analyze Resume
            </>
          )}
        </button>

        {!canAnalyze && !loading && (
          <p className="text-xs text-gray-600 text-center font-dm -mt-2">
            Add resume and job description to continue
          </p>
        )}
      </div>

      {/* RIGHT: Results */}
      <div className="space-y-4">
        {error && (
          <div className="p-4 rounded-xl border border-[#ff658430] bg-[#ff658410] animate-fadeIn">
            <p className="text-sm font-semibold text-[#ff6584] font-syne flex items-center gap-2">
              <AlertTriangle size={14} /> {error.title}
            </p>
            <p className="text-sm text-gray-400 font-dm mt-1">{error.body}</p>
          </div>
        )}

        {loading && !result && (
          <div className="flex flex-col items-center justify-center gap-4 py-16 animate-fadeIn">
            <div className="relative">
              <div className="w-16 h-16 border-2 border-[#6c63ff20] rounded-full" />
              <div className="absolute inset-0 w-16 h-16 border-2 border-[#6c63ff] border-t-transparent rounded-full animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-base font-syne font-semibold text-white">Analyzing your resume…</p>
              <p className="text-sm text-gray-500 font-dm mt-1">Claude is matching keywords and scoring your fit</p>
            </div>
          </div>
        )}

        {!loading && !result && !error && (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center border border-dashed border-[#1e1e32] rounded-2xl">
            <div className="w-16 h-16 rounded-2xl bg-[#1e1e32] flex items-center justify-center">
              <Zap size={28} className="text-[#6c63ff]" />
            </div>
            <div>
              <p className="text-base font-syne font-semibold text-white">Results appear here</p>
              <p className="text-sm text-gray-500 font-dm mt-1">Fill in your resume and the job description, then hit Analyze</p>
            </div>
          </div>
        )}

        {result && <ResultsPanel result={result} />}
      </div>
    </div>
  )
}
