import { Router } from "express";
import { config } from "../../../config";

export const healthRouter = Router();

healthRouter.get("/health", async (_req, res) => {
  let database: "ok" | "down" = "down";
  try {
    const r = await fetch(`${config.pbUrl}/api/health`, {
      signal: AbortSignal.timeout(3000),
    });
    if (r.ok) database = "ok";
  } catch {
    // PocketBase tidak terjangkau: biarkan status "gagal"
  }

  const healthy = database === "ok";
  res.status(healthy ? 200 : 503).json({
    status: healthy ? "ok" : "degraded",
    service: "fullyfilled-core",
    database,
    time: new Date().toISOString(),
  });
});