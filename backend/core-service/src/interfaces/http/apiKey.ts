import type { RequestHandler } from "express";
import { config } from "../../config";
import { AppError } from "./errors";

export const requireApiKey: RequestHandler = (req, res, next) => {
  const key = req.header("X-API-Key");
  const client = key ? config.apiKeys.get(key) : undefined;
  if (!client) {
    next(new AppError(401, "UNAUTHORIZED", "API key tidak valid."));
    return;
  }
  res.locals.apiClient = client; // nama kelompok pemilik kunci, berguna untuk log
  next();
};