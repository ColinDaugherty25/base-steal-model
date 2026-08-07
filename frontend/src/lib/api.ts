import type {
  PlayerRole,
  PlayerSearchResult,
  PredictResponse,
  Situation,
} from "@/lib/types"

// In local dev, relative /api paths work because vite.config.ts proxies
// them to the backend. Production hosts (e.g. Vercel) don't run that
// proxy, so VITE_API_BASE_URL points requests at the deployed backend
// instead -- left unset, requests stay relative (local dev default).
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ""

// Fire-and-forget ping to wake a cold Render free-tier backend as early
// as possible, ideally before the user's first real search or predict
// request. Failures are ignored -- this is a best-effort warmup, not a
// request the app depends on; the real request will still work (just
// slower) if this one fails or the backend is still cold.
export function warmBackend(): void {
  fetch(`${API_BASE}/api/health`).catch(() => {})
}

export async function searchPlayers(
  role: PlayerRole,
  q: string,
  limit = 10,
): Promise<PlayerSearchResult[]> {
  const params = new URLSearchParams({ role, q, limit: String(limit) })
  const res = await fetch(`${API_BASE}/api/players/search?${params}`)
  if (!res.ok) {
    throw new Error(`player search failed (${res.status})`)
  }
  return res.json()
}

export async function predictStealDecision(
  situation: Situation,
): Promise<PredictResponse> {
  const res = await fetch(`${API_BASE}/api/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(situation),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.error ?? `prediction failed (${res.status})`)
  }
  return res.json()
}
