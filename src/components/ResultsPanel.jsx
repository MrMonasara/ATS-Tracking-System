import { useState } from 'react'
import ScoreGauge from './ScoreGauge'
import KeywordGrid from './KeywordGrid'
import ScoreBreakdown from './ScoreBreakdown'
import FixSuggestions from './FixSuggestions'
import RoadmapTo95 from './RoadmapTo95'
import RewritePanel from './RewritePanel'
import CVUpgrade from './CVUpgrade'
import { Key, BarChart2, Wrench, Map, Sparkles, MessageSquare, FileEdit } from 'lucide-react'

const TABS = [
  { id: 'keywords',  label: 'Keywords',   icon: <Key size={14} /> },
  { id: 'breakdown', label: 'Breakdown',  icon: <BarChart2 size={14} /> },
  { id: 'fixes',     label: 'Fixes',      icon: <Wrench size={14} /> },
  { id: 'roadmap',   label: 'Roadmap',    icon: <Map size={14} /> },
  { id: 'upgrade',   label: 'CV Upgrade', icon: <FileEdit size={14} />, highlight: true },
]

export default function ResultsPanel({ result }) {
  const [activeTab, setActiveTab] = useState('keywords')

  if (!result) return null

  const weakCount = result.cvUpgrade?.sections?.filter(
    s => s.status === 'weak' || s.status === 'needs_work'
  ).length || 0

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Score + feedback header */}
      <div className="p-5 rounded-2xl border border-[#1e1e32] bg-[#13131f] flex flex-col items-center gap-4">
        <ScoreGauge score={result.overallScore} verdict={result.verdict} />
        {result.overallFeedback && (
          <div className="w-full p-3.5 rounded-xl bg-[#0a0a0f] border border-[#1e1e32] flex items-start gap-2.5">
            <MessageSquare size={14} className="text-[#6c63ff] mt-0.5 shrink-0" />
            <p className="text-sm text-gray-300 font-dm leading-relaxed">{result.overallFeedback}</p>
          </div>
        )}
      </div>

      {/* Detail tabs */}
      <div className="rounded-2xl border border-[#1e1e32] bg-[#13131f] overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b border-[#1e1e32] overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-1.5 px-4 py-3 text-xs font-syne font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? tab.highlight ? 'text-[#43e97b]' : 'text-[#6c63ff]'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
              {/* Badge showing weak section count on CV Upgrade tab */}
              {tab.id === 'upgrade' && weakCount > 0 && activeTab !== 'upgrade' && (
                <span className="ml-0.5 text-[10px] bg-[#ff6584] text-white rounded-full w-4 h-4 flex items-center justify-center font-dm">
                  {weakCount}
                </span>
              )}
              {activeTab === tab.id && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
                  style={{ background: tab.highlight ? '#43e97b' : '#6c63ff' }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-5">
          {activeTab === 'keywords' && result.keywordMatch && (
            <KeywordGrid keywordMatch={result.keywordMatch} />
          )}
          {activeTab === 'breakdown' && result.breakdown && (
            <ScoreBreakdown breakdown={result.breakdown} />
          )}
          {activeTab === 'fixes' && result.fixes && (
            <FixSuggestions fixes={result.fixes} strengths={result.strengths} />
          )}
          {activeTab === 'roadmap' && result.roadmapTo95 && (
            <RoadmapTo95 roadmap={result.roadmapTo95} currentScore={result.overallScore} />
          )}
          {activeTab === 'upgrade' && (
            <CVUpgrade cvUpgrade={result.cvUpgrade} currentScore={result.overallScore} />
          )}
        </div>
      </div>
    </div>
  )
}
