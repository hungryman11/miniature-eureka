import { useState } from "react";

const TYPE_STYLES = {
  fellowship: "type-fellowship",
  job: "type-job",
  scholarship: "type-scholarship",
  grant: "type-grant",
  community: "type-community",
  conference: "type-conference",
  award: "type-award",
  competition: "type-competition",
  writing: "type-writing",
};

const ALL_TYPES = ["All", "Fellowship", "Job", "Scholarship", "Grant", "Community", "Conference", "Award", "Competition", "Writing"];

export default function Results({ opportunities, userData, onReset }) {
  const [filter, setFilter] = useState("All");
  const [automateModal, setAutomateModal] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [copied, setCopied] = useState(false);

  const filtered = filter === "All"
    ? opportunities
    : opportunities.filter(o => o.type?.toLowerCase() === filter.toLowerCase());

  const handleCopyWebhook = (payload) => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const webhookPayload = {
    user: {
      name: userData?.name,
      email: "{{user_email}}",
      field: userData?.field,
      dream: userData?.dream,
      drives: userData?.drives,
      stage: userData?.stage,
      goal: userData?.goal,
    },
    opportunity: selectedOpp ? {
      name: selectedOpp.name,
      type: selectedOpp.type,
      organization: selectedOpp.organization,
      url: selectedOpp.url,
      why_you: selectedOpp.why_you,
      deadline: selectedOpp.deadline,
    } : { name: "{{opportunity_name}}", type: "{{type}}", url: "{{url}}" },
    instruction: "Generate a personalized, compelling application email for this opportunity based on the user's profile. Under 300 words. Professional but human.",
  };

  return (
    <div className="results">
      {/* Header */}
      <div className="results-header">
        <div className="results-header-inner">
          <div className="results-greeting">✦ Your Opportunity Map</div>
          <h1 className="results-title">
            {userData?.name?.split(" ")[0]}, here are your <em>{opportunities.length}</em> doors.
          </h1>
          <p className="results-subtitle">
            Curated from your dream, your drive, and where you are right now. Every single one is a real shot.
          </p>
          <div className="results-meta">
            <span className="meta-tag">🎯 {userData?.field}</span>
            <span className="meta-tag">⚡ {userData?.drives}</span>
            <span className="meta-tag">🚀 {userData?.stage?.replace("_", " ")}</span>
            <span className="meta-tag">💡 {userData?.goal}</span>
          </div>
          <div className="results-actions">
            <button className="action-btn primary" onClick={() => setAutomateModal(true)}>
              ⚡ Automate All Emails
            </button>
            <button className="action-btn ghost" onClick={() => {
              const text = opportunities.map((o, i) =>
                `${i + 1}. ${o.name} (${o.type}) — ${o.organization}\n   ${o.why_you}\n   Deadline: ${o.deadline} | ${o.url}`
              ).join("\n\n");
              navigator.clipboard.writeText(text);
            }}>
              📋 Copy All
            </button>
            <button className="action-btn ghost" onClick={onReset}>
              ↩ Start Over
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="results-body">
        {/* Filters */}
        <div className="filter-row">
          <span className="filter-label">Filter:</span>
          {ALL_TYPES.map(t => (
            <button key={t} className={`filter-btn ${filter === t ? "active" : ""}`}
              onClick={() => setFilter(t)}>
              {t} {t !== "All" && `(${opportunities.filter(o => o.type?.toLowerCase() === t.toLowerCase()).length})`}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="opps-grid">
          {filtered.map((opp, i) => (
            <OppCard
              key={i}
              opp={opp}
              index={i}
              onAutomate={() => { setSelectedOpp(opp); setAutomateModal(true); }}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)" }}>
            No opportunities in this category.
          </div>
        )}
      </div>

      {/* Automate Modal */}
      {automateModal && (
        <AutomateModal
          userData={userData}
          selectedOpp={selectedOpp}
          opportunities={opportunities}
          webhookPayload={webhookPayload}
          onClose={() => { setAutomateModal(false); setSelectedOpp(null); }}
          copied={copied}
          onCopy={handleCopyWebhook}
        />
      )}
    </div>
  );
}

function OppCard({ opp, index, onAutomate }) {
  const typeClass = TYPE_STYLES[opp.type?.toLowerCase()] || "type-default";

  return (
    <div className="opp-card" style={{ animationDelay: `${Math.min(index * 0.04, 0.8)}s` }}>
      <div className="opp-card-top">
        <span className={`opp-type ${typeClass}`}>{opp.type}</span>
        <span className="opp-effort">
          {opp.effort === "Low" ? "⚡" : opp.effort === "Medium" ? "⏱️" : "🏔️"} {opp.effort}
        </span>
      </div>

      <div className="opp-name">{opp.name}</div>
      <div className="opp-org">{opp.organization}</div>

      <div className="opp-why">{opp.why_you}</div>

      <div className="opp-footer">
        <span className="opp-deadline">📅 {opp.deadline}</span>
        <span className="opp-match">{opp.match}% match</span>
      </div>

      {opp.url && opp.url !== "#" && (
        <a href={opp.url} target="_blank" rel="noopener noreferrer"
          style={{ display: "block", marginTop: 10, fontSize: 11, color: "var(--gold)", textDecoration: "none", fontFamily: "Space Mono, monospace" }}>
          → {opp.url.replace("https://", "").replace("www.", "").split("/")[0]}
        </a>
      )}

      <button className="opp-automate-btn" onClick={onAutomate}>
        ⚡ Generate Email for This
      </button>
    </div>
  );
}

function AutomateModal({ userData, selectedOpp, opportunities, webhookPayload, onClose, copied, onCopy }) {
  const [platform, setPlatform] = useState("n8n");

  const n8nSteps = [
    "Go to n8n.cloud or your self-hosted n8n → Create a workflow",
    'Add a Webhook trigger → Copy the webhook URL',
    'Add an HTTP Request node → POST to your Gemini/email endpoint with the payload below',
    'Add a Gmail node → Send Email using the AI response',
    'Add a Delay node to wait 2 seconds between emails if sending in bulk',
    "Activate the workflow",
  ];

  const makeSteps = [
    "Go to make.com → Create Scenario",
    'Add module: "Webhooks" → Custom Webhook → Copy URL',
    'Add module: "HTTP" → Make a Request → POST to Gemini or your email endpoint with payload',
    'Add module: "Gmail" → Send an Email using the AI response',
    'Use Make\'s "Iterator" to loop through all 100 if sending in bulk',
    "Activate the scenario",
  ];

  const steps = platform === "n8n" ? n8nSteps : makeSteps;

  const emailPrompt = `You are an expert application writer. Write a personalized, compelling application email for the following opportunity.

USER PROFILE:
- Name: ${userData?.name}
- Field: ${userData?.field}
- Dream: ${userData?.dream}
- Core drive: ${userData?.drives}
- Stage: ${userData?.stage}
- Goal: ${userData?.goal}

OPPORTUNITY:
- Name: ${selectedOpp?.name || "{{opportunity_name}}"}
- Type: ${selectedOpp?.type || "{{type}}"}
- Organization: ${selectedOpp?.organization || "{{organization}}"}
- Why this fits them: ${selectedOpp?.why_you || "{{why_you}}"}
- Deadline: ${selectedOpp?.deadline || "{{deadline}}"}

Write a genuine, specific email under 300 words. Professional but human. End with a clear next step.`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="modal-title">
          {selectedOpp ? `Automate: ${selectedOpp.name}` : `Automate All ${opportunities.length} Emails`}
        </div>
        <div className="modal-sub">
          Connect to n8n or Make.com to send emails automatically from your own inbox.
        </div>

        {/* Platform tabs */}
        <div className="platform-tabs">
          <button className={`platform-tab ${platform === "n8n" ? "active" : ""}`} onClick={() => setPlatform("n8n")}>
            n8n
          </button>
          <button className={`platform-tab ${platform === "make" ? "active" : ""}`} onClick={() => setPlatform("make")}>
            Make.com
          </button>
        </div>

        {/* Steps */}
        <div className="modal-section">
          <label>Setup Steps</label>
          <ul className="step-list">
            {steps.map((s, i) => (
              <li key={i}>
                <span className="step-num">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Email Prompt */}
        <div className="modal-section">
          <label>Email Prompt to Use</label>
          <div className="webhook-box">{emailPrompt}</div>
          <button className="copy-btn" onClick={() => navigator.clipboard.writeText(emailPrompt)}>
            Copy Prompt
          </button>
        </div>

        {/* Webhook Payload */}
        <div className="modal-section">
          <label>Webhook Payload Structure</label>
          <div className="webhook-box">
            {JSON.stringify(webhookPayload, null, 2)}
          </div>
          <button className="copy-btn" onClick={() => onCopy(webhookPayload)}>
            {copied ? "✓ Copied!" : "Copy Payload"}
          </button>
        </div>

        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 16, lineHeight: 1.6 }}>
          💡 <strong>Tip:</strong> Add a 2-second delay between emails in {platform === "n8n" ? "n8n's Delay node" : "Make's sleep module"} to avoid spam filters. Emails send from your own Gmail — maximum deliverability.
        </div>
      </div>
    </div>
  );
}
