import type { ErrorRequestHandler, RequestHandler } from "express";

export class AppError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

export const notFound: RequestHandler = (_req, _res, next) => {
  next(new AppError(404, "TIDAK_DITEMUKAN", "Endpoint tidak ditemukan."));
};

export const ErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.status).json({ error: { code: err.code, message: err.message } });
    return;
  }
  if (err?.type === "entity.parse.failed") {
    res.status(400).json({ error: { code: "JSON_TIDAK_VALID", message: "Body request bukan JSON yang valid." } });
    return;
  }
  console.error(err);
  res.status(500).json({ error: { code: "KESALAHAN_SERVER", message: "Terjadi kesalahan di server." } });
};