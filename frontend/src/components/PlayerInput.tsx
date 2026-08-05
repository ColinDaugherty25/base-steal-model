import { ManualStatsForm } from "@/components/ManualStatsForm"
import { PlayerCombobox } from "@/components/PlayerCombobox"
import { PlayerStatFields } from "@/components/PlayerStatFields"
import type { PlayerRole, PlayerSearchResult, Situation } from "@/lib/types"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Mode = "search" | "manual"

interface PlayerInputProps {
  role: PlayerRole
  label: string
  mode: Mode
  onModeChange: (mode: Mode) => void
  selected: PlayerSearchResult | null
  onSelect: (player: PlayerSearchResult) => void
  situation: Situation
  onManualChange: (patch: Partial<Situation>) => void
  useAverage: boolean
  onUseAverageChange: (checked: boolean) => void
}

// Per-role Search/Manual toggle. Search mode reuses PlayerCombobox +
// PlayerStatFields unchanged; Manual mode lets the user hand-enter stats
// for a player who isn't in the real MLB database (e.g. themself, in a
// recreational game).
export function PlayerInput({
  role,
  label,
  mode,
  onModeChange,
  selected,
  onSelect,
  situation,
  onManualChange,
  useAverage,
  onUseAverageChange,
}: PlayerInputProps) {
  return (
    <Tabs value={mode} onValueChange={(v: string) => onModeChange(v as Mode)}>
      <TabsList>
        <TabsTrigger value="search">Search</TabsTrigger>
        <TabsTrigger value="manual">Manual</TabsTrigger>
      </TabsList>
      <TabsContent value="search" className="flex flex-col gap-1 pt-2">
        <PlayerCombobox role={role} label={label} selected={selected} onSelect={onSelect} />
        <PlayerStatFields role={role} player={selected} />
      </TabsContent>
      <TabsContent value="manual" className="pt-2">
        <ManualStatsForm
          role={role}
          situation={situation}
          onChange={onManualChange}
          useAverage={useAverage}
          onUseAverageChange={onUseAverageChange}
        />
      </TabsContent>
    </Tabs>
  )
}
