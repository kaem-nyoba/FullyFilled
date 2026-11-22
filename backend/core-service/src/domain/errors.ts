export type DomainErrorCode = "VALIDATION_ERROR" | "ROUTE_NOT_FOUND" | "ROUTING_UNAVAILABLE";

export class DomainError extends Error {
  constructor(
    public code: DomainErrorCode,
    message: string,
    public details?: { field: string; message: string }[],
  ) {
    super(message);
  }
}