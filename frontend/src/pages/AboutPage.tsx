import { NavLink } from "react-router"
import { Button } from "@/components/ui/button"

function ExampleStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-border py-2 last:border-b-0">
      <div className="stat-label">{label}</div>
      <div className="text-lg font-semibold stat-value">{value}</div>
    </div>
  )
}

export default function AboutPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-16">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          About this project
        </h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          This tool predicts whether a base runner should attempt a steal in
          a given situation. It's an independent research project and is not
          affiliated with, endorsed by, or sponsored by MLB or any team.
        </p>
      </header>

      <section>
        <h2 className="mb-3 text-xl font-semibold text-foreground">
          How the model works
        </h2>
        <div className="flex flex-col gap-4 leading-relaxed text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">
              Success-probability model.
            </span>{" "}
            A model trained on runner, pitcher, catcher, and situation
            features predicts the probability that a given steal attempt
            succeeds.
          </p>
          <p>
            <span className="font-medium text-foreground">
              Break-even decision layer.
            </span>{" "}
            That probability is compared against a situational break-even
            rate derived from run expectancy (RE24) for most of the game.
            Late and close situations switch to a win-probability framework
            instead, since RE24's run-based math understates the cost of a
            caught stealing that ends a trailing team's last chance.
          </p>
          <p>
            <span className="font-medium text-foreground">
              Why logistic regression, not XGBoost.
            </span>{" "}
            Both a logistic-regression baseline and an XGBoost model were
            trained on the same features, tested on a chronological holdout
            so no future data leaked into training. The two land within
            noise of each other: logistic regression scores a 0.4857 log
            loss and 0.6789 AUC, XGBoost scores 0.4838 and 0.6762, and
            logistic regression actually edges XGBoost on AUC. Since the
            simpler model wasn't worse, it's the one that ships. The
            production API serves the logistic-regression model, with no
            Python process involved at request time.
          </p>
        </div>
      </section>

      <section className="border-t-2 border-border pt-6">
        <h2 className="mb-2 text-lg font-semibold text-foreground">
          Backtested against held-out outcomes
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          The model was tested against all 2,714 steal attempts held out
          from the 2025 season, not a hand-picked sample.
        </p>
        <Button asChild variant="outline" size="sm">
          <NavLink to="/model-performance">See the full backtest</NavLink>
        </Button>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold text-foreground">
          Worked example
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          Fourth inning, top half, one out, runner on first, batting team up
          by two. Bobby Witt (75.9% prior success, 30.2 ft/s sprint speed) is
          on first, facing Cole Ragans (allowed steals at a 71.0% rate) with
          J. T. Realmuto (1.86s pop time) catching. Witt breaks for second.
        </p>
        <div className="flex flex-col">
          <ExampleStat label="Model's predicted success" value="70.4%" />
          <ExampleStat label="Break-even needed" value="73.7%" />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          70.4% doesn't clear the 73.7% bar this situation demands, so the
          call is HOLD, priced off run expectancy (RE24) since the game is
          neither late nor close. One of MLB's fastest runners still isn't
          enough on its own: the break-even rate is what a specific
          situation asks for, and a high success rate only matters relative
          to that number.
        </p>
      </section>

      <section className="border-t-2 border-border pt-6">
        <h2 className="mb-2 text-lg font-semibold text-foreground">
          Data &amp; attribution
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          The information used here was obtained free of charge from and is
          copyrighted by Retrosheet. Interested parties may contact
          Retrosheet at{" "}
          <a
            href="https://www.retrosheet.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            www.retrosheet.org
          </a>
          . Player tracking data (sprint speed, pop time) is sourced from
          MLB Statcast.
        </p>
      </section>
    </div>
  )
}
