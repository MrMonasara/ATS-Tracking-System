import { BookOpen, AlertTriangle, CheckCircle, Flag, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

const ATS_RULES = [
  {
    num: '01',
    title: 'Use exact keywords from the JD',
    body: 'ATS systems match literal strings. "Machine Learning" and "ML" are different tokens. Mirror the exact phrasing used in the job posting, not synonyms.',
    icon: '🔑',
  },
  {
    num: '02',
    title: 'Use a clean, single-column layout',
    body: 'Multi-column layouts, tables, headers/footers, and text boxes break most ATS parsers. Stick to a plain, top-to-bottom single column. Recruiters see the parsed text, not your design.',
    icon: '📐',
  },
  {
    num: '03',
    title: 'Use standard section headings',
    body: 'Use exactly: "Work Experience", "Education", "Skills", "Summary". Creative labels like "My Journey" or "What I Know" confuse parsers and get skipped.',
    icon: '🏷️',
  },
  {
    num: '04',
    title: 'Put skills in a dedicated Skills section',
    body: 'Don\'t hide skills only inside bullet points. ATS parses the Skills section first. List every relevant technology, language, and tool explicitly.',
    icon: '⚙️',
  },
  {
    num: '05',
    title: 'Quantify impact in every bullet',
    body: 'ATS and recruiters both reward specifics. "Improved model accuracy by 12%" beats "Improved model accuracy". Use numbers, percentages, and scale.',
    icon: '📊',
  },
  {
    num: '06',
    title: 'Save as .pdf or .docx only',
    body: 'Never send .pages, .odt, or image-based PDFs. Use a real text PDF (not a scan). Test by selecting the text — if you can\'t select it, ATS can\'t read it.',
    icon: '💾',
  },
  {
    num: '07',
    title: 'No graphics, icons, or images',
    body: 'Profile photos, skill meter bars, icons next to section titles — all invisible to ATS. They waste space and can corrupt parsing. Remove them entirely.',
    icon: '🚫',
  },
  {
    num: '08',
    title: 'Tailor for every application',
    body: 'One generic resume gets rejected by every ATS. Spend 15 minutes adding the top 5 missing keywords from each JD. This alone can raise your score by 15–25 points.',
    icon: '🎯',
  },
  {
    num: '09',
    title: 'Keep it 1–2 pages max',
    body: 'For students and people with <5 years experience: 1 page. For senior profiles: 2 pages. ATS doesn\'t penalize length, but recruiters who see 4-page student resumes reject immediately.',
    icon: '📄',
  },
  {
    num: '10',
    title: 'Use chronological order (most recent first)',
    body: 'ATS expects Work Experience to be sorted newest → oldest. Functional resumes (skill-grouped) confuse parsers. Always use reverse-chronological order.',
    icon: '📅',
  },
]

const MISTAKES = [
  { text: 'Sending the same resume to every job', severity: 'critical' },
  { text: 'Using a Canva or Figma template with columns and graphics', severity: 'critical' },
  { text: 'Putting contact info in the PDF header/footer', severity: 'critical' },
  { text: 'Using abbreviations without spelling them out once (e.g. NLP, CV)', severity: 'warning' },
  { text: 'Listing soft skills like "hardworking" or "team player" without evidence', severity: 'warning' },
  { text: 'Ignoring the "Required" vs "Preferred" distinction in JDs', severity: 'warning' },
  { text: 'Not including graduation year and university name in full', severity: 'warning' },
  { text: 'Weak summary section (or no summary at all)', severity: 'info' },
  { text: 'Using first person ("I developed", "I led")', severity: 'info' },
  { text: 'Inconsistent date formats (mix of "Jan 2023" and "01/2023")', severity: 'info' },
]

const GERMANY_TIPS = [
  {
    title: 'Include "Werkstudent" or "Praktikum" explicitly',
    body: 'German ATS systems and recruiters scan for these exact keywords. Even if you\'re applying for a full-time role, include any past Werkstudent or Praktikum positions with these words in the job title.',
  },
  {
    title: 'Anschreiben (cover letter) is still expected',
    body: 'Many German companies — especially traditional ones (Mittelstand) — still expect a formal cover letter. Reference the Stellenbezeichnung (job title) exactly. Write in German for German-language postings.',
  },
  {
    title: 'ECTS credits and degree equivalence matter',
    body: 'For international students: state your ECTS credit count and Notendurchschnitt (GPA). German ATS and HR teams use these to assess international degrees. Add "(equivalent to German 1.5)" if applicable.',
  },
  {
    title: 'Sprachkenntnisse: always list German + English levels',
    body: 'Use the CEFR scale (A1–C2). Even B1 German is a differentiator in Germany. If applying at a German company, always list "Deutsch: B2/C1" even for English-language roles.',
  },
  {
    title: 'Immatrikulationsbescheinigung for Werkstudent roles',
    body: 'Werkstudent contracts require proof of enrollment. Mention you\'re "eingeschrieben" (enrolled) and your expected Abschluss (graduation) date. Many ATS filters auto-screen for student status.',
  },
  {
    title: 'DATEV, SAP, and industry-specific German tools',
    body: 'German ATS systems in finance, manufacturing, and logistics heavily weight specific tools. If you have SAP, DATEV, or SolidWorks experience — list it explicitly in your Skills section.',
  },
]

function Accordion({ title, icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-2xl border border-[#1e1e32] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 hover:bg-[#1e1e3240] transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-syne font-bold text-white text-sm">{title}</span>
        </div>
        {open ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  )
}

export default function Tips() {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Hero */}
      <div className="p-6 rounded-2xl border border-[#6c63ff30] bg-gradient-to-br from-[#6c63ff10] to-[#13131f] mb-6">
        <h2 className="font-syne font-bold text-2xl text-white mb-2">How ATS Works for Students in Germany</h2>
        <p className="text-sm text-gray-400 font-dm leading-relaxed">
          Applicant Tracking Systems are used by 99% of Fortune 500 companies and most German Konzerne and tech firms.
          Up to 75% of resumes are rejected <em>before</em> a human sees them. This guide helps you beat the filters.
        </p>
      </div>

      {/* Top 10 Rules */}
      <Accordion title="Top 10 Rules for Beating ATS" icon={<BookOpen size={16} className="text-[#6c63ff]" />} defaultOpen>
        <div className="space-y-3 mt-2">
          {ATS_RULES.map(rule => (
            <div key={rule.num} className="flex gap-4 p-4 rounded-xl border border-[#1e1e32] hover:border-[#6c63ff30] transition-colors card-hover">
              <div className="shrink-0 flex flex-col items-center gap-1">
                <span className="text-xl">{rule.icon}</span>
                <span className="text-xs font-syne font-bold text-[#6c63ff]">{rule.num}</span>
              </div>
              <div>
                <p className="text-sm font-syne font-semibold text-white mb-1">{rule.title}</p>
                <p className="text-xs text-gray-400 font-dm leading-relaxed">{rule.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Accordion>

      {/* Common Mistakes */}
      <Accordion title="Common Mistakes to Avoid" icon={<AlertTriangle size={16} className="text-[#f7971e]" />}>
        <div className="space-y-2 mt-2">
          {MISTAKES.map((m, i) => {
            const colors = {
              critical: { dot: '#ff6584', bg: 'rgba(255,101,132,0.08)', border: 'rgba(255,101,132,0.2)' },
              warning:  { dot: '#f7971e', bg: 'rgba(247,151,30,0.08)',  border: 'rgba(247,151,30,0.2)' },
              info:     { dot: '#6c63ff', bg: 'rgba(108,99,255,0.08)',  border: 'rgba(108,99,255,0.2)' },
            }
            const c = colors[m.severity]
            return (
              <div
                key={i}
                className="flex items-start gap-3 px-4 py-3 rounded-xl"
                style={{ background: c.bg, border: `1px solid ${c.border}` }}
              >
                <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: c.dot }} />
                <span className="text-sm text-gray-300 font-dm">{m.text}</span>
              </div>
            )
          })}
        </div>
      </Accordion>

      {/* Germany Tips */}
      <Accordion title="German-Specific ATS Tips" icon={<Flag size={16} className="text-[#43e97b]" />}>
        <div className="space-y-3 mt-2">
          {GERMANY_TIPS.map((tip, i) => (
            <div key={i} className="p-4 rounded-xl border border-[#1e1e32] card-hover">
              <div className="flex items-start gap-2 mb-1.5">
                <CheckCircle size={14} className="text-[#43e97b] mt-0.5 shrink-0" />
                <p className="text-sm font-syne font-semibold text-white">{tip.title}</p>
              </div>
              <p className="text-xs text-gray-400 font-dm leading-relaxed pl-5">{tip.body}</p>
            </div>
          ))}
        </div>
      </Accordion>

      {/* Quick reference card */}
      <div className="p-5 rounded-2xl border border-[#1e1e32] bg-[#13131f]">
        <p className="text-xs font-syne font-bold text-gray-500 uppercase tracking-widest mb-3">Quick Reference: ATS Score Thresholds</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          {[
            { range: '90–100', label: 'Strong Pass', color: '#43e97b', note: 'Interview likely' },
            { range: '75–89', label: 'Borderline', color: '#ffd200', note: 'May pass, fix keywords' },
            { range: '51–74', label: 'Risky', color: '#f7971e', note: 'Needs major work' },
            { range: '0–50', label: 'Rejected', color: '#ff6584', note: 'Auto-rejected by ATS' },
          ].map(item => (
            <div
              key={item.range}
              className="p-3 rounded-xl"
              style={{ background: `${item.color}10`, border: `1px solid ${item.color}25` }}
            >
              <p className="text-lg font-syne font-bold" style={{ color: item.color }}>{item.range}</p>
              <p className="text-xs font-syne font-semibold text-white mt-0.5">{item.label}</p>
              <p className="text-xs text-gray-500 font-dm mt-0.5">{item.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
