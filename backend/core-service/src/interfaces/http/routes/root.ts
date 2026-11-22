import { Router } from "express";

export const rootRouter = Router();

rootRouter.get("/", (_req, res) => {
  res.json({
    service: "fullyfilled-core",
    name: "FullyFilled Core Service (inggrisbng2)",
    version: "0.1.0",
    description: "Rute jalan kaki sehat, estimasi kalori, dan progres target harian.",
    docs: {
      readme: "https://github.com/kaem-nyoba/FullyFilled/blob/main/backend/README.md",
      openapi: "https://github.com/kaem-nyoba/FullyFilled/blob/main/backend/openapi.yaml",
    },
    endpoints: [
      { method: "GET", path: "/api/health", auth: "none", description: "Cek service dan database" },
      {
        method: "POST",
        path: "/api/walk-plans/estimate",
        auth: "X-API-Key",
        description: "Rute jalan kaki, jarak, durasi, dan estimasi kalori",
      },
    ],
  });
});