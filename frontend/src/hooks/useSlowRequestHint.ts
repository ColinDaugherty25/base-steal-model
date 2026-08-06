import { useEffect, useState } from "react"

// Returns true once `active` has been continuously true for `delayMs`,
// false otherwise. Used to show a "this is taking a while" hint only
// once a request has actually run long -- not on every normal-speed
// request -- so it surfaces naturally when the backend is cold-starting
// (Render's free tier spins down after ~15 min idle and can take up to
// ~30s to wake) without cluttering fast, already-warm requests.
export function useSlowRequestHint(active: boolean, delayMs = 3000): boolean {
  const [slow, setSlow] = useState(false)

  useEffect(() => {
    if (!active) {
      setSlow(false)
      return
    }
    const id = setTimeout(() => setSlow(true), delayMs)
    return () => clearTimeout(id)
  }, [active, delayMs])

  return slow
}
