import React, { useState, FormEvent } from "react";
// @ts-ignore – typed via global.d.ts shim
import { VegaLite } from "react-vega";

type Role = "user" | "assistant";

type Message = {
  id: number;
  role: Role;
  text: string;
};

type ChatResponse = {
  reply: string;
  vega_specs: any[];
  title: string;
  plan: any;
  grouped_preview: any[];
};

// Backend URL: change if needed or use Vite env var
const API_BASE =
  import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8010";
const CHAT_ENDPOINT = `${API_BASE}/api/sciscinet-chat`;

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      text:
        "Hi! Ask me about your questions regarding Yeshiva University publications, including fields, " +
        "years etc. I’ll provide you with the filtering results and visualization.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [vegaSpecs, setVegaSpecs] = useState<any[]>([]);
  const [title, setTitle] = useState<string>("");
  const [plan, setPlan] = useState<any>(null);
  const [groupedPreview, setGroupedPreview] = useState<any[]>([]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    setError(null);

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data: ChatResponse = await res.json();

      // Chat reply
      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        text: data.reply ?? "(No reply field returned from backend.)",
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Visualization + metadata
      setVegaSpecs(data.vega_specs || []);
      setTitle(data.title || "");
      setPlan(data.plan ?? null);
      setGroupedPreview(data.grouped_preview || []);
    } catch (err: any) {
      console.error("Backend error:", err);
      const msg =
        err?.message ||
        "Failed to reach backend. Check server, port, and CORS.";
      setError(msg);

      const assistantMessage: Message = {
        id: Date.now() + 2,
        role: "assistant",
        text:
          "I couldn’t reach the backend or it returned an error. " +
          "Please check the backend logs.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#0f172a",
        color: "#e5e7eb",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "12px 20px",
          borderBottom: "1px solid #1f2937",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontWeight: 600, fontSize: 18 }}>
            SciSciNet Chat + Vega-Lite
          </div>
          <div style={{ fontSize: 12, color: "#9ca3af" }}>
            Backend: <code>{CHAT_ENDPOINT}</code>
          </div>
        </div>
        {loading && (
          <div style={{ fontSize: 12, color: "#9ca3af" }}>
            Querying backend…
          </div>
        )}
      </header>

      {/* Main layout */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* Chat panel */}
        <section
          style={{
            flex: 1.2,
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid #1f2937",
            minWidth: 0,
          }}
        >
          <div
            style={{
              flex: 1,
              padding: "16px 16px 8px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "80%",
                  background:
                    m.role === "user"
                      ? "linear-gradient(to right, #4f46e5, #22c55e)"
                      : "#111827",
                  color: m.role === "user" ? "white" : "#e5e7eb",
                  borderRadius: 16,
                  padding: "8px 12px",
                  fontSize: 14,
                  whiteSpace: "pre-wrap",
                }}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div
                style={{
                  alignSelf: "flex-start",
                  fontSize: 12,
                  color: "#9ca3af",
                  paddingLeft: 4,
                }}
              >
                Thinking…
              </div>
            )}
            {error && (
              <div
                style={{
                  marginTop: 8,
                  fontSize: 12,
                  color: "#f97373",
                }}
              >
                Backend error: {error}
              </div>
            )}
          </div>

          {/* Input box */}
          <form
            onSubmit={handleSubmit}
            style={{
              padding: 12,
              borderTop: "1px solid #1f2937",
              display: "flex",
              gap: 8,
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., papers in computer science after 2018 grouped by field…"
              style={{
                flex: 1,
                padding: "8px 10px",
                borderRadius: 999,
                border: "1px solid #374151",
                background: "#020617",
                color: "#e5e7eb",
                fontSize: 14,
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              style={{
                padding: "8px 14px",
                borderRadius: 999,
                border: "none",
                fontSize: 14,
                fontWeight: 500,
                cursor: loading ? "default" : "pointer",
                background: loading
                  ? "rgba(156,163,175,0.4)"
                  : "linear-gradient(to right, #4f46e5, #22c55e)",
                color: "white",
              }}
            >
              Send
            </button>
          </form>
        </section>

        {/* Right panel: charts + plan + table */}
        <section
          style={{
            flex: 1.4,
            padding: 16,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {/* Title */}
          <div style={{ fontSize: 14, fontWeight: 500 }}>
            {title || "Visualization"}
          </div>

          {/* Charts */}
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            {vegaSpecs.length === 0 ? (
              <div
                style={{
                  fontSize: 12,
                  color: "#9ca3af",
                }}
              >
                No chart yet. Ask a question to generate a visualization.
              </div>
            ) : (
              vegaSpecs.map((spec, idx) => (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    minWidth: 260,
                    background: "#020617",
                    borderRadius: 12,
                    padding: 12,
                    border: "1px solid #1f2937",
                  }}
                >
                  <VegaLite spec={spec} />
                </div>
              ))
            )}
          </div>

          {/* Plan (JSON) */}
          {plan && (
            <div
              style={{
                marginTop: 8,
                padding: 8,
                background: "#020617",
                borderRadius: 8,
                border: "1px solid #1f2937",
                fontSize: 12,
                maxHeight: 160,
                overflow: "auto",
              }}
            >
              <div style={{ marginBottom: 4, color: "#9ca3af" }}>Plan</div>
              <pre
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {JSON.stringify(plan, null, 2)}
              </pre>
            </div>
          )}

          {/* Grouped preview table */}
          {groupedPreview.length > 0 && (
            <div
              style={{
                marginTop: 8,
                padding: 8,
                background: "#020617",
                borderRadius: 8,
                border: "1px solid #1f2937",
                fontSize: 12,
                maxHeight: 220,
                overflow: "auto",
              }}
            >
              <div style={{ marginBottom: 4, color: "#9ca3af" }}>
                Grouped preview (first {groupedPreview.length} rows)
              </div>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr>
                    {Object.keys(groupedPreview[0]).map((col) => (
                      <th
                        key={col}
                        style={{
                          textAlign: "left",
                          padding: "4px 6px",
                          borderBottom: "1px solid #1f2937",
                          position: "sticky",
                          top: 0,
                          background: "#020617",
                        }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {groupedPreview.map((row, i) => (
                    <tr key={i}>
                      {Object.keys(groupedPreview[0]).map((col) => (
                        <td
                          key={col}
                          style={{
                            padding: "4px 6px",
                            borderBottom: "1px solid #111827",
                          }}
                        >
                          {String(row[col])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default App;
