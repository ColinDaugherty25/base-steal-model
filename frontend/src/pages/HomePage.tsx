import { useEffect } from "react"
import { NavLink } from "react-router"
import { Button } from "@/components/ui/button"
import { TextEffect } from "@/components/ui/text-effect"
import { TextLoop } from "@/components/ui/text-loop"
import { AnimatedGroup } from "@/components/ui/animated-group"
import { InView } from "@/components/ui/in-view"
import { SlidingNumber } from "@/components/ui/sliding-number"
import { DiamondField } from "@/components/graphics/DiamondField"
import { BACKTEST_LAYERS } from "@/lib/backtest-data"
import { warmBackend } from "@/lib/api"

const EXAMPLE_SITUATIONS = [
  "Runner on 1st, 2 outs, down 1, top 9th",
  "Runner on 2nd, 0 outs, tied, bottom 7th",
  "Runner on 1st & 2nd, 1 out, up 3, 5th inning",
]

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Set the situation",
    body: "Inning, outs, count, base state, and who's on the mound and behind the plate.",
  },
  {
    step: "2",
    title: "Pick the players",
    body: "Runner speed, pitcher hold times, and catcher pop time, pulled from 2023-2025 Statcast data.",
  },
  {
    step: "3",
    title: "Get a GO or HOLD call",
    body: "The model's predicted success rate is checked against the situation's break-even rate.",
  },
]

const previewStat = BACKTEST_LAYERS[0]

export default function HomePage() {
  // Same head start as PredictorPage's warmup ping, fired even earlier --
  // people typically spend longer reading Home than filling out the
  // Situation form, so this often fully covers a cold Render instance's
  // wake-up before they ever reach Predictor. Direct links to /predictor
  // (nav "Try it", bookmarks, shared links) never render Home, so that
  // page's own prefetch stays in place too -- this is additive, not a
  // replacement.
  useEffect(() => {
    warmBackend()
  }, [])

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-20 px-6 py-16">
      <section className="flex flex-col gap-6">
        <DiamondField className="h-10 w-10 text-brand-navy" />
        <TextEffect
          as="h1"
          per="word"
          preset="fade"
          className="text-4xl font-semibold tracking-tight text-foreground sm:text-6xl"
        >
          Should They Steal?
        </TextEffect>
        <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
          A success-probability model and break-even decision layer, trained
          on MLB play-by-play, that tells you whether a stolen-base attempt
          is worth it.
        </p>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>e.g.</span>
          <TextLoop className="font-medium text-foreground">
            {EXAMPLE_SITUATIONS.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </TextLoop>
        </div>

        <div>
          <Button asChild size="lg">
            <NavLink to="/predictor">Get a recommendation</NavLink>
          </Button>
        </div>
      </section>

      <section>
        <h2 className="stat-label mb-4">How it works</h2>
        <AnimatedGroup
          preset="blur-slide"
          className="divide-y divide-border border-y border-border"
        >
          {HOW_IT_WORKS.map((item) => (
            <div key={item.step} className="flex gap-6 py-6">
              <div className="font-mono text-2xl font-semibold text-muted-foreground stat-value">
                {item.step}
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">{item.body}</p>
              </div>
            </div>
          ))}
        </AnimatedGroup>
      </section>

      <section>
        <InView once viewOptions={{ margin: "-100px" }}>
          <div className="border-t border-border pt-10">
            <p className="stat-label mb-2">
              Backtested against 2,714 held-out outcomes
            </p>
            <div className="flex items-baseline gap-1 text-5xl font-semibold stat-value">
              <span>+</span>
              <SlidingNumber value={previewStat.modelPolicy} decimalSeparator="." />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              expected runs added per attempt over the historical policy,
              RE24 situations
            </p>
            <Button asChild variant="outline" className="mt-6">
              <NavLink to="/model-performance">See the full backtest</NavLink>
            </Button>
          </div>
        </InView>
      </section>
    </div>
  )
}
