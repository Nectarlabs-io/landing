import type { Metadata } from "next";
import Link from "next/link";

import { AppPage, PageIntro } from "@/components/app/AppPage";
import { StatGrid } from "@/components/app/StatGrid";
import styles from "@/components/keepers/Keepers.module.css";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DataTable, cell } from "@/components/ui/DataTable";
import { Kicker } from "@/components/ui/Typography";
import { cx } from "@/lib/cx";
import { routes, site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Nectar Keepers — operators and races" },
  description:
    "Keepers watch positions and trigger routes, bonded in USDC. Several race for each fill; the winner settles.",
};

// Placeholder until bond sizes are set.
const MIN_BOND = "[MIN BOND]";

const OPERATORS = [
  { name: "keeper-alpha", runBy: "Nectar", network: "Testnet", bond: "[BOND]" },
  { name: "keeper-beta", runBy: "Nectar", network: "Testnet", bond: "[BOND]" },
];

const FILL_STEPS = [
  { label: "01 · DRAW", text: "The keeper draws USDC from NectarVault against its bond." },
  { label: "02 · RACE", text: "Keepers submit fills on the same auction at the same time." },
  {
    label: "03 · WIN OR RETURN",
    text: "The first fill lands. The rest get AlreadyFilled and return their draw.",
  },
  {
    label: "04 · SETTLE",
    text: "The winner returns the draw plus proceeds before the deadline, or part of its bond moves to the vault.",
  },
];

const RACES: Array<{
  venue: string;
  window: string;
  liquidations: string;
  repaid: string;
  liquidators: string;
  note: string;
  nectar: "observing" | "testnet";
}> = [
  {
    venue: "Morpho · large deployment",
    window: "90 days",
    liquidations: "4,244",
    repaid: "$12.48M",
    liquidators: "264",
    note: "Aave alongside it routes through Chainlink SVR",
    nectar: "observing",
  },
  {
    venue: "Morpho · stock-token deployment",
    window: "All time",
    liquidations: "534",
    repaid: "≈ $956K",
    liquidators: "123",
    note: "Stock-token markets: about $110 in total",
    nectar: "observing",
  },
  {
    venue: "Morpho and Aave V4 · new deployment",
    window: "About 6 weeks",
    liquidations: "8",
    repaid: "Under $1K",
    liquidators: "7",
    note: "$274M of cirBTC behind ≈ $24M of DEX depth",
    nectar: "observing",
  },
  {
    venue: "Blend V2",
    window: "12 months",
    liquidations: "190 fills",
    repaid: "≈ $116K",
    liquidators: "13 ever",
    note: "Top two fillers did 68%; about $27K of gross spread",
    nectar: "testnet",
  },
];

export default function KeepersPage() {
  return (
    <AppPage gap={40}>
      <PageIntro
        eyebrow="NECTAR KEEPERS"
        title="Keepers that compete, bonded in USDC"
        lead="Keepers watch positions and trigger routes. Several race for each fill: the winner settles, the rest return their draw. A draw not returned in time is slashed to the vault."
        aside={
          <Badge tone="live" size="lg">
            Testnet
          </Badge>
        }
      />

      <StatGrid
        stats={[
          {
            label: "OPERATORS REGISTERED",
            value: "0",
            note: "keeper-alpha and keeper-beta configured",
          },
          { label: "BOND ASSET", value: "USDC", note: `Minimum ${MIN_BOND}`, noteTone: "warn" },
          {
            label: "CONTRACTS",
            value: "KeeperRegistry · NectarVault",
            note: "Blend pool on testnet, mock oracle",
            small: true,
          },
          { label: "OUTSIDE OPERATORS", value: "H2 2027", note: "Open-network phase of the roadmap" },
        ]}
      />

      <section aria-labelledby="ops-h" className={styles.block}>
        <div className={styles.blockHead}>
          <h2 id="ops-h" className={styles.title}>
            Operators
          </h2>
          <span className={styles.meta}>Live figures load from the keeper API</span>
        </div>
        <DataTable minWidth={1040} headerBg aria-labelledby="ops-h">
          <thead>
            <tr>
              <th scope="col">OPERATOR</th>
              <th scope="col">RUN BY</th>
              <th scope="col">NETWORK</th>
              <th scope="col" className={cell.num}>
                BOND
              </th>
              <th scope="col" className={cell.num}>
                FILLS · 30D
              </th>
              <th scope="col" className={cell.num}>
                WON
              </th>
              <th scope="col" className={cell.num}>
                RETURNED ON TIME
              </th>
              <th scope="col" className={cell.num}>
                SLASHED
              </th>
              <th scope="col">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {OPERATORS.map((operator) => (
              <tr key={operator.name}>
                <td className={cell.strong}>{operator.name}</td>
                <td data-label="RUN BY">{operator.runBy}</td>
                <td data-label="NETWORK">{operator.network}</td>
                <td data-label="BOND" className={cx(cell.num, cell.warn)}>
                  {operator.bond}
                </td>
                <td data-label="FILLS · 30D" className={cx(cell.num, cell.dim)}>
                  —
                </td>
                <td data-label="WON" className={cx(cell.num, cell.dim)}>
                  —
                </td>
                <td data-label="RETURNED ON TIME" className={cx(cell.num, cell.dim)}>
                  —
                </td>
                <td data-label="SLASHED" className={cx(cell.num, cell.dim)}>
                  —
                </td>
                <td data-label="STATUS">
                  <Badge tone="dashed" size="md">
                    Not registered
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </section>

      <section aria-labelledby="race-h" className={cx(styles.block, styles.blockLoose)}>
        <h2 id="race-h" className={styles.title}>
          How a fill is won
        </h2>
        <ol className={styles.steps}>
          {FILL_STEPS.map((step, index) => {
            const last = index === FILL_STEPS.length - 1;
            return (
              <Card
                key={step.label}
                as="li"
                tone={last ? "accent" : "plain"}
                strong={!last}
                padding="20px"
                gap={8}
              >
                <Kicker tone={last ? "accent" : "dim"}>{step.label}</Kicker>
                <span className={styles.stepText}>{step.text}</span>
              </Card>
            );
          })}
        </ol>
        <p className={styles.footnote}>
          On Blend, an auction scales the lot over its first 200 ledgers and the bid over the next
          200. Mainnet fills land at a median of ledger 185 of 400. Timing is re-checked after the
          Protocol 30 vote on Nov 23, 2026.
        </p>
      </section>

      <section aria-labelledby="where-h" className={styles.block}>
        <div className={styles.blockIntro}>
          <h2 id="where-h" className={styles.title}>
            Open races are crowded or nearly empty
          </h2>
          <p className={styles.text}>
            So Nectar keepers serve designated markets and funded quotes rather than chasing open
            races.
          </p>
        </div>
        <DataTable minWidth={1040} headerBg density="cozy" aria-labelledby="where-h">
          <thead>
            <tr>
              <th scope="col">VENUE</th>
              <th scope="col">WINDOW</th>
              <th scope="col" className={cell.num}>
                LIQUIDATIONS
              </th>
              <th scope="col" className={cell.num}>
                REPAID
              </th>
              <th scope="col" className={cell.num}>
                LIQUIDATORS
              </th>
              <th scope="col">NOTE</th>
              <th scope="col">NECTAR</th>
            </tr>
          </thead>
          <tbody>
            {RACES.map((race) => (
              <tr key={race.venue}>
                <td className={cell.strong}>{race.venue}</td>
                <td data-label="WINDOW">{race.window}</td>
                <td data-label="LIQUIDATIONS" className={cx(cell.num, cell.strong)}>
                  {race.liquidations}
                </td>
                <td data-label="REPAID" className={cx(cell.num, cell.strong)}>
                  {race.repaid}
                </td>
                <td data-label="LIQUIDATORS" className={cx(cell.num, cell.strong)}>
                  {race.liquidators}
                </td>
                <td data-label="NOTE">{race.note}</td>
                <td data-label="NECTAR">
                  {race.nectar === "testnet" ? (
                    <Badge tone="live" size="md">
                      Testnet keepers
                    </Badge>
                  ) : (
                    "Observing"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </DataTable>
        <span className={styles.meta}>
          Sources: Morpho Blue API (Oct 25, 2026), RPC nodes and block explorers, Blend onchain
          events, Aave governance.
        </span>
      </section>

      <div className={styles.bottom}>
        <Card
          as="section"
          aria-labelledby="run-h"
          gap={16}
          compactOnMobile
          className={styles.run}
        >
          <h2 id="run-h" className={cx(styles.title, styles.titleSm)}>
            Run a keeper
          </h2>
          <ol className={styles.list}>
            <li>Install the Go keeper daemon from the Keeper SDK.</li>
            <li>Bond at least {MIN_BOND} USDC in KeeperRegistry.</li>
            <li>Point the daemon at an RPC for each chain you cover.</li>
            <li>
              Start in shadow mode: the daemon logs the calls it would make without drawing capital.
            </li>
          </ol>
          <div className={styles.ctaRow}>
            <ButtonLink href={site.docsUrl} size="md">
              Read the Keeper SDK
            </ButtonLink>
            <ButtonLink href={site.githubUrl} size="md" variant="secondary">
              GitHub
            </ButtonLink>
          </div>
          <span className={styles.meta}>
            Outside operators join in the open-network phase. Until then, the network runs
            Nectar&apos;s own keepers. Want to run one in the pilot?{" "}
            <Link href={routes.contact}>Talk to us</Link>.
          </span>
        </Card>
        <Card
          as="section"
          tone="warn"
          aria-labelledby="slash-h"
          gap={12}
          compactOnMobile
          className={styles.slash}
        >
          <h2 id="slash-h" className={cx(styles.title, styles.titleSm)}>
            When a bond is slashed
          </h2>
          <ul className={cx(styles.list, styles.slashList)}>
            <li>A draw not returned before its deadline: part of the bond moves to NectarVault.</li>
            <li>
              Losing a race is not slashed. The draw goes back and the keeper pays only its
              transaction fee.
            </li>
            <li>Bonds are USDC, never a volatile token, so a slash is worth what it says.</li>
          </ul>
        </Card>
      </div>
    </AppPage>
  );
}
