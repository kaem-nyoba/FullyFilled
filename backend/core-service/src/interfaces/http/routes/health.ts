import { Router } from "express";
import { config } from "../../../config";

export const healthRouter = Router();

healthRouter.get("/health", async (_req, res) => {
  let database: "ok" | "failed" = "failed";
  try {
    const r = await fetch(`${config.pbUrl}/api/health`, {
      signal: AbortSignal.timeout(3000),
    });
    if (r.ok) database = "ok";
  } catch {
    // PocketBase tidak terjangkau: biarkan status "gagal"
  }

  const sehat = database === "ok";
  res.status(sehat ? 200 : 503).json({
    status: sehat ? "ok" : "terganggu",
    layanan: "fullyfilled-core",
    database,
    waktu: new Date().toISOString(),
  });
});