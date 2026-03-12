import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

import { config } from "./util/config.js";
import exampleRouter from "./routes/example.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const app = express();

  // Dev CORS (Vite runs on another origin). In production, same origin.
  if (!config.isProd) {
    app.use(
      cors({
        origin: config.corsOrigin,
        credentials: true,
      })
    );
  }

  app.use(express.json());

  app.set("trust proxy", 1);

  // Health
  app.get("/api/health", (req, res) => res.json({ ok: true }));

  // Current user (nullable)
  app.get("/api/me", async (req, res) => {
    const userId = req.session?.userId;
    if (!userId) return res.json({ user: null });
    return res.json({ user: { id: userId } });
  });

  // Routes
  app.use("/api", exampleRouter);

  // Static client hosting (production)
  if (config.isProd) {
    const clientDist = path.resolve(__dirname, "../../client/dist");
    app.use(express.static(clientDist));
    app.get(/^(?!\/api\/|\/ws\/).*/, (req, res) => {
      res.sendFile(path.join(clientDist, "index.html"));
    });
  }

  const server = app.listen(config.port, () => {
    console.log(`[server] listening on http://localhost:${config.port} (${config.env})`);
  });

  process.on("SIGTERM", () => {
    console.log("[server] SIGTERM received — shutting down...");
    server.close(() => process.exit(0));
  });
}

main().catch((e) => {
  console.error("[server] fatal", e);
  process.exit(1);
});
