import { useState, useRef, useCallback } from 'react'
import { Upload, FileText, X, AlertCircle } from 'lucide-react'

async function extractTextFromPDF(file) {
  const pdfjsLib = await import('pdfjs-dist')
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url
  ).href

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  let text = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    text += content.items.map(item => item.str).join(' ') + '\n'
  }
  return text.trim()
}

export default function ResumeUploader({ value, onChange }) {
  const [mode, setMode] = useState('upload') // 'upload' | 'text'
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef()

  const handleFile = useCallback(async (file) => {
    if (!file) return
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file.')
      return
    }
    setError('')
    setLoading(true)
    setFileName(file.name)
    try {
      const text = await extractTextFromPDF(file)
      if (!text || text.length < 50) {
        setError('Could not extract text from this PDF. Try pasting the text manually.')
        setFileName('')
        onChange('')
      } else {
        onChange(text)
      }
    } catch (e) {
      setError('Failed to read PDF. Try pasting your resume text instead.')
      setFileName('')
    } finally {
      setLoading(false)
    }
  }, [onChange])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }, [handleFile])

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true) }
  const handleDragLeave = () => setDragging(false)

  const clearFile = () => {
    setFileName('')
    onChange('')
    setError('')
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="space-y-3">
      {/* Mode toggle */}
      <div className="flex gap-1 p-1 rounded-xl bg-[#0a0a0f] border border-[#1e1e32] w-fit">
        {[['upload', 'Upload PDF'], ['text', 'Paste Text']].map(([m, label]) => (
          <button
            key={m}
            onClick={() => { setMode(m); clearFile() }}
            className={`px-4 py-1.5 rounded-lg text-xs font-syne font-semibold transition-all ${
              mode === m
                ? 'bg-[#6c63ff] text-white shadow'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === 'upload' ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !fileName && fileRef.current?.click()}
          className={`relative rounded-xl border-2 border-dashed transition-all cursor-pointer min-h-[140px] flex flex-col items-center justify-center gap-3 px-4 ${
            dragging
              ? 'border-[#6c63ff] bg-[#6c63ff10]'
              : fileName
              ? 'border-[#43e97b40] bg-[#43e97b08] cursor-default'
              : 'border-[#1e1e32] hover:border-[#6c63ff60] hover:bg-[#6c63ff05]'
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={e => handleFile(e.target.files[0])}
          />

          {loading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-[#6c63ff] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-400 font-dm">Reading PDF…</p>
            </div>
          ) : fileName ? (
            <div className="flex items-center gap-3">
              <FileText size={28} className="text-[#43e97b]" />
              <div className="text-left">
                <p className="text-sm font-semibold text-white font-dm">{fileName}</p>
                <p className="text-xs text-[#43e97b] font-dm mt-0.5">
                  ✓ {value?.split(' ').length?.toLocaleString()} words extracted
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); clearFile() }}
                className="ml-2 p-1 rounded-lg hover:bg-[#1e1e32] text-gray-500 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-[#1e1e32] flex items-center justify-center">
                <Upload size={20} className="text-[#6c63ff]" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-white font-dm">
                  Drop your resume PDF here
                </p>
                <p className="text-xs text-gray-500 font-dm mt-1">
                  or click to browse — PDF only
                </p>
              </div>
            </>
          )}
        </div>
      ) : (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Paste your resume text here…&#10;&#10;Include: Summary, Skills, Experience, Education sections for best results."
          rows={8}
          className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#1e1e32] text-sm text-gray-200 font-dm placeholder-gray-600 focus:outline-none focus:border-[#6c63ff60] resize-none transition-colors"
        />
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-[#ff6584] font-dm">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {value && !loading && (
        <p className="text-xs text-gray-600 font-dm">
          {value.length.toLocaleString()} characters · {value.split(/\s+/).filter(Boolean).length.toLocaleString()} words
        </p>
      )}
    </div>
  )
}
