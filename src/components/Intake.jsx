import { useState } from "react";

const QUESTIONS = [
  {
    id: "name",
    number: "00",
    label: "First, what's your name?",
    hint: "We'll personalize everything for you.",
    type: "text",
    placeholder: "Your full name",
  },
  {
    id: "field",
    number: "01",
    label: "What's your main field or work?",
    hint: "Be as specific as you can. This shapes everything.",
    type: "text",
    placeholder: "e.g. Tech entrepreneurship, Public health, Creative writing...",
  },
  {
    id: "dream",
    number: "02",
    label: "If you had zero limitations — what would you build or become?",
    hint: "No filters. No 'but I can't because...' Just the dream.",
    type: "textarea",
    placeholder: "The biggest, most audacious version of what you want...",
  },
  {
    id: "drives",
    number: "03",
    label: "What drives you at your core?",
    hint: "The fuel beneath everything you do.",
    type: "options",
    options: [
      { value: "legacy", icon: "🏛️", label: "Legacy", sub: "Building something that outlasts you" },
      { value: "impact", icon: "🌍", label: "Impact", sub: "Changing lives and systems" },
      { value: "wealth", icon: "💎", label: "Wealth", sub: "Financial freedom and security" },
      { value: "recognition", icon: "🔦", label: "Recognition", sub: "Being known, respected, heard" },
      { value: "justice", icon: "⚖️", label: "Justice", sub: "Righting wrongs, equity" },
      { value: "creativity", icon: "🎨", label: "Creation", sub: "Making things that didn't exist" },
      { value: "faith", icon: "✨", label: "Purpose/Faith", sub: "Called to something bigger" },
      { value: "knowledge", icon: "📚", label: "Knowledge", sub: "Learning, research, discovery" },
    ],
    multiple: false,
  },
  {
    id: "stage",
    number: "04",
    label: "What best describes where you are right now?",
    hint: "Honest answer unlocks the right opportunities.",
    type: "options",
    options: [
      { value: "student", icon: "🎓", label: "Student", sub: "Currently in school/university" },
      { value: "early_career", icon: "🚀", label: "Early Career", sub: "0–3 years out, building" },
      { value: "founder", icon: "⚡", label: "Founder", sub: "Running or building a venture" },
      { value: "professional", icon: "💼", label: "Professional", sub: "Established in your field" },
      { value: "career_change", icon: "🔄", label: "Pivoting", sub: "Transitioning to something new" },
      { value: "creative", icon: "🖊️", label: "Creator", sub: "Writer, artist, builder" },
    ],
    multiple: false,
  },
  {
    id: "goal",
    number: "05",
    label: "What's your primary goal right now?",
    hint: "Pick the one that matters most at this moment.",
    type: "options",
    options: [
      { value: "funding", icon: "💰", label: "Get Funded", sub: "Grants, scholarships, investment" },
      { value: "network", icon: "🤝", label: "Build Network", sub: "Find your people, collaborators" },
      { value: "visibility", icon: "📣", label: "Get Visible", sub: "Platform, press, recognition" },
      { value: "career", icon: "📈", label: "Career Growth", sub: "Jobs, fellowships, internships" },
      { value: "travel", icon: "✈️", label: "Travel/Mobility", sub: "Programs abroad, exchanges" },
      { value: "skills", icon: "🧠", label: "Build Skills", sub: "Training, education, certifications" },
    ],
    multiple: false,
  },
  {
    id: "strengths",
    number: "06",
    label: "Pick your top 3 strengths.",
    hint: "Select exactly 3 — the ones you'd bet on.",
    type: "options",
    multiple: true,
    maxSelect: 3,
    options: [
      { value: "leadership", icon: "👑", label: "Leadership" },
      { value: "entrepreneurship", icon: "🔥", label: "Entrepreneurship" },
      { value: "writing", icon: "✍️", label: "Writing" },
      { value: "tech", icon: "💻", label: "Technology" },
      { value: "research", icon: "🔬", label: "Research" },
      { value: "community", icon: "🌱", label: "Community Building" },
      { value: "communication", icon: "🎤", label: "Public Speaking" },
      { value: "design", icon: "🎨", label: "Design/Creative" },
      { value: "policy", icon: "📜", label: "Policy/Advocacy" },
      { value: "finance", icon: "📊", label: "Finance/Business" },
      { value: "health", icon: "❤️", label: "Health/Medicine" },
      { value: "faith_community", icon: "🙏", label: "Faith & Community" },
    ],
  },
  {
    id: "identity",
    number: "07",
    label: "Any communities or identities you belong to?",
    hint: "Optional — but unlocks targeted opportunities. Select all that apply.",
    type: "options",
    multiple: true,
    optional: true,
    options: [
      { value: "african", icon: "🌍", label: "African" },
      { value: "diaspora", icon: "✈️", label: "African Diaspora" },
      { value: "first_gen", icon: "🎓", label: "First-Generation" },
      { value: "woman", icon: "♀️", label: "Woman" },
      { value: "youth", icon: "⚡", label: "Youth (Under 35)" },
      { value: "stem_minority", icon: "🔬", label: "Minority in STEM" },
      { value: "entrepreneur", icon: "🚀", label: "Entrepreneur" },
      { value: "faith_based", icon: "✨", label: "Faith-Based" },
      { value: "none", icon: "—", label: "Prefer not to say" },
    ],
  },
  {
    id: "commitment",
    number: "08",
    label: "How much time can you commit to applications right now?",
    hint: "This filters by effort level — no point showing you 40-page applications if you're slammed.",
    type: "options",
    options: [
      { value: "low", icon: "⚡", label: "Low", sub: "Quick wins, 30 min or less" },
      { value: "medium", icon: "⏱️", label: "Medium", sub: "A few hours per application" },
      { value: "high", icon: "🏔️", label: "High", sub: "Full effort, major opportunities" },
    ],
    multiple: false,
  },
];

export default function Intake({ onSubmit, error }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});

  const q = QUESTIONS[current];
  const value = answers[q.id];

  const isValid = () => {
    if (q.optional) return true;
    
    if (q.multiple) {
      return Array.isArray(value) && value.length > 0;
    }
    
    if (q.type === "text" || q.type === "textarea") {
      return value && String(value).trim().length > 0;
    }
    
    if (q.type === "options") {
      return value !== undefined && value !== null && value !== "";
    }
    
    return false;
  };

  const handleOption = (optValue) => {
    if (q.multiple) {
      const current_vals = Array.isArray(value) ? value : [];
      const maxSel = q.maxSelect || 99;
      if (current_vals.includes(optValue)) {
        setAnswers(p => ({ ...p, [q.id]: current_vals.filter(v => v !== optValue) }));
      } else if (current_vals.length < maxSel) {
        setAnswers(p => ({ ...p, [q.id]: [...current_vals, optValue] }));
      }
    } else {
      setAnswers(p => ({ ...p, [q.id]: optValue }));
    }
  };

  const next = () => {
    if (!isValid()) {
      console.log("Not valid, staying on this question");
      return;
    }
    if (current < QUESTIONS.length - 1) {
      setCurrent(c => c + 1);
    } else {
      onSubmit(answers);
    }
  };

  const back = () => setCurrent(c => c - 1);

  const isSelected = (optValue) => {
    if (q.multiple) return Array.isArray(value) && value.includes(optValue);
    return value === optValue;
  };

  return (
    <div className="intake">
      {/* Left panel */}
      <div className="intake-left">
        <div className="brand">
          <div className="brand-name">Pathfinder</div>
          <div className="brand-tagline">The Opportunity Engine</div>
        </div>

        <div className="intake-hero">
          <h1>Your next <em>100</em> doors are already open.</h1>
          <p>Answer 8 questions. Get a curated list of real opportunities — fellowships, jobs, grants, communities — matched to who you actually are.</p>
        </div>

        <div className="intake-stat">
          <div className="stat-item">
            <span>100</span>
            <span>Opportunities</span>
          </div>
          <div className="stat-item">
            <span>8</span>
            <span>Questions</span>
          </div>
          <div className="stat-item">
            <span>~3</span>
            <span>Minutes</span>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="intake-right">
        {/* Progress */}
        <div className="intake-progress">
          {QUESTIONS.map((_, i) => (
            <div key={i} className={`progress-dot ${i === current ? "active" : i < current ? "done" : ""}`} />
          ))}
        </div>

        {error && (
          <div className="error-banner">⚠️ {error} — please try again.</div>
        )}

        <div className="question-block" key={q.id}>
          <div className="question-number">Q{q.number}</div>
          <div className="question-label">{q.label}</div>
          <div className="question-hint">{q.hint}</div>

          {/* Text input */}
          {q.type === "text" && (
            <input
              type="text"
              className="text-input"
              placeholder={q.placeholder}
              value={value || ""}
              onChange={e => setAnswers(p => ({ ...p, [q.id]: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && isValid() && next()}
              autoFocus
              spellCheck="false"
            />
          )}

          {/* Textarea */}
          {q.type === "textarea" && (
            <textarea
              className="text-input"
              rows={4}
              placeholder={q.placeholder}
              value={value || ""}
              onChange={e => setAnswers(p => ({ ...p, [q.id]: e.target.value }))}
              spellCheck="false"
              autoFocus
            />
          )}

          {/* Options */}
          {q.type === "options" && (
            <div className={`options-grid ${q.options.length <= 3 ? "triple" : q.options.length <= 6 ? "" : ""}`}>
              {q.options.map(opt => (
                <button
                  key={opt.value}
                  className={`option-btn ${isSelected(opt.value) ? "selected" : ""}`}
                  onClick={() => handleOption(opt.value)}
                >
                  {opt.icon && <span className="opt-icon">{opt.icon}</span>}
                  <span className="opt-label">{opt.label}</span>
                  {opt.sub && <span className="opt-sub">{opt.sub}</span>}
                </button>
              ))}
            </div>
          )}

          {q.multiple && q.maxSelect && (
            <div style={{ marginTop: 10, fontSize: 12, color: "var(--muted)" }}>
              {Array.isArray(value) ? value.length : 0}/{q.maxSelect} selected
            </div>
          )}
        </div>

        {/* Nav */}
        <div className="nav-row">
          {current > 0 ? (
            <button type="button" className="btn-back" onClick={back}>← Back</button>
          ) : <div />}

          <button
            type="button"
            className={`btn-next ${current === QUESTIONS.length - 1 ? "gold" : ""} ${!isValid() ? "inactive" : ""}`}
            onClick={next}
          >
            {current === QUESTIONS.length - 1 ? "Generate My 100 →" : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
}
