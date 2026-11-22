import { Router } from "express";
import { estimateWalk } from "../../../application/estimateWalk";
import { DomainError } from "../../../domain/errors";
import type { LatLng } from "../../../domain/walk";
import { OsrmRouteProvider } from "../../../infrastructure/osrmRouteProvider";
import { requireApiKey } from "../apiKey";

const routeProvider = new OsrmRouteProvider();
export const walkPlansRouter = Router();

type Detail = { field: string; message: string };

function readNumber(value: unknown, field: string, min: number, max: number, details: Detail[]): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < min || value > max) {
    details.push({ field, message: `Harus angka antara ${min} dan ${max}.` });
    return NaN;
  }
  return value;
}

function readLatLng(value: unknown, field: string, details: Detail[]): LatLng {
  const v = (value ?? {}) as { lat?: unknown; lng?: unknown };
  return {
    lat: readNumber(v.lat, `${field}.lat`, -90, 90, details),
    lng: readNumber(v.lng, `${field}.lng`, -180, 180, details),
  };
}

walkPlansRouter.post("/walk-plans/estimate", requireApiKey, async (req, res) => {
  const details: Detail[] = [];
  const body = req.body ?? {};
  const origin = readLatLng(body.origin, "origin", details);
  const destination = readLatLng(body.destination, "destination", details);
  const weightKg = readNumber(body.weightKg, "weightKg", 20, 300, details);

  if (details.length > 0) {
    throw new DomainError("VALIDATION_ERROR", "Data yang dikirim tidak valid.", details);
  }

  const result = await estimateWalk(routeProvider, { origin, destination, weightKg });
  res.json(result);
});