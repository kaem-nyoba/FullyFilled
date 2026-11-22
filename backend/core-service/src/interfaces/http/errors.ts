import type { ErrorRequestHandler, RequestHandler } from "express";
import { DomainError, type DomainErrorCode } from "../../domain/errors";

export class AppError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

const DOMAIN_STATUS: Record<DomainErrorCode, number> = {
  VALIDATION_ERROR: 400,
  ROUTE_NOT_FOUND: 422,
  ROUTING_UNAVAILABLE: 503,
};

export const notFound: RequestHandler = (_req, _res, next) => {
  next(new AppError(404, "NOT_FOUND", "Endpoint tidak ditemukan."));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof DomainError) {
    res.status(DOMAIN_STATUS[err.code]).json({
      error: { code: err.code, message: err.message, ...(err.details ? { details: err.details } : {}) },
    });
    return;
  }
  if (err instanceof AppError) {
    res.status(err.status).json({ error: { code: err.code, message: err.message } });
    return;
  }
  if (err?.type === "entity.parse.failed") {
    res.status(400).json({ error: { code: "INVALID_JSON", message: "Body request bukan JSON yang valid." } });
    return;
  }
  console.error(err);
  res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan di server." } });
};