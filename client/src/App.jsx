import { useEffect, useState } from "react";

export default function App() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/health", {
          credentials: "include",
        });
        const data = await res.json();
        if (!cancelled) setHealth(data);
      } catch (error) {
        if (!cancelled) {
          setHealth({ ok: false, error: error.message });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="page">
      <div className="card">
        <p className="eyebrow">React / Express monorepo</p>
        <h1>Skeleton is wired up</h1>
        <p>
          In development, Vite proxies <code>/api</code> and <code>/ws</code> to
          the Express server. In production, Express serves the built SPA.
        </p>

        <div className="status">
          <strong>Server health:</strong>{" "}
          {loading ? "Loading..." : <code>{JSON.stringify(health)}</code>}
        </div>
      </div>
    </main>
  );
}
