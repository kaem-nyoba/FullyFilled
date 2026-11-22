import express from "express";
import { healthRouter } from "./routes/health";
import { walkPlansRouter } from "./routes/walkPlans";
import { errorHandler, notFound } from "./errors";

export function App() {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(express.json({ limit: "100kb" }));

  app.use("/api", healthRouter);
  app.use("/api", walkPlansRouter);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}