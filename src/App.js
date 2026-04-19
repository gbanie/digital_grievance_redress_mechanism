import { useState, useRef, useEffect } from "react";

// ============================================================
// REFERENCE DATA
// ============================================================

const mines = [
  {
    id: "koidu",
    name: "Koidu Limited",
    type: "LSM",
    region: "Kono",
    commodity: "Diamond",
  },
  {
    id: "sierra-rutile",
    name: "Sierra Rutile",
    type: "LSM",
    region: "Moyamba",
    commodity: "Rutile",
  },
  {
    id: "marampa",
    name: "Marampa Mines",
    type: "LSM",
    region: "Port Loko",
    commodity: "Iron ore",
  },
  {
    id: "sl-mining",
    name: "SL Mining",
    type: "LSM",
    region: "Tonkolili",
    commodity: "Iron ore",
  },
  {
    id: "asm-kono",
    name: "ASM Cooperative - Kono",
    type: "ASM",
    region: "Kono",
    commodity: "Diamond",
  },
  {
    id: "asm-kenema",
    name: "ASM Cooperative - Kenema",
    type: "ASM",
    region: "Kenema",
    commodity: "Diamond",
  },
  {
    id: "unknown",
    name: "Unknown/Not listed",
    type: "Other",
    region: "—",
    commodity: "—",
  },
];

const officers = [
  { id: "auto", name: "Auto-assign", region: "—" },
  { id: "off-kono", name: "Inspector - Kono", region: "Kono" },
  { id: "off-moyamba", name: "Inspector - Southern", region: "Moyamba" },
  { id: "off-portloko", name: "Inspector - Port Loko", region: "Port Loko" },
  { id: "off-tonkolili", name: "Inspector - Tonkolili", region: "Tonkolili" },
  { id: "off-kenema", name: "Inspector - Eastern", region: "Kenema" },
];

// Icons as SVG path data — reusable across the app
const categoryIcons = {
  land: (
    <>
      <path d="M12 2v6M8 6l4-4 4 4" />
      <path d="M3 10h18" />
      <path d="M5 10v10a2 2 0 002 2h10a2 2 0 002-2V10" />
      <path d="M9 14h6M9 18h6" />
    </>
  ),
  water: <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />,
  air: (
    <>
      <path d="M3 8c1.5-2 4-2 6 0s4.5 2 6 0 4-2 6 0" />
      <path d="M3 14c1.5-2 4-2 6 0s4.5 2 6 0 4-2 6 0" />
      <path d="M3 20c1.5-2 4-2 6 0s4.5 2 6 0 4-2 6 0" />
    </>
  ),
  health: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  jobs: (
    <>
      <path d="M20 7h-9M14 17H5" />
      <path d="M17 3l3 4-3 4M7 13l-3 4 3 4" />
    </>
  ),
  housing: (
    <>
      <path d="M3 21h18" />
      <path d="M5 21V10l7-5 7 5v11" />
      <path d="M9 21v-6h6v6" />
    </>
  ),
  sacred: <path d="M12 2l2 6h6l-5 4 2 7-5-4-5 4 2-7-5-4h6z" />,
  blast: <path d="M12 2L9 9 2 10l5 5-1 7 6-3 6 3-1-7 5-5-7-1z" />,
  other: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </>
  ),
};

const categories = [
  { key: "land", label: "Land & Crops", color: "#d97706", bg: "#fef3c7" },
  { key: "water", label: "Water Pollution", color: "#0ea5e9", bg: "#e0f2fe" },
  { key: "air", label: "Air & Dust", color: "#78716c", bg: "#f5f5f4" },
  { key: "health", label: "Health & Safety", color: "#dc2626", bg: "#fee2e2" },
  { key: "jobs", label: "Jobs & Wages", color: "#059669", bg: "#d1fae5" },
  {
    key: "housing",
    label: "Housing & resettle",
    color: "#7c3aed",
    bg: "#ede9fe",
  },
  { key: "sacred", label: "Sacred sites", color: "#db2777", bg: "#fce7f3" },
  { key: "blast", label: "Blasting & noise", color: "#ea580c", bg: "#ffedd5" },
  { key: "other", label: "Other", color: "#64748b", bg: "#f1f5f9" },
];

const sensitiveCategories = [
  { key: "gbv", label: "Sexual harassment / GBV" },
  { key: "child", label: "Child labor" },
  { key: "retaliation", label: "Threats / retaliation" },
  { key: "corruption", label: "Corruption / bribery" },
];

const workflow = [
  "Received",
  "Acknowledged",
  "Under investigation",
  "Awaiting mine response",
  "Resolved",
  "Rejected",
];

const seedCases = [
  {
    id: "GRM-0001",
    mine: "marampa",
    category: "water",
    desc: "Stream turned brown since last month. Cattle won't drink.",
    name: "Aminata K.",
    contact: "+232 76 111 111",
    date: "05/04/2026",
    timestamp: "2026-04-05T10:00:00Z",
    status: "Awaiting mine response",
    anonymous: false,
    sensitivePath: false,
    gps: { lat: "8.68432", lng: "-12.54971" },
    location: "Lunsar, Section 3",
    officer: "off-portloko",
    notes: "Site visit done 08/04. Water sample taken.",
    photo: null,
  },
  {
    id: "GRM-0002",
    mine: "koidu",
    category: "blast",
    desc: "Blasting caused cracks in my house wall.",
    name: "Mohamed S.",
    contact: "+232 77 222 222",
    date: "28/03/2026",
    timestamp: "2026-03-28T10:00:00Z",
    status: "Resolved",
    anonymous: false,
    sensitivePath: false,
    gps: null,
    location: "Koidu town",
    officer: "off-kono",
    notes: "Compensation paid. Closed.",
    photo: null,
  },
  {
    id: "SEN-0001",
    mine: "sierra-rutile",
    sensitiveCategory: "gbv",
    desc: "[confidential]",
    name: "[confidential]",
    contact: "[confidential]",
    date: "10/04/2026",
    timestamp: "2026-04-10T10:00:00Z",
    status: "Under investigation",
    anonymous: true,
    sensitivePath: true,
    gps: null,
    location: "[confidential]",
    officer: "off-moyamba",
    notes: "",
    photo: null,
  },
  {
    id: "GRM-0003",
    mine: "sl-mining",
    category: "jobs",
    desc: "Promised local jobs not given to community members.",
    name: "Foday B.",
    contact: "+232 78 333 333",
    date: "15/04/2026",
    timestamp: "2026-04-15T10:00:00Z",
    status: "Acknowledged",
    anonymous: false,
    sensitivePath: false,
    gps: null,
    location: "Tonkolili",
    officer: "off-tonkolili",
    notes: "",
    photo: null,
  },
];

// ============================================================
// HELPERS
// ============================================================

const daysSince = (iso) =>
  Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
const getMine = (id) =>
  mines.find((m) => m.id === id) || { name: "—", region: "—" };
const getOfficer = (id) => officers.find((o) => o.id === id) || { name: "—" };
const getCategory = (c) =>
  c.sensitivePath
    ? sensitiveCategories.find((s) => s.key === c.sensitiveCategory) || {
        label: "—",
      }
    : categories.find((x) => x.key === c.category) || { label: "—" };

// Reusable icon component
const CategoryIcon = ({ catKey, size = 32, color = "#475569" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {categoryIcons[catKey] || categoryIcons.other}
  </svg>
);

// ============================================================
// MAIN APP
// ============================================================

export default function App() {
  const [cases, setCases] = useState(seedCases);
  const [view, setView] = useState("submit");
  const [stage, setStage] = useState("form"); // form | review | done
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [selectedCase, setSelectedCase] = useState(null);
  const [filters, setFilters] = useState({
    mine: "",
    category: "",
    status: "",
    type: "",
    search: "",
  });

  const [form, setForm] = useState({
    name: "",
    contact: "",
    mine: "",
    category: "",
    sensitiveCategory: "",
    desc: "",
    location: "",
    gps: null,
    photo: null,
    officer: "auto",
    anonymous: false,
    sensitivePath: false,
  });
  const [trackId, setTrackId] = useState("");
  const [found, setFound] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [gpsStatus, setGpsStatus] = useState("");
  const [focusSection, setFocusSection] = useState(null);

  // Refs for jumping to sections when edit is clicked
  const refs = {
    mine: useRef(null),
    category: useRef(null),
    desc: useRef(null),
    location: useRef(null),
    photo: useRef(null),
    contact: useRef(null),
  };

  // Scroll to focused section after going back to edit
  useEffect(() => {
    if (stage === "form" && focusSection && refs[focusSection]?.current) {
      setTimeout(() => {
        refs[focusSection].current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        setFocusSection(null);
      }, 100);
    }
  }, [stage, focusSection]);

  // --- Logic ---
  const validateForm = () => {
    if (!form.mine) return "Please select which mine";
    if (form.sensitivePath && !form.sensitiveCategory)
      return "Please select the sensitive issue type";
    if (!form.sensitivePath && !form.category)
      return "Please select a category";
    if (!form.desc) return "Please describe what happened";
    if (!form.anonymous && !form.name)
      return "Please enter your name or tick confidential";
    return null;
  };

  const goToReview = () => {
    const err = validateForm();
    if (err) {
      alert(err);
      return;
    }
    setStage("review");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBackToEdit = (section) => {
    setStage("form");
    if (section) setFocusSection(section);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmSubmit = () => {
    const id =
      (form.sensitivePath ? "SEN-" : "GRM-") +
      String(cases.length + 1).padStart(4, "0");
    const newCase = {
      ...form,
      id,
      status: "Received",
      date: new Date().toLocaleDateString(),
      timestamp: new Date().toISOString(),
      notes: "",
    };
    setCases([...cases, newCase]);
    setConfirmation({ id, sensitive: form.sensitivePath });
    setForm({
      name: "",
      contact: "",
      mine: "",
      category: "",
      sensitiveCategory: "",
      desc: "",
      location: "",
      gps: null,
      photo: null,
      officer: "auto",
      anonymous: false,
      sensitivePath: false,
    });
    setGpsStatus("");
    setStage("done");
  };

  const handleTrack = () => {
    const match = cases.find((x) => x.id === trackId.toUpperCase().trim());
    setFound(match || "notfound");
  };

  const captureGps = () => {
    if (!navigator.geolocation) {
      setGpsStatus("GPS not supported");
      return;
    }
    setGpsStatus("Getting location...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm({
          ...form,
          gps: {
            lat: pos.coords.latitude.toFixed(5),
            lng: pos.coords.longitude.toFixed(5),
          },
        });
        setGpsStatus("Location captured ✓");
      },
      () => setGpsStatus("Could not get location"),
      { timeout: 10000 }
    );
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setForm({ ...form, photo: { name: file.name, data: reader.result } });
    reader.readAsDataURL(file);
  };

  const updateCaseStatus = (id, newStatus) => {
    setCases(cases.map((x) => (x.id === id ? { ...x, status: newStatus } : x)));
    if (selectedCase && selectedCase.id === id)
      setSelectedCase({ ...selectedCase, status: newStatus });
  };
  const updateCaseNotes = (id, newNotes) => {
    setCases(cases.map((x) => (x.id === id ? { ...x, notes: newNotes } : x)));
    if (selectedCase && selectedCase.id === id)
      setSelectedCase({ ...selectedCase, notes: newNotes });
  };
  const assignOfficer = (id, officerId) => {
    setCases(
      cases.map((x) => (x.id === id ? { ...x, officer: officerId } : x))
    );
    if (selectedCase && selectedCase.id === id)
      setSelectedCase({ ...selectedCase, officer: officerId });
  };

  const filteredCases = cases.filter((x) => {
    if (filters.mine && x.mine !== filters.mine) return false;
    if (filters.category) {
      if (x.sensitivePath && x.sensitiveCategory !== filters.category)
        return false;
      if (!x.sensitivePath && x.category !== filters.category) return false;
    }
    if (filters.status && x.status !== filters.status) return false;
    if (filters.type === "sensitive" && !x.sensitivePath) return false;
    if (filters.type === "regular" && x.sensitivePath) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const match =
        x.id.toLowerCase().includes(q) ||
        (x.name && x.name.toLowerCase().includes(q)) ||
        (x.desc && x.desc.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  // --- Styles ---
  const c = {
    primary: "#047857",
    primaryDark: "#064e3b",
    bg: "#f8fafc",
    card: "#ffffff",
    border: "#e2e8f0",
    text: "#0f172a",
    muted: "#64748b",
    success: "#059669",
    successBg: "#d1fae5",
    info: "#1e40af",
    infoBg: "#dbeafe",
    danger: "#dc2626",
    dangerBg: "#fee2e2",
    warn: "#b45309",
    warnBg: "#fef3c7",
  };
  const page = {
    minHeight: "100vh",
    background: c.bg,
    fontFamily: "system-ui, sans-serif",
    color: c.text,
  };
  const container = { maxWidth: 960, margin: "0 auto", padding: "0 16px" };
  const card = {
    background: c.card,
    border: `1px solid ${c.border}`,
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    marginBottom: 16,
  };
  const label = {
    display: "block",
    fontSize: 14,
    fontWeight: 600,
    color: c.text,
    marginBottom: 8,
    marginTop: 4,
  };
  const hint = {
    fontSize: 12,
    color: c.muted,
    marginTop: -4,
    marginBottom: 10,
  };
  const input = {
    width: "100%",
    padding: "12px 14px",
    border: `1px solid ${c.border}`,
    borderRadius: 10,
    fontSize: 15,
    marginBottom: 14,
    boxSizing: "border-box",
    fontFamily: "inherit",
    background: "white",
  };
  const smallInput = {
    padding: "8px 10px",
    border: `1px solid ${c.border}`,
    borderRadius: 8,
    fontSize: 13,
    boxSizing: "border-box",
    fontFamily: "inherit",
    background: "white",
  };
  const btn = {
    background: c.primary,
    color: "white",
    border: "none",
    padding: "14px 20px",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    width: "100%",
  };
  const btnSec = {
    background: "white",
    color: c.text,
    border: `1px solid ${c.border}`,
    padding: "8px 14px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  };
  const tabStyle = (active) => ({
    flex: 1,
    padding: "12px 8px",
    background: active ? c.primary : "transparent",
    color: active ? "white" : c.muted,
    border: "none",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  });

  const statusBadge = (status) => {
    const map = {
      Received: { bg: c.infoBg, color: c.info },
      Acknowledged: { bg: c.infoBg, color: c.info },
      "Under investigation": { bg: c.warnBg, color: c.warn },
      "Awaiting mine response": { bg: c.warnBg, color: c.warn },
      Resolved: { bg: c.successBg, color: c.success },
      Rejected: { bg: c.dangerBg, color: c.danger },
    };
    const s = map[status] || { bg: c.bg, color: c.text };
    return {
      padding: "4px 10px",
      borderRadius: 6,
      fontSize: 11,
      fontWeight: 700,
      background: s.bg,
      color: s.color,
      whiteSpace: "nowrap",
    };
  };

  // Small edit button for review page
  const editBtn = (section) => (
    <button
      onClick={() => goBackToEdit(section)}
      style={{
        background: "white",
        border: `1px solid ${c.border}`,
        color: c.primary,
        padding: "6px 12px",
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      Edit
    </button>
  );

  const reviewBox = {
    background: c.bg,
    border: `1px solid ${c.border}`,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  };
  const reviewLabel = {
    fontSize: 11,
    color: c.muted,
    fontWeight: 700,
    marginBottom: 4,
    letterSpacing: 0.5,
  };

  return (
    <div style={page}>
      {/* HEADER */}
      <div style={{ background: c.primary, color: "white", padding: "22px 0" }}>
        <div style={container}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 48,
                height: 48,
                background: "white",
                color: c.primary,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              ⛏
            </div>
            <div>
              <div style={{ fontSize: 19, fontWeight: 700 }}>
                Mining Community Grievance System
              </div>
              <div style={{ fontSize: 13, opacity: 0.9 }}>
                A regulator channel for complaints against mining operations
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={container}>
        {/* TABS */}
        <div
          style={{
            display: "flex",
            gap: 4,
            background: c.card,
            padding: 6,
            borderRadius: 10,
            border: `1px solid ${c.border}`,
            marginTop: 20,
            marginBottom: 20,
          }}
        >
          <button
            style={tabStyle(view === "submit")}
            onClick={() => {
              setView("submit");
              setStage("form");
              setConfirmation(null);
            }}
          >
            File complaint
          </button>
          <button
            style={tabStyle(view === "track")}
            onClick={() => setView("track")}
          >
            Track status
          </button>
          <button
            style={tabStyle(view === "admin")}
            onClick={() => {
              setView("admin");
              setSelectedCase(null);
            }}
          >
            Regulator view
          </button>
        </div>

        {/* ================= SUBMIT FLOW ================= */}

        {/* STAGE 1: FORM */}
        {view === "submit" && stage === "form" && (
          <>
            <div style={{ ...card, borderLeft: `4px solid ${c.danger}` }}>
              <div
                style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
              >
                <span style={{ fontSize: 24 }}>⚠️</span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}
                  >
                    Is this a sensitive matter?
                  </div>
                  <div
                    style={{ fontSize: 13, color: c.muted, marginBottom: 12 }}
                  >
                    Harassment, abuse, child labor, corruption, or threats —
                    handled confidentially, never shared with the mining
                    company.
                  </div>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={form.sensitivePath}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          sensitivePath: e.target.checked,
                          category: "",
                          sensitiveCategory: "",
                        })
                      }
                      style={{ width: 18, height: 18 }}
                    />
                    <span style={{ fontSize: 14, fontWeight: 600 }}>
                      Yes, use confidential pathway
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div style={card}>
              {/* 1. Mine */}
              <div ref={refs.mine}>
                <label style={label}>1. Which mine is this about? *</label>
                <select
                  style={input}
                  value={form.mine}
                  onChange={(e) => setForm({ ...form, mine: e.target.value })}
                >
                  <option value="">Select a mine</option>
                  {mines.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} — {m.region}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Category — with icons */}
              <div ref={refs.category}>
                {form.sensitivePath ? (
                  <>
                    <label style={label}>2. Type of sensitive issue *</label>
                    <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
                      {sensitiveCategories.map((sc) => (
                        <label
                          key={sc.key}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: 12,
                            background:
                              form.sensitiveCategory === sc.key
                                ? c.dangerBg
                                : "white",
                            border: `2px solid ${
                              form.sensitiveCategory === sc.key
                                ? c.danger
                                : c.border
                            }`,
                            borderRadius: 10,
                            cursor: "pointer",
                          }}
                        >
                          <input
                            type="radio"
                            checked={form.sensitiveCategory === sc.key}
                            onChange={() =>
                              setForm({ ...form, sensitiveCategory: sc.key })
                            }
                          />
                          <span style={{ fontSize: 14, fontWeight: 600 }}>
                            {sc.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <label style={label}>
                      2. What is the complaint about? *
                    </label>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: 8,
                        marginBottom: 16,
                      }}
                    >
                      {categories.map((cat) => {
                        const sel = form.category === cat.key;
                        return (
                          <button
                            key={cat.key}
                            type="button"
                            onClick={() =>
                              setForm({ ...form, category: cat.key })
                            }
                            style={{
                              background: sel ? cat.bg : "#fafafa",
                              border: sel
                                ? `3px solid ${cat.color}`
                                : `2px solid ${c.border}`,
                              borderRadius: 10,
                              padding: "14px 6px",
                              cursor: "pointer",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <CategoryIcon
                              catKey={cat.key}
                              size={32}
                              color={sel ? cat.color : "#475569"}
                            />
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: sel ? 700 : 600,
                                color: sel ? cat.color : c.text,
                                textAlign: "center",
                              }}
                            >
                              {cat.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* 3. Description */}
              <div ref={refs.desc}>
                <label style={label}>3. Describe what happened *</label>
                <div style={hint}>
                  Include dates, who was involved, and what you've seen.
                </div>
                <textarea
                  style={{ ...input, height: 110, resize: "vertical" }}
                  placeholder="Example: Blasting caused cracks in my wall..."
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                />
              </div>

              {/* 4. Location */}
              <div ref={refs.location}>
                <label style={label}>4. Where is the problem? (optional)</label>
                <input
                  style={input}
                  placeholder="e.g. Lunsar, near the river"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                />
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <button type="button" style={btnSec} onClick={captureGps}>
                    📍 Use my GPS
                  </button>
                  {form.gps && (
                    <span
                      style={{
                        fontSize: 12,
                        color: c.success,
                        fontWeight: 600,
                      }}
                    >
                      ✓ {form.gps.lat}, {form.gps.lng}
                    </span>
                  )}
                  {gpsStatus && !form.gps && (
                    <span style={{ fontSize: 12, color: c.muted }}>
                      {gpsStatus}
                    </span>
                  )}
                </div>
              </div>

              {/* 5. Photo */}
              <div ref={refs.photo}>
                <label style={label}>5. Upload a photo (optional)</label>
                <div style={{ marginBottom: 16 }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhoto}
                    style={{ fontSize: 13, marginBottom: 8 }}
                  />
                  {form.photo && (
                    <div style={{ marginTop: 8 }}>
                      <img
                        src={form.photo.data}
                        alt="preview"
                        style={{
                          maxWidth: 200,
                          borderRadius: 8,
                          border: `1px solid ${c.border}`,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Confidentiality */}
              <div
                style={{
                  background: c.warnBg,
                  border: `1px solid ${c.warn}`,
                  borderRadius: 10,
                  padding: 14,
                  marginBottom: 16,
                }}
              >
                <label
                  style={{
                    display: "flex",
                    gap: 10,
                    cursor: "pointer",
                    alignItems: "flex-start",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={form.anonymous}
                    onChange={(e) =>
                      setForm({ ...form, anonymous: e.target.checked })
                    }
                    style={{ width: 18, height: 18, marginTop: 2 }}
                  />
                  <div>
                    <div
                      style={{ fontSize: 14, fontWeight: 600, color: c.warn }}
                    >
                      Submit confidentially
                    </div>
                    <div style={{ fontSize: 12, color: c.warn, marginTop: 2 }}>
                      Your name is hidden from the mine; regulator still knows
                      for follow-up.
                    </div>
                  </div>
                </label>
              </div>

              {/* 6, 7, 8. Contact */}
              <div ref={refs.contact}>
                {!form.anonymous && (
                  <>
                    <label style={label}>6. Your name *</label>
                    <input
                      style={input}
                      placeholder="e.g. Aminata Kamara"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </>
                )}
                <label style={label}>
                  {form.anonymous ? "6" : "7"}. Phone number
                </label>
                <input
                  style={input}
                  placeholder="e.g. +232 76 123 456"
                  value={form.contact}
                  onChange={(e) =>
                    setForm({ ...form, contact: e.target.value })
                  }
                />

                <label style={label}>
                  {form.anonymous ? "7" : "8"}. Which officer should handle
                  this?
                </label>
                <select
                  style={input}
                  value={form.officer}
                  onChange={(e) =>
                    setForm({ ...form, officer: e.target.value })
                  }
                >
                  {officers.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>

              <button style={btn} onClick={goToReview}>
                Review my complaint →
              </button>
            </div>
          </>
        )}

        {/* STAGE 2: REVIEW */}
        {view === "submit" && stage === "review" && (
          <div style={card}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  background: c.warnBg,
                  color: c.warn,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                ✓
              </div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>
                Review your complaint
              </h2>
            </div>
            <p style={{ color: c.muted, fontSize: 14, margin: "0 0 20px" }}>
              Please check everything carefully. You can edit any section before
              submitting.
            </p>

            {/* Mine */}
            <div style={reviewBox}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 10,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={reviewLabel}>MINE</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>
                    {getMine(form.mine).name}
                  </div>
                  <div style={{ fontSize: 12, color: c.muted }}>
                    {getMine(form.mine).region} · {getMine(form.mine).type}
                  </div>
                </div>
                {editBtn("mine")}
              </div>
            </div>

            {/* Category */}
            <div style={reviewBox}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 10,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={reviewLabel}>
                    {form.sensitivePath ? "SENSITIVE ISSUE" : "CATEGORY"}
                  </div>
                  {form.sensitivePath ? (
                    <div
                      style={{ fontSize: 14, fontWeight: 600, color: c.danger }}
                    >
                      {sensitiveCategories.find(
                        (s) => s.key === form.sensitiveCategory
                      )?.label || "—"}
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginTop: 4,
                      }}
                    >
                      <CategoryIcon
                        catKey={form.category}
                        size={24}
                        color={
                          categories.find((c) => c.key === form.category)
                            ?.color || "#475569"
                        }
                      />
                      <span style={{ fontSize: 14, fontWeight: 600 }}>
                        {categories.find((c) => c.key === form.category)
                          ?.label || "—"}
                      </span>
                    </div>
                  )}
                </div>
                {editBtn("category")}
              </div>
            </div>

            {/* Description */}
            <div style={reviewBox}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 10,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={reviewLabel}>DESCRIPTION</div>
                  <div style={{ fontSize: 13, lineHeight: 1.5 }}>
                    {form.desc}
                  </div>
                </div>
                {editBtn("desc")}
              </div>
            </div>

            {/* Location & evidence */}
            <div style={reviewBox}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 10,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={reviewLabel}>LOCATION & EVIDENCE</div>
                  <div style={{ fontSize: 13 }}>
                    {form.location || (
                      <span style={{ color: c.muted, fontStyle: "italic" }}>
                        No location specified
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: c.muted, marginTop: 3 }}>
                    {form.gps
                      ? `📍 GPS: ${form.gps.lat}, ${form.gps.lng}`
                      : "📍 No GPS"}
                    {" · "}
                    {form.photo ? "📷 1 photo attached" : "📷 No photo"}
                  </div>
                  {form.photo && (
                    <img
                      src={form.photo.data}
                      alt=""
                      style={{
                        maxWidth: 120,
                        maxHeight: 90,
                        borderRadius: 6,
                        marginTop: 8,
                        border: `1px solid ${c.border}`,
                      }}
                    />
                  )}
                </div>
                {editBtn("location")}
              </div>
            </div>

            {/* Contact */}
            <div style={reviewBox}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 10,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={reviewLabel}>CONTACT</div>
                  {form.anonymous ? (
                    <div
                      style={{ fontSize: 14, fontWeight: 600, color: c.warn }}
                    >
                      Submitting confidentially
                    </div>
                  ) : (
                    <div style={{ fontSize: 14, fontWeight: 600 }}>
                      {form.name}
                    </div>
                  )}
                  <div style={{ fontSize: 12, color: c.muted }}>
                    {form.contact || (
                      <span style={{ fontStyle: "italic" }}>
                        No phone given
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: c.muted, marginTop: 3 }}>
                    Officer: {getOfficer(form.officer).name}
                  </div>
                </div>
                {editBtn("contact")}
              </div>
            </div>

            <div
              style={{
                background: c.warnBg,
                border: `1px solid #fbbf24`,
                borderRadius: 10,
                padding: 12,
                marginBottom: 18,
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontSize: 16 }}>⚠️</span>
              <div style={{ fontSize: 12, color: c.warn, lineHeight: 1.5 }}>
                Once submitted, your complaint will be forwarded{" "}
                {form.sensitivePath
                  ? "to a designated confidential officer"
                  : "to the mining company within 2 working days"}
                . You cannot edit after submitting.
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                gap: 10,
              }}
            >
              <button
                style={{
                  background: "white",
                  border: `1px solid ${c.border}`,
                  color: c.text,
                  padding: 14,
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onClick={() => goBackToEdit(null)}
              >
                ← Back to edit
              </button>
              <button
                style={{
                  background: c.primary,
                  color: "white",
                  border: "none",
                  padding: 14,
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
                onClick={confirmSubmit}
              >
                Confirm & submit ✓
              </button>
            </div>
          </div>
        )}

        {/* STAGE 3: DONE */}
        {view === "submit" && stage === "done" && confirmation && (
          <div
            style={{
              ...card,
              background: confirmation.sensitive ? c.dangerBg : c.successBg,
              border: `1px solid ${
                confirmation.sensitive ? c.danger : c.success
              }`,
            }}
          >
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>
                {confirmation.sensitive ? "🔒" : "✓"}
              </div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 18,
                  color: confirmation.sensitive ? c.danger : c.success,
                  marginBottom: 8,
                }}
              >
                Complaint submitted successfully
              </div>
              <div style={{ fontSize: 14, marginBottom: 12 }}>
                Your reference ID is
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  marginBottom: 12,
                  color: confirmation.sensitive ? c.danger : c.success,
                }}
              >
                {confirmation.id}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: c.muted,
                  maxWidth: 400,
                  margin: "0 auto",
                }}
              >
                {confirmation.sensitive
                  ? "A designated officer will contact you discreetly within 48 hours. Your identity is protected."
                  : "The mining company has 14 days to respond. You'll be updated through the Track tab."}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "center",
                marginTop: 16,
              }}
            >
              <button
                style={{ ...btnSec }}
                onClick={() => {
                  setStage("form");
                  setConfirmation(null);
                }}
              >
                File another
              </button>
              <button
                style={{ ...btnSec }}
                onClick={() => {
                  setTrackId(confirmation.id);
                  setView("track");
                  setConfirmation(null);
                  setStage("form");
                }}
              >
                Track this complaint
              </button>
            </div>
          </div>
        )}

        {/* ============ TRACK VIEW ============ */}
        {view === "track" && (
          <div style={card}>
            <h2 style={{ margin: "0 0 4px", fontSize: 20 }}>
              Track your complaint
            </h2>
            <p
              style={{
                color: c.muted,
                fontSize: 14,
                marginTop: 0,
                marginBottom: 16,
              }}
            >
              Enter the reference ID you received.
            </p>
            <input
              style={input}
              placeholder="e.g. GRM-0001"
              value={trackId}
              onChange={(e) => setTrackId(e.target.value)}
            />
            <button style={btn} onClick={handleTrack}>
              Check status
            </button>

            {found === "notfound" && (
              <div
                style={{
                  marginTop: 16,
                  padding: 14,
                  background: c.dangerBg,
                  color: c.danger,
                  borderRadius: 10,
                  fontSize: 14,
                }}
              >
                No complaint found with that ID.
              </div>
            )}
            {found && found !== "notfound" && (
              <div
                style={{
                  marginTop: 20,
                  padding: 18,
                  background: c.bg,
                  borderRadius: 10,
                  border: `1px solid ${c.border}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 14,
                  }}
                >
                  <strong style={{ fontSize: 16 }}>{found.id}</strong>
                  <span style={statusBadge(found.status)}>{found.status}</span>
                </div>
                <div style={{ fontSize: 13, color: c.muted }}>Mine</div>
                <div style={{ marginBottom: 10 }}>
                  {getMine(found.mine).name}
                </div>
                <div style={{ fontSize: 13, color: c.muted }}>Category</div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 10,
                  }}
                >
                  {!found.sensitivePath && (
                    <CategoryIcon
                      catKey={found.category}
                      size={20}
                      color={
                        categories.find((x) => x.key === found.category)?.color
                      }
                    />
                  )}
                  <span>{getCategory(found).label}</span>
                </div>
                <div style={{ fontSize: 13, color: c.muted }}>Filed on</div>
                <div>
                  {found.date} ({daysSince(found.timestamp)} days ago)
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============ ADMIN LOGIN ============ */}
        {view === "admin" && !adminAuth && (
          <div style={card}>
            <h2 style={{ margin: "0 0 4px", fontSize: 20 }}>
              🔒 Regulator login
            </h2>
            <p
              style={{
                color: c.muted,
                fontSize: 14,
                marginTop: 0,
                marginBottom: 20,
              }}
            >
              Authorized personnel only.
            </p>
            <label style={label}>Password</label>
            <input
              type="password"
              style={input}
              placeholder="Demo password: regulator"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                adminPassword === "regulator" &&
                setAdminAuth(true)
              }
            />
            <button
              style={btn}
              onClick={() => {
                if (adminPassword === "regulator") setAdminAuth(true);
                else alert("Wrong password. Demo password is: regulator");
              }}
            >
              Log in
            </button>
          </div>
        )}

        {/* ============ ADMIN DASHBOARD ============ */}
        {view === "admin" && adminAuth && !selectedCase && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 10,
                marginBottom: 16,
              }}
            >
              {[
                { label: "TOTAL", value: cases.length, color: c.text },
                {
                  label: "OPEN",
                  value: cases.filter(
                    (x) => x.status !== "Resolved" && x.status !== "Rejected"
                  ).length,
                  color: c.info,
                },
                {
                  label: "OVERDUE",
                  value: cases.filter(
                    (x) =>
                      x.status !== "Resolved" &&
                      x.status !== "Rejected" &&
                      daysSince(x.timestamp) > 14
                  ).length,
                  color: c.danger,
                },
                {
                  label: "SENSITIVE",
                  value: cases.filter((x) => x.sensitivePath).length,
                  color: c.danger,
                },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    background: c.card,
                    border: `1px solid ${c.border}`,
                    borderRadius: 10,
                    padding: 12,
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{ fontSize: 10, color: c.muted, marginBottom: 4 }}
                  >
                    {s.label}
                  </div>
                  <div
                    style={{ fontSize: 22, fontWeight: 700, color: s.color }}
                  >
                    {s.value}
                  </div>
                </div>
              ))}
            </div>

            <div style={card}>
              <h3 style={{ margin: "0 0 12px", fontSize: 16 }}>
                Mine scorecard
              </h3>
              <div style={{ display: "grid", gap: 6 }}>
                {mines
                  .filter((m) => m.id !== "unknown")
                  .map((m) => {
                    const mineCases = cases.filter((x) => x.mine === m.id);
                    const open = mineCases.filter(
                      (x) => x.status !== "Resolved" && x.status !== "Rejected"
                    ).length;
                    const overdue = mineCases.filter(
                      (x) =>
                        x.status !== "Resolved" &&
                        x.status !== "Rejected" &&
                        daysSince(x.timestamp) > 14
                    ).length;
                    return (
                      <div
                        key={m.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "8px 12px",
                          background: c.bg,
                          borderRadius: 8,
                          fontSize: 13,
                        }}
                      >
                        <div>
                          <strong>{m.name}</strong>
                          <span
                            style={{
                              color: c.muted,
                              marginLeft: 8,
                              fontSize: 12,
                            }}
                          >
                            {m.type} · {m.region}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <span
                            style={{
                              padding: "2px 8px",
                              background: c.bg,
                              color: c.muted,
                              borderRadius: 4,
                              fontSize: 12,
                            }}
                          >
                            {mineCases.length} total
                          </span>
                          {open > 0 && (
                            <span
                              style={{
                                padding: "2px 8px",
                                background: c.infoBg,
                                color: c.info,
                                borderRadius: 4,
                                fontSize: 12,
                              }}
                            >
                              {open} open
                            </span>
                          )}
                          {overdue > 0 && (
                            <span
                              style={{
                                padding: "2px 8px",
                                background: c.dangerBg,
                                color: c.danger,
                                borderRadius: 4,
                                fontSize: 12,
                              }}
                            >
                              {overdue} overdue
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div style={card}>
              <h3 style={{ margin: "0 0 12px", fontSize: 16 }}>
                Filter complaints
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <select
                  style={smallInput}
                  value={filters.mine}
                  onChange={(e) =>
                    setFilters({ ...filters, mine: e.target.value })
                  }
                >
                  <option value="">All mines</option>
                  {mines.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <select
                  style={smallInput}
                  value={filters.category}
                  onChange={(e) =>
                    setFilters({ ...filters, category: e.target.value })
                  }
                >
                  <option value="">All categories</option>
                  {categories.map((cat) => (
                    <option key={cat.key} value={cat.key}>
                      {cat.label}
                    </option>
                  ))}
                  {sensitiveCategories.map((sc) => (
                    <option key={sc.key} value={sc.key}>
                      {sc.label} (sensitive)
                    </option>
                  ))}
                </select>
                <select
                  style={smallInput}
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                >
                  <option value="">All statuses</option>
                  {workflow.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <select
                  style={smallInput}
                  value={filters.type}
                  onChange={(e) =>
                    setFilters({ ...filters, type: e.target.value })
                  }
                >
                  <option value="">All types</option>
                  <option value="regular">Regular only</option>
                  <option value="sensitive">Sensitive only</option>
                </select>
              </div>
              <input
                style={smallInput}
                placeholder="Search by ID, name, or keyword..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
              />
              <div style={{ fontSize: 12, color: c.muted, marginTop: 8 }}>
                Showing {filteredCases.length} of {cases.length} complaints
                {(filters.mine ||
                  filters.category ||
                  filters.status ||
                  filters.type ||
                  filters.search) && (
                  <button
                    style={{
                      ...btnSec,
                      marginLeft: 8,
                      padding: "4px 10px",
                      fontSize: 11,
                    }}
                    onClick={() =>
                      setFilters({
                        mine: "",
                        category: "",
                        status: "",
                        type: "",
                        search: "",
                      })
                    }
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>

            <div style={card}>
              <h3 style={{ margin: "0 0 12px", fontSize: 16 }}>Complaints</h3>
              {filteredCases.length === 0 ? (
                <p style={{ color: c.muted, textAlign: "center", padding: 20 }}>
                  No complaints match your filters.
                </p>
              ) : (
                filteredCases
                  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                  .map((x) => {
                    const age = daysSince(x.timestamp);
                    const overdue =
                      age > 14 &&
                      x.status !== "Resolved" &&
                      x.status !== "Rejected";
                    const catColor =
                      categories.find((cc) => cc.key === x.category)?.color ||
                      "#475569";
                    return (
                      <div
                        key={x.id}
                        onClick={() => setSelectedCase(x)}
                        style={{
                          padding: 14,
                          borderBottom: `1px solid ${c.border}`,
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: 12,
                            alignItems: "center",
                            flex: 1,
                            minWidth: 0,
                          }}
                        >
                          <div
                            style={{
                              width: 40,
                              height: 40,
                              background: x.sensitivePath
                                ? c.dangerBg
                                : categories.find((cc) => cc.key === x.category)
                                    ?.bg || c.bg,
                              borderRadius: 8,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            {x.sensitivePath ? (
                              <span style={{ fontSize: 18 }}>🔒</span>
                            ) : (
                              <CategoryIcon
                                catKey={x.category}
                                size={22}
                                color={catColor}
                              />
                            )}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                display: "flex",
                                gap: 8,
                                alignItems: "center",
                                marginBottom: 4,
                                flexWrap: "wrap",
                              }}
                            >
                              <strong>{x.id}</strong>
                              {x.sensitivePath && (
                                <span
                                  style={{
                                    background: c.dangerBg,
                                    color: c.danger,
                                    padding: "2px 8px",
                                    borderRadius: 4,
                                    fontSize: 10,
                                    fontWeight: 700,
                                  }}
                                >
                                  SENSITIVE
                                </span>
                              )}
                              {overdue && (
                                <span
                                  style={{
                                    background: c.dangerBg,
                                    color: c.danger,
                                    padding: "2px 8px",
                                    borderRadius: 4,
                                    fontSize: 10,
                                    fontWeight: 700,
                                  }}
                                >
                                  OVERDUE {age}d
                                </span>
                              )}
                              <span style={statusBadge(x.status)}>
                                {x.status}
                              </span>
                            </div>
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                marginBottom: 2,
                              }}
                            >
                              {getMine(x.mine).name} · {getCategory(x).label}
                            </div>
                            <div style={{ fontSize: 12, color: c.muted }}>
                              {x.anonymous ? "Anonymous" : x.name} · {x.date} ·{" "}
                              {age}d ago{x.gps && " · 📍"}
                              {x.photo && " · 📷"}
                            </div>
                          </div>
                        </div>
                        <div style={{ fontSize: 18, color: c.muted }}>›</div>
                      </div>
                    );
                  })
              )}
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <button style={btnSec} onClick={() => setAdminAuth(false)}>
                Log out
              </button>
            </div>
          </>
        )}

        {/* ============ CASE DETAIL ============ */}
        {view === "admin" && adminAuth && selectedCase && (
          <>
            <button
              style={{ ...btnSec, marginBottom: 12 }}
              onClick={() => setSelectedCase(null)}
            >
              ← Back to list
            </button>

            <div style={card}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 12,
                  marginBottom: 16,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      background: selectedCase.sensitivePath
                        ? c.dangerBg
                        : categories.find(
                            (cc) => cc.key === selectedCase.category
                          )?.bg || c.bg,
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {selectedCase.sensitivePath ? (
                      <span style={{ fontSize: 22 }}>🔒</span>
                    ) : (
                      <CategoryIcon
                        catKey={selectedCase.category}
                        size={28}
                        color={
                          categories.find(
                            (cc) => cc.key === selectedCase.category
                          )?.color
                        }
                      />
                    )}
                  </div>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                        marginBottom: 4,
                      }}
                    >
                      <h2 style={{ margin: 0, fontSize: 20 }}>
                        {selectedCase.id}
                      </h2>
                      {selectedCase.sensitivePath && (
                        <span
                          style={{
                            background: c.dangerBg,
                            color: c.danger,
                            padding: "2px 8px",
                            borderRadius: 4,
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          SENSITIVE
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 13, color: c.muted }}>
                      Filed {selectedCase.date} ·{" "}
                      {daysSince(selectedCase.timestamp)} days ago
                    </div>
                  </div>
                </div>
                <span style={statusBadge(selectedCase.status)}>
                  {selectedCase.status}
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 16,
                  marginBottom: 16,
                }}
              >
                <div>
                  <div
                    style={{ fontSize: 12, color: c.muted, marginBottom: 2 }}
                  >
                    Mine
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>
                    {getMine(selectedCase.mine).name}
                  </div>
                  <div style={{ fontSize: 12, color: c.muted }}>
                    {getMine(selectedCase.mine).region} ·{" "}
                    {getMine(selectedCase.mine).type}
                  </div>
                </div>
                <div>
                  <div
                    style={{ fontSize: 12, color: c.muted, marginBottom: 2 }}
                  >
                    Category
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>
                    {getCategory(selectedCase).label}
                  </div>
                </div>
                <div>
                  <div
                    style={{ fontSize: 12, color: c.muted, marginBottom: 2 }}
                  >
                    Complainant
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>
                    {selectedCase.anonymous
                      ? "Anonymous (confidential)"
                      : selectedCase.name}
                  </div>
                  <div style={{ fontSize: 12, color: c.muted }}>
                    {selectedCase.contact}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: c.muted, marginBottom: 4 }}>
                  Description
                </div>
                <div
                  style={{
                    fontSize: 14,
                    padding: 12,
                    background: c.bg,
                    borderRadius: 8,
                    lineHeight: 1.5,
                  }}
                >
                  {selectedCase.desc}
                </div>
              </div>

              {selectedCase.location && (
                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{ fontSize: 12, color: c.muted, marginBottom: 4 }}
                  >
                    Location
                  </div>
                  <div style={{ fontSize: 14 }}>{selectedCase.location}</div>
                  {selectedCase.gps && (
                    <div style={{ fontSize: 12, color: c.muted, marginTop: 2 }}>
                      📍 GPS: {selectedCase.gps.lat}, {selectedCase.gps.lng}
                    </div>
                  )}
                </div>
              )}

              {selectedCase.photo && (
                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{ fontSize: 12, color: c.muted, marginBottom: 4 }}
                  >
                    Evidence photo
                  </div>
                  <img
                    src={selectedCase.photo.data}
                    alt="evidence"
                    style={{
                      maxWidth: "100%",
                      maxHeight: 300,
                      borderRadius: 8,
                      border: `1px solid ${c.border}`,
                    }}
                  />
                </div>
              )}
            </div>

            <div style={card}>
              <h3 style={{ margin: "0 0 12px", fontSize: 16 }}>
                Update status
              </h3>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {workflow.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateCaseStatus(selectedCase.id, s)}
                    style={{
                      padding: "8px 14px",
                      fontSize: 12,
                      fontWeight: 600,
                      border: `1px solid ${
                        selectedCase.status === s ? c.primary : c.border
                      }`,
                      background:
                        selectedCase.status === s ? c.primary : "white",
                      color: selectedCase.status === s ? "white" : c.text,
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div style={card}>
              <h3 style={{ margin: "0 0 12px", fontSize: 16 }}>
                Assigned officer
              </h3>
              <select
                style={input}
                value={selectedCase.officer}
                onChange={(e) => assignOfficer(selectedCase.id, e.target.value)}
              >
                {officers.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={card}>
              <h3 style={{ margin: "0 0 12px", fontSize: 16 }}>
                Investigation notes
              </h3>
              <textarea
                style={{ ...input, height: 100, marginBottom: 0 }}
                placeholder="Add notes about site visits, communications, findings..."
                value={selectedCase.notes || ""}
                onChange={(e) =>
                  updateCaseNotes(selectedCase.id, e.target.value)
                }
              />
            </div>
          </>
        )}

        <div
          style={{
            textAlign: "center",
            padding: "24px 0",
            color: c.muted,
            fontSize: 12,
          }}
        >
          Regulator hotline: +232 76 000 000 · Free call
        </div>
      </div>
    </div>
  );
}
