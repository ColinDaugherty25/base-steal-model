import { BASE_STATES } from "@/lib/types"
import type { Situation } from "@/lib/types"

const TARGETS = ["2", "3", "H"] as const

// Encodes a full Situation into a URL-safe string for the "s" query
// param, so a specific prediction can be reproduced from a shared link.
// btoa/atob only handle Latin1, so JSON is percent-encoded first -- a
// standard safe combo for base64-ing arbitrary text.
export function encodeSituation(situation: Situation): string {
  return btoa(encodeURIComponent(JSON.stringify(situation)))
}

// Best-effort decode: a hand-edited or corrupted param should never
// crash the page, just fail to populate the shared state.
export function decodeSituation(encoded: string): Situation | null {
  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(atob(encoded)))
    return isValidSituation(parsed) ? parsed : null
  } catch {
    return null
  }
}

function isValidSituation(value: unknown): value is Situation {
  if (typeof value !== "object" || value === null) return false
  const s = value as Record<string, unknown>

  return (
    typeof s.inning === "number" &&
    (s.half === 0 || s.half === 1) &&
    typeof s.outs === "number" &&
    typeof s.base_code === "string" &&
    (BASE_STATES as readonly string[]).includes(s.base_code) &&
    typeof s.score_diff === "number" &&
    typeof s.target === "string" &&
    (TARGETS as readonly string[]).includes(s.target) &&
    typeof s.balls === "number" &&
    typeof s.strikes === "number" &&
    typeof s.is_double_steal === "boolean" &&
    typeof s.runner_bats_lhb === "boolean" &&
    typeof s.pitcher_throws_lhp === "boolean" &&
    typeof s.runner_prior_sr === "number" &&
    typeof s.runner_prior_att === "number" &&
    typeof s.pitcher_prior_sr_allowed === "number" &&
    typeof s.catcher_prior_cs_rate === "number" &&
    (s.runner_sprint_speed === null || typeof s.runner_sprint_speed === "number") &&
    (s.runner_age === null || typeof s.runner_age === "number") &&
    (s.catcher_pop_time === null || typeof s.catcher_pop_time === "number")
  )
}
