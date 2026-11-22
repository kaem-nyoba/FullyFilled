function priority(name: string, awal?: string): string {
  const nilai = process.env[name] ?? awal;
  if (nilai === undefined || nilai === "") {
    throw new Error(`Variabel lingkungan ${name} belum diisi`);
  }
  return nilai;
}

export const config = {
  port: Number(process.env.PORT ?? 3000),
  pbUrl: priority("PB_URL", "http://localhost:8090"),
  osrmBaseUrl: priority("OSRM_BASE_URL", "https://routing.openstreetmap.de/routed-foot"),
};