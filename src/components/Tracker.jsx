import { useState } from 'react'
import { Plus, Trash2, Edit3, Check, X, Filter, TrendingUp, Briefcase, Award, Users } from 'lucide-react'

const STATUSES = ['Applied', 'Interview', 'Rejected', 'Offer']

const STATUS_STYLES = {
  Applied:   { bg: 'rgba(108,99,255,0.15)',  text: '#6c63ff',  border: 'rgba(108,99,255,0.3)' },
  Interview: { bg: 'rgba(67,233,123,0.15)',  text: '#43e97b',  border: 'rgba(67,233,123,0.3)' },
  Rejected:  { bg: 'rgba(255,101,132,0.15)', text: '#ff6584',  border: 'rgba(255,101,132,0.3)' },
  Offer:     { bg: 'rgba(247,151,30,0.15)',  text: '#f7971e',  border: 'rgba(247,151,30,0.3)' },
}

function scoreColor(s) {
  if (s >= 90) return '#43e97b'
  if (s >= 75) return '#ffd200'
  if (s >= 51) return '#f7971e'
  return '#ff6584'
}

function ScoreBadge({ score }) {
  const color = scoreColor(score)
  return (
    <span
      className="inline-flex items-center justify-center w-10 h-7 rounded-lg text-xs font-syne font-bold"
      style={{ background: `${color}20`, color }}
    >
      {score}
    </span>
  )
}

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.Applied
  return (
    <span
      className="px-2.5 py-1 rounded-full text-xs font-syne font-semibold"
      style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}
    >
      {status}
    </span>
  )
}

function EmptyRow({ onCreate }) {
  return (
    <tr>
      <td colSpan={6}>
        <div className="flex flex-col items-center gap-3 py-12">
          <div className="w-12 h-12 rounded-2xl bg-[#1e1e32] flex items-center justify-center">
            <Briefcase size={20} className="text-gray-600" />
          </div>
          <p className="text-sm text-gray-500 font-dm">No applications yet</p>
          <button
            onClick={onCreate}
            className="px-4 py-2 rounded-xl bg-[#6c63ff20] text-[#6c63ff] text-xs font-syne font-semibold hover:bg-[#6c63ff30] transition-colors"
          >
            Add your first application
          </button>
        </div>
      </td>
    </tr>
  )
}

function EditableRow({ app, onSave, onCancel }) {
  const [form, setForm] = useState({ ...app })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <tr className="border-t border-[#1e1e32] bg-[#6c63ff08]">
      <td className="px-4 py-2">
        <input value={form.company} onChange={e => set('company', e.target.value)}
          className="w-full bg-[#0a0a0f] border border-[#1e1e32] rounded-lg px-2 py-1 text-sm text-white font-dm focus:outline-none focus:border-[#6c63ff60]" />
      </td>
      <td className="px-4 py-2">
        <input value={form.role} onChange={e => set('role', e.target.value)}
          className="w-full bg-[#0a0a0f] border border-[#1e1e32] rounded-lg px-2 py-1 text-sm text-white font-dm focus:outline-none focus:border-[#6c63ff60]" />
      </td>
      <td className="px-4 py-2">
        <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
          className="w-full bg-[#0a0a0f] border border-[#1e1e32] rounded-lg px-2 py-1 text-sm text-white font-dm focus:outline-none focus:border-[#6c63ff60]" />
      </td>
      <td className="px-4 py-2">
        <input type="number" min={0} max={100} value={form.score} onChange={e => set('score', Number(e.target.value))}
          className="w-16 bg-[#0a0a0f] border border-[#1e1e32] rounded-lg px-2 py-1 text-sm text-white font-dm focus:outline-none focus:border-[#6c63ff60]" />
      </td>
      <td className="px-4 py-2">
        <select value={form.status} onChange={e => set('status', e.target.value)}
          className="bg-[#0a0a0f] border border-[#1e1e32] rounded-lg px-2 py-1 text-sm text-white font-dm focus:outline-none">
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
      </td>
      <td className="px-4 py-2">
        <input value={form.notes} onChange={e => set('notes', e.target.value)}
          placeholder="Notes…"
          className="w-full bg-[#0a0a0f] border border-[#1e1e32] rounded-lg px-2 py-1 text-sm text-white font-dm focus:outline-none focus:border-[#6c63ff60]" />
      </td>
      <td className="px-4 py-2">
        <div className="flex gap-1">
          <button onClick={() => onSave(form)} className="p-1.5 rounded-lg bg-[#43e97b20] text-[#43e97b] hover:bg-[#43e97b30]"><Check size={13} /></button>
          <button onClick={onCancel} className="p-1.5 rounded-lg bg-[#ff658420] text-[#ff6584] hover:bg-[#ff658430]"><X size={13} /></button>
        </div>
      </td>
    </tr>
  )
}

export default function Tracker({ applications, onUpdate }) {
  const [editId, setEditId] = useState(null)
  const [filterStatus, setFilterStatus] = useState('All')
  const [showAddRow, setShowAddRow] = useState(false)
  const newApp = { id: Date.now().toString(), company: '', role: '', date: new Date().toISOString().split('T')[0], score: 0, status: 'Applied', notes: '' }

  const filtered = filterStatus === 'All' ? applications : applications.filter(a => a.status === filterStatus)

  const stats = {
    total: applications.length,
    avgScore: applications.length ? Math.round(applications.reduce((s, a) => s + (a.score || 0), 0) / applications.length) : 0,
    interviews: applications.filter(a => a.status === 'Interview' || a.status === 'Offer').length,
    offers: applications.filter(a => a.status === 'Offer').length,
  }
  const interviewRate = stats.total ? Math.round((stats.interviews / stats.total) * 100) : 0

  const handleSave = (updated) => {
    const exists = applications.find(a => a.id === updated.id)
    if (exists) {
      onUpdate(applications.map(a => a.id === updated.id ? updated : a))
    } else {
      onUpdate([...applications, { ...updated, id: Date.now().toString() }])
    }
    setEditId(null)
    setShowAddRow(false)
  }

  const handleDelete = (id) => {
    onUpdate(applications.filter(a => a.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Applied', value: stats.total, icon: <Briefcase size={16} />, color: '#6c63ff' },
          { label: 'Avg ATS Score', value: stats.avgScore, icon: <TrendingUp size={16} />, color: '#43e97b' },
          { label: 'Interview Rate', value: `${interviewRate}%`, icon: <Users size={16} />, color: '#f7971e' },
          { label: 'Offers', value: stats.offers, icon: <Award size={16} />, color: '#ffd200' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="p-4 rounded-2xl border border-[#1e1e32] bg-[#13131f]">
            <div className="flex items-center gap-2 mb-2" style={{ color }}>
              {icon}
              <span className="text-xs font-syne uppercase tracking-wider text-gray-500">{label}</span>
            </div>
            <p className="text-2xl font-syne font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Table controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={13} className="text-gray-500" />
          {['All', ...STATUSES].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1 rounded-full text-xs font-syne font-semibold transition-colors ${
                filterStatus === s
                  ? 'bg-[#6c63ff] text-white'
                  : 'bg-[#1e1e32] text-gray-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowAddRow(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#6c63ff20] text-[#6c63ff] text-xs font-syne font-semibold hover:bg-[#6c63ff30] transition-colors"
        >
          <Plus size={13} /> Add
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[#1e1e32] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e1e32]">
                {['Company', 'Role', 'Date', 'Score', 'Status', 'Notes', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-syne font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {showAddRow && (
                <EditableRow
                  app={newApp}
                  onSave={handleSave}
                  onCancel={() => setShowAddRow(false)}
                />
              )}
              {filtered.length === 0 && !showAddRow && (
                <EmptyRow onCreate={() => setShowAddRow(true)} />
              )}
              {filtered.map(app => (
                editId === app.id ? (
                  <EditableRow key={app.id} app={app} onSave={handleSave} onCancel={() => setEditId(null)} />
                ) : (
                  <tr key={app.id} className="border-t border-[#1e1e32] hover:bg-[#1e1e3240] transition-colors group">
                    <td className="px-4 py-3 font-dm text-white font-medium whitespace-nowrap">{app.company}</td>
                    <td className="px-4 py-3 font-dm text-gray-300 whitespace-nowrap">{app.role}</td>
                    <td className="px-4 py-3 font-dm text-gray-500 whitespace-nowrap">{app.date}</td>
                    <td className="px-4 py-3"><ScoreBadge score={app.score} /></td>
                    <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
                    <td className="px-4 py-3 font-dm text-gray-500 max-w-[180px] truncate">{app.notes}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditId(app.id)} className="p-1.5 rounded-lg hover:bg-[#6c63ff20] text-gray-500 hover:text-[#6c63ff]"><Edit3 size={13} /></button>
                        <button onClick={() => handleDelete(app.id)} className="p-1.5 rounded-lg hover:bg-[#ff658420] text-gray-500 hover:text-[#ff6584]"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
