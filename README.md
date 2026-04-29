# ATS Resume Scorer

A full-stack AI-powered Applicant Tracking System (ATS) resume analyzer built with React + Vite. Upload your resume and a job description — get an instant ATS score, keyword gap analysis, section-by-section rewrite suggestions, and a roadmap to hit 95+.

![ATS Score](https://img.shields.io/badge/AI-GPT--4o-412991?style=flat-square&logo=openai)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38BDF8?style=flat-square&logo=tailwindcss)

---

## Features

### Analyzer Tab
- **Drag & drop PDF** upload or paste resume text (uses `pdfjs-dist` — no backend needed)
- **ATS Score Gauge** — animated 0–100 circular gauge, color-coded:
  - 🟢 90–100: Strong Pass
  - 🟡 75–89: Borderline
  - 🟠 51–74: Risky
  - 🔴 0–50: Rejected
- **Keyword Match Grid** — green (found) / orange (partial) / red (missing) tags
- **Score Breakdown** — 6 categories with animated progress bars (Technical Skills, Core Keywords, Education, Experience, Format, Domain)
- **Fix Suggestions** — priority-ranked cards (Critical / Important / Good), collapsible with score impact
- **Roadmap to 95+** — step-by-step action plan with estimated score gain per action
- **CV Upgrade Plan** — section-by-section full rewrite (every weak bullet, ready to paste)

### Tracker Tab
- Table of all past applications (auto-saved after each analysis)
- Columns: Company, Role, Date, ATS Score, Status, Notes
- Inline add / edit / delete
- Filter by status (Applied / Interview / Rejected / Offer)
- Summary stats: Total Applied, Avg Score, Interview Rate, Offers

### Tips Tab
- How ATS systems work
- Top 10 rules for beating ATS
- Common mistakes to avoid
- Germany-specific tips (Werkstudent, Anschreiben, ECTS, etc.)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite 6 |
| Styling | Tailwind CSS 3 |
| Icons | Lucide React |
| AI Analysis | OpenAI GPT-4o API |
| PDF Parsing | pdfjs-dist (in-browser, no backend) |
| Persistence | localStorage |
| Fonts | Syne + DM Sans (Google Fonts) |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/ats-resume-scorer.git
cd ats-resume-scorer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add your OpenAI API key

Create a `.env` file in the root:

```env
VITE_OPENAI_API_KEY=sk-proj-...
```

> Get your key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys). Each analysis costs ~$0.02–0.05 with GPT-4o.

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Project Structure

```
src/
├── api/
│   └── claude.js          # OpenAI API call + prompt
├── components/
│   ├── Analyzer.jsx        # Main tab — inputs + results layout
│   ├── ResumeUploader.jsx  # PDF drag-drop + pdfjs extraction
│   ├── ResultsPanel.jsx    # Tabbed results container
│   ├── ScoreGauge.jsx      # Animated circular score gauge
│   ├── KeywordGrid.jsx     # Green/orange/red keyword tags
│   ├── ScoreBreakdown.jsx  # 6-category progress bars
│   ├── FixSuggestions.jsx  # Priority-ranked fix cards
│   ├── RoadmapTo95.jsx     # Step-by-step score roadmap
│   ├── CVUpgrade.jsx       # Full section-by-section rewrite plan
│   ├── RewritePanel.jsx    # Before/after bullet rewrites
│   ├── Tracker.jsx         # Application tracker table
│   └── Tips.jsx            # ATS guide + Germany tips
└── App.jsx                 # Tab navigation + localStorage + toasts
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_OPENAI_API_KEY` | Your OpenAI API key (`sk-proj-...`) |

> The `.env` file is in `.gitignore` — your key is never committed.

---

## Privacy

All processing happens in your browser. Your resume text is sent directly to the OpenAI API from your browser — it never touches any intermediate server. Application tracker data is stored only in your browser's `localStorage`.

---

## License

MIT
