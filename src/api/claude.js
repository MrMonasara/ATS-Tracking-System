const SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) analyzer with deep knowledge of how modern ATS software works. You analyze resumes against job descriptions and return structured JSON feedback.

Your analysis must be precise, actionable, and specific to the provided resume and JD. Never give generic advice.`

const USER_PROMPT_TEMPLATE = (resumeText, jobDescription) => `Analyze this resume against the job description and return ONLY valid JSON (no markdown, no explanation, just the JSON object).

=== RESUME ===
${resumeText}

=== JOB DESCRIPTION ===
${jobDescription}

Return this exact JSON structure:
{
  "overallScore": <integer 0-100>,
  "verdict": <"Strong Pass" | "Borderline" | "Risky" | "Rejected">,
  "keywordMatch": {
    "matched": [<keywords found verbatim or near-verbatim in resume>],
    "partial": [<keywords implied or partially present>],
    "missing": [<important JD keywords completely absent from resume>]
  },
  "breakdown": {
    "technicalSkills": <0-100>,
    "coreKeywords": <0-100>,
    "education": <0-100>,
    "experience": <0-100>,
    "format": <0-100>,
    "domain": <0-100>
  },
  "fixes": [
    {
      "priority": <"critical" | "important" | "good">,
      "title": <short title>,
      "issue": <specific issue found>,
      "action": <concrete action to take>,
      "example": <optional: show a rewrite example>,
      "scoreImpact": <estimated score points gained>
    }
  ],
  "roadmapTo95": [
    {
      "step": <integer starting at 1>,
      "action": <specific action>,
      "detail": <why this matters for this specific JD>,
      "scoreGain": <integer>,
      "effort": <"5 min" | "15 min" | "30 min" | "1 hr">
    }
  ],
  "rewrites": [
    {
      "original": <exact weak bullet from resume>,
      "optimized": <ATS-optimized rewrite with keywords>,
      "improvement": <what was added/changed>
    }
  ],
  "strengths": [<3-5 specific strengths this resume has for this JD>],
  "overallFeedback": <2-3 sentence summary of the analysis>,
  "cvUpgrade": {
    "targetScore": 95,
    "sections": [
      {
        "name": <section name e.g. "Professional Summary", "Skills", "Work Experience – Company Name", "Education">,
        "currentScore": <0-100, how strong this section is right now>,
        "targetScore": <0-100, what it should be after improvements>,
        "status": <"weak" | "needs_work" | "good">,
        "issues": [<specific problems found in this section relevant to this JD>],
        "keywordsToAdd": [<exact keyword phrases from JD missing in this section>],
        "rewrites": [
          {
            "original": <exact text from resume — bullet, sentence, or line>,
            "optimized": <full ATS-optimized rewrite with keywords embedded naturally>,
            "reason": <what changed and why it improves ATS score>
          }
        ],
        "newContent": <if section needs new lines added that don't exist yet, provide them here as a string, else null>
      }
    ],
    "summaryOfChanges": <2-3 sentence overview of what the full upgrade achieves>
  }
}

Score calibration:
- 90-100: Resume is an excellent match, most keywords present, strong format
- 75-89: Good match but missing some keywords or has formatting issues
- 51-74: Moderate match, several important keywords missing
- 0-50: Poor match, major keywords missing or wrong domain

For cvUpgrade.sections: cover EVERY section that exists in the resume. For weak/needs_work sections provide full rewrites of ALL bullets, not just a sample. For good sections still list keywordsToAdd if any are missing. Be exhaustive — the goal is a ready-to-paste upgrade for every single line that needs changing.`

export async function analyzeResume(resumeText, jobDescription) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  if (!apiKey || apiKey === 'your_key_here') {
    throw new Error('MISSING_API_KEY')
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      max_tokens: 6000,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: USER_PROMPT_TEMPLATE(resumeText, jobDescription) },
      ],
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    if (response.status === 401) throw new Error('INVALID_API_KEY')
    if (response.status === 429) throw new Error('RATE_LIMITED')
    if (response.status === 500) throw new Error('API_OVERLOADED')
    throw new Error(error?.error?.message || `API error ${response.status}`)
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content || ''

  try {
    return JSON.parse(content)
  } catch {
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('PARSE_ERROR')
    try {
      return JSON.parse(jsonMatch[0])
    } catch {
      throw new Error('PARSE_ERROR')
    }
  }
}
