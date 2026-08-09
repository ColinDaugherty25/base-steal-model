import type { PlayerRole, Situation } from "@/lib/types"

// Persists manually-entered player stats per role, so a recreational
// user describing themselves isn't retyping the same runner/pitcher/
// catcher profile every visit. Only the fields relevant to each role
// are stored -- not the whole Situation (inning/outs/etc. shouldn't be
// remembered as part of a "player").
const FIELDS_BY_ROLE = {
  runner: ["runner_bats_lhb", "runner_prior_sr", "runner_prior_att", "runner_sprint_speed", "runner_age"],
  pitcher: ["pitcher_throws_lhp", "pitcher_prior_sr_allowed"],
  catcher: ["catcher_prior_cs_rate", "catcher_pop_time"],
} as const satisfies Record<PlayerRole, readonly (keyof Situation)[]>

function storageKey(role: PlayerRole): string {
  return `steal-model:manual-${role}`
}

export function pickRoleFields(role: PlayerRole, situation: Situation): Partial<Situation> {
  const fields = FIELDS_BY_ROLE[role]
  const picked: Partial<Situation> = {}
  for (const field of fields) {
    ;(picked as Record<string, unknown>)[field] = situation[field]
  }
  return picked
}

// localStorage can throw (private browsing, quota, disabled storage) --
// this is a convenience feature, not something the app depends on, so
// every call is best-effort and silently no-ops on failure.
export function loadManualProfile(role: PlayerRole): Partial<Situation> | null {
  try {
    const raw = localStorage.getItem(storageKey(role))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveManualProfile(role: PlayerRole, profile: Partial<Situation>): void {
  try {
    localStorage.setItem(storageKey(role), JSON.stringify(profile))
  } catch {
    // best-effort, ignore
  }
}
