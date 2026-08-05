import type { Situation } from "@/lib/types"

// Real averages computed from backend/data/app.db -- used when "use
// average" is checked for the 4 stat fields that have no backend median
// fallback (Situation requires real numbers here, not null).
export const MANUAL_ENTRY_AVERAGES = {
  runner_prior_sr: 0.765,
  runner_prior_att: 0,
  pitcher_prior_sr_allowed: 0.772,
  catcher_prior_cs_rate: 0.202,
} as const

// Display-only. The frontend sends `null` for these 3 fields when "use
// average" is checked and lets the backend's resolveOrMedian (see
// backend/internal/decision/features.go) fill them in with the real
// training-set median. These numbers are shown only as placeholder hints
// so the user knows what "average" resolves to server-side.
export const MEDIAN_DISPLAY_HINTS = {
  runner_sprint_speed: 28.2,
  runner_age: 27.0,
  catcher_pop_time: 1.96,
} as const

export const CLAMP_RANGES = {
  runner_prior_sr: { min: 0, max: 100, step: 1 },
  runner_prior_att: { min: 0, max: 100, step: 1 },
  runner_sprint_speed: { min: 20, max: 32, step: 0.1 },
  runner_age: { min: 16, max: 50, step: 1 },
  pitcher_prior_sr_allowed: { min: 0, max: 100, step: 1 },
  catcher_prior_cs_rate: { min: 0, max: 100, step: 1 },
  catcher_pop_time: { min: 1.7, max: 2.3, step: 0.01 },
} as const

export type ClampField = keyof typeof CLAMP_RANGES

export function clamp(value: number, field: ClampField): number {
  const { min, max } = CLAMP_RANGES[field]
  return Math.min(max, Math.max(min, value))
}

// Belt-and-suspenders guard run immediately before every /api/predict
// call -- the backend does no range validation on these fields (see
// backend/internal/api/dto.go's validate(), which only checks
// half/outs/target/base_code), so this is the only thing preventing a
// physically nonsensical manual entry from reaching the model.
export function clampSituation(situation: Situation): Situation {
  return {
    ...situation,
    runner_prior_sr: clamp(situation.runner_prior_sr * 100, "runner_prior_sr") / 100,
    runner_prior_att: clamp(situation.runner_prior_att, "runner_prior_att"),
    pitcher_prior_sr_allowed:
      clamp(situation.pitcher_prior_sr_allowed * 100, "pitcher_prior_sr_allowed") / 100,
    catcher_prior_cs_rate:
      clamp(situation.catcher_prior_cs_rate * 100, "catcher_prior_cs_rate") / 100,
    runner_sprint_speed:
      situation.runner_sprint_speed === null
        ? null
        : clamp(situation.runner_sprint_speed, "runner_sprint_speed"),
    runner_age:
      situation.runner_age === null ? null : clamp(situation.runner_age, "runner_age"),
    catcher_pop_time:
      situation.catcher_pop_time === null
        ? null
        : clamp(situation.catcher_pop_time, "catcher_pop_time"),
  }
}
