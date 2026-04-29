import { useState, useEffect, useCallback } from 'react'
import { Zap, LayoutList, BookOpen, Github, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react'
import Analyzer from './components/Analyzer'
import Tracker from './components/Tracker'
import Tips from './components/Tips'

const STORAGE_KEY = 'ats-applications'

const TABS = [
  { id: 'analyzer', label: 'Analyzer', icon: <Zap size={15} /> },
  { id: 'tracker',  label: 'Tracker',  icon: <LayoutList size={15} /> },
  { id: 'tips',     label: 'Tips',     icon: <BookOpen size={15} /> },
]

// Toast system
let toastId = 0
const toastListeners = new Set()

export function toast(message, type = 'info') {
  const id = ++toastId
  toastListeners.forEach(fn => fn({ id, message, type }))
}

function Toast({ t, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(t.id), 4000)
    return () => clearTimeout(timer)
  }, [t.id, onRemove])

  const styles = {
    success: { icon: <CheckCircle size={16} />, color: '#43e97b', border: 'rgba(67,233,123,0.3)' },
    error:   { icon: <XCircle size={16} />,     color: '#ff6584', border: 'rgba(255,101,132,0.3)' },
    warning: { icon: <AlertTriangle size={16} />, color: '#f7971e', border: 'rgba(247,151,30,0.3)' },
    info:    { icon: <Info size={16} />,          color: '#6c63ff', border: 'rgba(108,99,255,0.3)' },
  }
  const s = styles[t.type] || styles.info

  return (
    <div
      className="toast"
      style={{ borderColor: s.border }}
      onClick={() => onRemove(t.id)}
    >
      <span style={{ color: s.color }}>{s.icon}</span>
      <span className="text-sm text-gray-200 font-dm">{t.message}</span>
    </div>
  )
}

function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const handler = (t) => setToasts(prev => [...prev, t])
    toastListeners.add(handler)
    return () => toastListeners.delete(handler)
  }, [])

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <div className="toast-container">
      {toasts.map(t => <Toast key={t.id} t={t} onRemove={remove} />)}
    </div>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState('analyzer')
  const [applications, setApplications] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
  }, [applications])

  const handleSaveApplication = useCallback((app) => {
    setApplications(prev => [app, ...prev])
    toast('Application saved to Tracker', 'success')
  }, [])

  const handleUpdateApplications = useCallback((updated) => {
    setApplications(updated)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Top nav */}
      <header className="glass border-b border-[#1e1e32] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#6c63ff] flex items-center justify-center">
                <Zap size={14} className="text-white" />
              </div>
              <span className="font-syne font-bold text-white text-base tracking-tight">
                ATS<span className="text-[#6c63ff]">Score</span>
              </span>
              <span className="hidden sm:inline text-xs text-gray-600 font-dm ml-1">for students</span>
            </div>

            {/* Tabs */}
            <nav className="flex items-center gap-1">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-syne font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'text-white bg-[#6c63ff20]'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-[#1e1e3260]'
                  }`}
                >
                  <span className={activeTab === tab.id ? 'text-[#6c63ff]' : ''}>{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                  {tab.id === 'tracker' && applications.length > 0 && (
                    <span className="ml-0.5 text-[10px] bg-[#6c63ff] text-white rounded-full w-4 h-4 flex items-center justify-center font-dm">
                      {applications.length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Page header */}
        <div className="mb-6">
          {activeTab === 'analyzer' && (
            <div className="animate-fadeIn">
              <h1 className="font-syne font-bold text-2xl sm:text-3xl text-white mb-1">
                Resume ATS Analyzer
              </h1>
              <p className="text-sm text-gray-500 font-dm">
                Powered by Claude AI — paste your resume and job description to get your ATS score instantly
              </p>
            </div>
          )}
          {activeTab === 'tracker' && (
            <div className="animate-fadeIn">
              <h1 className="font-syne font-bold text-2xl sm:text-3xl text-white mb-1">
                Application Tracker
              </h1>
              <p className="text-sm text-gray-500 font-dm">
                Track all your job applications, scores, and statuses in one place
              </p>
            </div>
          )}
          {activeTab === 'tips' && (
            <div className="animate-fadeIn">
              <h1 className="font-syne font-bold text-2xl sm:text-3xl text-white mb-1">
                ATS Tips & Guide
              </h1>
              <p className="text-sm text-gray-500 font-dm">
                Everything you need to know to beat applicant tracking systems
              </p>
            </div>
          )}
        </div>

        {/* Tab panels */}
        <div key={activeTab} className="animate-fadeIn">
          {activeTab === 'analyzer' && (
            <Analyzer onSaveApplication={handleSaveApplication} />
          )}
          {activeTab === 'tracker' && (
            <Tracker applications={applications} onUpdate={handleUpdateApplications} />
          )}
          {activeTab === 'tips' && (
            <Tips />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e1e32] mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-gray-600 font-dm">
            Built with Claude AI · Resume data never leaves your browser
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-600 font-dm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#43e97b] pulse-dot inline-block" />
            OpenAI gpt-4o
          </div>
        </div>
      </footer>

      <ToastContainer />
    </div>
  )
}
