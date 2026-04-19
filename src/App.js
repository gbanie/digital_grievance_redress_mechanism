import { useState } from "react";

const mines = [
  { id: "koidu", name: "Koidu Limited", type: "LSM", region: "Kono" },
  {
    id: "sierra-rutile",
    name: "Sierra Rutile",
    type: "LSM",
    region: "Moyamba",
  },
  { id: "marampa", name: "Marampa Mines", type: "LSM", region: "Port Loko" },
  { id: "sl-mining", name: "SL Mining", type: "LSM", region: "Tonkolili" },
  { id: "unknown", name: "Other / Not listed", type: "Other", region: "-" },
];

const categories = [
  { key: "land", label: "Land & crops", color: "#d97706" },
  { key: "water", label: "Water pollution", color: "#0ea5e9" },
  { key: "air", label: "Air & dust", color: "#78716c" },
  { key: "health", label: "Health & safety", color: "#dc2626" },
  { key: "jobs", label: "Jobs & wages", color: "#059669" },
  { key: "housing", label: "Housing", color: "#7c3aed" },
  { key: "sacred", label: "Sacred sites", color: "#db2777" },
  { key: "blast", label: "Blasting & noise", color: "#ea580c" },
  { key: "other", label: "Other", color: "#64748b" },
];

export default function App() {
  const [cases, setCases] = useState([]);
  const [view, setView] = useState("submit");
  const [form, setForm] = useState({
    name: "",
    contact: "",
    mine: "",
    category: "",
    desc: "",
  });
  const [trackId, setTrackId] = useState("");
  const [found, setFound] = useState(null);
  const [confirmation, setConfirmation] = useState("");

  const handleSubmit = () => {
    if (!form.mine || !form.category || !form.desc || !form.name) {
      alert("Please fill in all required fields");
      return;
    }
    const id = "GRM-" + String(cases.length + 1).padStart(4, "0");
    const newCase = {
      ...form,
      id,
      status: "Received",
      date: new Date().toLocaleDateString(),
    };
    setCases([...cases, newCase]);
    setConfirmation(id);
    setForm({ name: "", contact: "", mine: "", category: "", desc: "" });
  };

  const handleTrack = () => {
    const match = cases.find((c) => c.id === trackId.toUpperCase().trim());
    setFound(match || "notfound");
  };

  const page = {
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "system-ui, sans-serif",
    color: "#0f172a",
  };
  const container = { maxWidth: 720, margin: "0 auto", padding: "0 16px" };
  const card = {
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  };
  const label = {
    display: "block",
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 8,
    marginTop: 4,
  };
  const input = {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    fontSize: 15,
    marginBottom: 14,
    boxSizing: "border-box",
    fontFamily: "inherit",
    background: "white",
  };
  const btn = {
    background: "#047857",
    color: "white",
    border: "none",
    padding: "14px 20px",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    width: "100%",
  };
  const tabStyle = (active) => ({
    flex: 1,
    padding: "12px 8px",
    background: active ? "#047857" : "transparent",
    color: active ? "white" : "#64748b",
    border: "none",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  });

  return (
    <div style={page}>
      <div style={{ background: "#047857", color: "white", padding: "22px 0" }}>
        <div style={container}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 48,
                height: 48,
                background: "white",
                color: "#047857",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              M
            </div>
            <div>
              <div style={{ fontSize: 19, fontWeight: 700 }}>
                Mining Community Grievance System
              </div>
              <div style={{ fontSize: 13, opacity: 0.9 }}>
                File complaints against mining operations
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={container}>
        <div
          style={{
            display: "flex",
            gap: 4,
            background: "white",
            padding: 6,
            borderRadius: 10,
            border: "1px solid #e2e8f0",
            marginTop: 20,
            marginBottom: 20,
          }}
        >
          <button
            style={tabStyle(view === "submit")}
            onClick={() => {
              setView("submit");
              setConfirmation("");
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
            onClick={() => setView("admin")}
          >
            Admin view
          </button>
        </div>

        {view === "submit" && (
          <div style={card}>
            {confirmation && (
              <div
                style={{
                  background: "#d1fae5",
                  color: "#059669",
                  padding: 14,
                  borderRadius: 10,
                  marginBottom: 16,
                  fontWeight: 600,
                }}
              >
                Complaint received. Your ID is {confirmation}. Save it to check
                status later.
              </div>
            )}

            <label style={label}>Which mine is this about? *</label>
            <select
              style={input}
              value={form.mine}
              onChange={(e) => setForm({ ...form, mine: e.target.value })}
            >
              <option value="">Select a mine</option>
              {mines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} - {m.region}
                </option>
              ))}
            </select>

            <label style={label}>What is the complaint about? *</label>
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
                    onClick={() => setForm({ ...form, category: cat.key })}
                    style={{
                      background: sel ? cat.color : "#fafafa",
                      color: sel ? "white" : "#0f172a",
                      border: sel
                        ? "2px solid " + cat.color
                        : "2px solid #e2e8f0",
                      borderRadius: 10,
                      padding: "14px 6px",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            <label style={label}>Describe what happened *</label>
            <textarea
              style={{ ...input, height: 100, resize: "vertical" }}
              placeholder="Tell us what happened..."
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
            />

            <label style={label}>Your name *</label>
            <input
              style={input}
              placeholder="e.g. Aminata Kamara"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <label style={label}>Phone number</label>
            <input
              style={input}
              placeholder="e.g. +232 76 123 456"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
            />

            <button style={btn} onClick={handleSubmit}>
              Submit complaint
            </button>
          </div>
        )}

        {view === "track" && (
          <div style={card}>
            <h2 style={{ margin: "0 0 4px", fontSize: 20 }}>
              Track your complaint
            </h2>
            <p
              style={{
                color: "#64748b",
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
                  background: "#fee2e2",
                  color: "#dc2626",
                  borderRadius: 10,
                }}
              >
                No complaint found with that ID.
              </div>
            )}
            {found && found !== "notfound" && (
              <div
                style={{
                  marginTop: 16,
                  padding: 16,
                  background: "#f8fafc",
                  borderRadius: 10,
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 10 }}>
                  {found.id} - {found.status}
                </div>
                <div style={{ fontSize: 13, color: "#64748b" }}>Mine</div>
                <div style={{ marginBottom: 10 }}>
                  {mines.find((m) => m.id === found.mine)?.name || "-"}
                </div>
                <div style={{ fontSize: 13, color: "#64748b" }}>Category</div>
                <div style={{ marginBottom: 10 }}>
                  {categories.find((c) => c.key === found.category)?.label ||
                    "-"}
                </div>
                <div style={{ fontSize: 13, color: "#64748b" }}>
                  Description
                </div>
                <div style={{ marginBottom: 10 }}>{found.desc}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  Filed on {found.date}
                </div>
              </div>
            )}
          </div>
        )}

        {view === "admin" && (
          <div style={card}>
            <h2 style={{ margin: "0 0 16px", fontSize: 20 }}>All complaints</h2>
            <div
              style={{
                marginBottom: 16,
                padding: 12,
                background: "#f8fafc",
                borderRadius: 8,
              }}
            >
              <strong>Total: {cases.length}</strong>
            </div>
            {cases.length === 0 ? (
              <p style={{ color: "#64748b", textAlign: "center", padding: 20 }}>
                No complaints yet.
              </p>
            ) : (
              cases.map((c) => (
                <div
                  key={c.id}
                  style={{ padding: 12, borderBottom: "1px solid #e2e8f0" }}
                >
                  <div style={{ fontWeight: 600 }}>
                    {c.id} - {mines.find((m) => m.id === c.mine)?.name}
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b" }}>
                    {categories.find((ct) => ct.key === c.category)?.label} -{" "}
                    {c.name} - {c.date}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div
          style={{
            textAlign: "center",
            padding: "24px 0",
            color: "#64748b",
            fontSize: 12,
          }}
        >
          Regulator hotline: +232 76 000 000
        </div>
      </div>
    </div>
  );
}
