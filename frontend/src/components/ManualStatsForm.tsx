import { useState } from "react"

import type { PlayerRole, Situation } from "@/lib/types"
import {
  CLAMP_RANGES,
  MANUAL_ENTRY_AVERAGES,
  MEDIAN_DISPLAY_HINTS,
  clamp,
  type ClampField,
} from "@/lib/manual-entry-defaults"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ManualStatsFormProps {
  role: PlayerRole
  situation: Situation
  onChange: (patch: Partial<Situation>) => void
  useAverage: boolean
  onUseAverageChange: (checked: boolean) => void
}

// Shared clamp-on-blur number field: free typing while focused, snapped
// to CLAMP_RANGES on blur (not every keystroke, so entering e.g. "25"
// doesn't get truncated to "20" the moment the "2" is typed if min is
// 20). Shows a brief note if the entered value got clamped.
function ClampedNumberField({
  id,
  label,
  field,
  value,
  onCommit,
  disabled,
  placeholder,
  suffix,
}: {
  id: string
  label: string
  field: ClampField
  value: number | ""
  onCommit: (value: number) => void
  disabled?: boolean
  placeholder?: string
  suffix?: string
}) {
  const [draft, setDraft] = useState<string>(value === "" ? "" : String(value))
  const [clampNote, setClampNote] = useState<string | null>(null)
  const { min, max, step } = CLAMP_RANGES[field]

  function handleBlur() {
    if (draft.trim() === "") return
    const parsed = Number(draft)
    if (Number.isNaN(parsed)) {
      setDraft(value === "" ? "" : String(value))
      return
    }
    const clamped = clamp(parsed, field)
    setDraft(String(clamped))
    onCommit(clamped)
    setClampNote(clamped !== parsed ? `Clamped to ${clamped}${suffix ?? ""}.` : null)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        min={min}
        max={max}
        step={step}
        value={disabled ? "" : draft}
        placeholder={disabled ? placeholder : undefined}
        disabled={disabled}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleBlur}
      />
      {!disabled && clampNote && (
        <p className="text-xs text-muted-foreground">{clampNote}</p>
      )}
    </div>
  )
}

export function ManualStatsForm({
  role,
  situation,
  onChange,
  useAverage,
  onUseAverageChange,
}: ManualStatsFormProps) {
  function handleUseAverageChange(checked: boolean) {
    onUseAverageChange(checked)
    if (!checked) return

    if (role === "runner") {
      onChange({
        runner_prior_sr: MANUAL_ENTRY_AVERAGES.runner_prior_sr,
        runner_prior_att: MANUAL_ENTRY_AVERAGES.runner_prior_att,
        runner_sprint_speed: null,
        runner_age: null,
      })
    } else if (role === "pitcher") {
      onChange({ pitcher_prior_sr_allowed: MANUAL_ENTRY_AVERAGES.pitcher_prior_sr_allowed })
    } else {
      onChange({
        catcher_prior_cs_rate: MANUAL_ENTRY_AVERAGES.catcher_prior_cs_rate,
        catcher_pop_time: null,
      })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={useAverage} onCheckedChange={(c: boolean | "indeterminate") => handleUseAverageChange(c === true)} />
        Use average values for stats I don't know
      </label>

      {role === "runner" && (
        <div className="grid grid-cols-2 gap-4">
          <label className="col-span-2 flex items-center gap-2 text-sm">
            <Checkbox
              checked={situation.runner_bats_lhb}
              onCheckedChange={(c: boolean | "indeterminate") => onChange({ runner_bats_lhb: c === true })}
            />
            Bats left-handed
          </label>
          <ClampedNumberField
            id="runner_prior_sr"
            label="Prior success rate (%)"
            field="runner_prior_sr"
            value={Math.round(situation.runner_prior_sr * 100)}
            disabled={useAverage}
            placeholder={`${Math.round(MANUAL_ENTRY_AVERAGES.runner_prior_sr * 100)} (average)`}
            suffix="%"
            onCommit={(v) => onChange({ runner_prior_sr: v / 100 })}
          />
          <ClampedNumberField
            id="runner_prior_att"
            label="Prior attempts"
            field="runner_prior_att"
            value={situation.runner_prior_att}
            disabled={useAverage}
            placeholder={`${MANUAL_ENTRY_AVERAGES.runner_prior_att} (average)`}
            onCommit={(v) => onChange({ runner_prior_att: v })}
          />
          <ClampedNumberField
            id="runner_sprint_speed"
            label="Sprint speed (ft/s)"
            field="runner_sprint_speed"
            value={situation.runner_sprint_speed ?? ""}
            disabled={useAverage}
            placeholder={`${MEDIAN_DISPLAY_HINTS.runner_sprint_speed} (average)`}
            suffix=" ft/s"
            onCommit={(v) => onChange({ runner_sprint_speed: v })}
          />
          <ClampedNumberField
            id="runner_age"
            label="Age"
            field="runner_age"
            value={situation.runner_age ?? ""}
            disabled={useAverage}
            placeholder={`${MEDIAN_DISPLAY_HINTS.runner_age} (average)`}
            onCommit={(v) => onChange({ runner_age: v })}
          />
        </div>
      )}

      {role === "pitcher" && (
        <div className="grid grid-cols-2 gap-4">
          <label className="col-span-2 flex items-center gap-2 text-sm">
            <Checkbox
              checked={situation.pitcher_throws_lhp}
              onCheckedChange={(c: boolean | "indeterminate") => onChange({ pitcher_throws_lhp: c === true })}
            />
            Throws left-handed
          </label>
          <ClampedNumberField
            id="pitcher_prior_sr_allowed"
            label="Prior steal-success rate allowed (%)"
            field="pitcher_prior_sr_allowed"
            value={Math.round(situation.pitcher_prior_sr_allowed * 100)}
            disabled={useAverage}
            placeholder={`${Math.round(MANUAL_ENTRY_AVERAGES.pitcher_prior_sr_allowed * 100)} (average)`}
            suffix="%"
            onCommit={(v) => onChange({ pitcher_prior_sr_allowed: v / 100 })}
          />
        </div>
      )}

      {role === "catcher" && (
        <div className="grid grid-cols-2 gap-4">
          <ClampedNumberField
            id="catcher_prior_cs_rate"
            label="Prior caught-stealing rate (%)"
            field="catcher_prior_cs_rate"
            value={Math.round(situation.catcher_prior_cs_rate * 100)}
            disabled={useAverage}
            placeholder={`${Math.round(MANUAL_ENTRY_AVERAGES.catcher_prior_cs_rate * 100)} (average)`}
            suffix="%"
            onCommit={(v) => onChange({ catcher_prior_cs_rate: v / 100 })}
          />
          <ClampedNumberField
            id="catcher_pop_time"
            label="Pop time (s)"
            field="catcher_pop_time"
            value={situation.catcher_pop_time ?? ""}
            disabled={useAverage}
            placeholder={`${MEDIAN_DISPLAY_HINTS.catcher_pop_time} (average)`}
            suffix="s"
            onCommit={(v) => onChange({ catcher_pop_time: v })}
          />
        </div>
      )}
    </div>
  )
}
