function priority(name: string, awal?: string): string {
  const nilai = process.env[name] ?? awal;
  if (nilai === undefined || nilai === "") {
    throw new Error(`Variabel lingkungan ${name} belum diisi`);
  }
  return nilai;
}

// Format API_KEYS: "namaKlien:kunci,namaKlien2:kunci2"
function parseApiKeys(raw: string | undefined): Map<string, string> {
  const keys = new Map<string, string>();
  for (const pair of (raw ?? "").split(",")) {
    const [client, key] = pair.split(":").map((part) => part.trim());
    if (client && key) keys.set(key, client);
  }
  return keys;
}

export const config = {
  port: Number(process.env.PORT ?? 3000),
  pbUrl: priority("PB_URL", "http://localhost:8090"),
  osrmBaseUrl: priority("OSRM_BASE_URL", "https://routing.openstreetmap.de/routed-foot"),
  apiKeys: parseApiKeys(process.env.API_KEYS),
};