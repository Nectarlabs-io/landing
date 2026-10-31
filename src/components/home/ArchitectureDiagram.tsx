import { Fragment, type ReactNode } from "react";

import { cx } from "@/lib/cx";

import styles from "./ArchitectureDiagram.module.css";

/*
 * How a position closes, drawn on a fixed 1152 × 568 canvas.
 * Coordinates are in CSS px from the top-left of the canvas.
 */

type Node = {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  detail: string;
  kind?: "decision" | "settle";
};

const NODES: Node[] = [
  { x: 24, y: 56, w: 192, h: 88, title: "Lending markets", detail: "Nectar's own, or Morpho, Euler, Aave" },
  { x: 312, y: 56, w: 192, h: 88, title: "Nectar Keepers", detail: "watch every position" },
  { x: 600, y: 36, w: 224, h: 128, title: "Nectar Route", detail: "pool deep enough?", kind: "decision" },
  { x: 944, y: 56, w: 184, h: 88, title: "DEX or prop AMM", detail: "liquidate and fill in one transaction" },
  { x: 616, y: 276, w: 192, h: 88, title: "Pappus", detail: "settles against committed quotes", kind: "settle" },
  { x: 944, y: 276, w: 184, h: 88, title: "Buyers", detail: "funded quotes; Nectar Reserve fills last" },
  { x: 616, y: 456, w: 192, h: 88, title: "Nectar Feed", detail: "committed capacity, onchain" },
  { x: 24, y: 456, w: 192, h: 88, title: "Borrowing limit", detail: "oracle limit vs recoverable value" },
];

type Edge = { d: string; tone: "dim" | "accent"; arrow?: boolean; flow?: boolean };

const EDGES: Edge[] = [
  { d: "M216 100 L307 100", tone: "dim", arrow: true },
  { d: "M504 100 L595 100", tone: "dim", arrow: true },
  { d: "M824 100 L939 100", tone: "dim", arrow: true },
  { d: "M712 164 L712 271", tone: "accent", arrow: true, flow: true },
  { d: "M944 305 L813 305", tone: "accent", arrow: true, flow: true },
  { d: "M808 335 L939 335", tone: "dim", arrow: true },
  { d: "M616 320 L152 320", tone: "accent", flow: true },
  { d: "M152 320 L152 149", tone: "accent", arrow: true, flow: true },
  { d: "M712 364 L712 451", tone: "dim", arrow: true },
  { d: "M616 500 L221 500", tone: "dim", arrow: true },
  { d: "M88 456 L88 149", tone: "dim", arrow: true },
];

type Label = { x: number; y: number; w: number; text: string; accent?: boolean; center?: boolean };

const LABELS: Label[] = [
  { x: 228, y: 72, w: 72, text: "at risk", center: true },
  { x: 836, y: 72, w: 96, text: "deep enough", center: true },
  { x: 724, y: 211, w: 72, text: "too thin", accent: true },
  { x: 824, y: 277, w: 104, text: "funded quote", accent: true, center: true },
  { x: 832, y: 347, w: 88, text: "collateral", center: true },
  { x: 360, y: 292, w: 96, text: "debt repaid", accent: true, center: true },
  { x: 724, y: 401, w: 136, text: "published onchain" },
  { x: 356, y: 472, w: 120, text: "reads capacity", center: true },
  { x: 100, y: 392, w: 88, text: "sets limits" },
];

/** Dots that travel along the main flow lines. */
const RUNNERS = [
  { x: 216, y: 96, w: 95, h: 8, axis: "x", delay: 0 },
  { x: 504, y: 96, w: 95, h: 8, axis: "x", delay: 0.6 },
  { x: 708, y: 164, w: 8, h: 111, axis: "y", delay: 1.2 },
  { x: 809, y: 301, w: 135, h: 8, axis: "x", delay: 0.3, reverse: true },
] as const;

const DESCRIPTION =
  "Architecture: lending markets to Nectar Keepers to Nectar Route. If DEX or prop AMM depth is enough, the position is liquidated and filled there. If too thin, Pappus settles against committed quotes from buyers, with Nectar Reserve last, repays the debt to the market and delivers collateral to the buyer. Pappus publishes committed capacity to Nectar Feed, which sets each borrowing limit: the lower of the oracle limit and recoverable value.";

type Step = { content: ReactNode; kind?: "decision" | "settle"; arrowBefore?: ReactNode };

const STEPS: Step[] = [
  {
    content: (
      <>
        <b>Lending markets</b>, Nectar&apos;s own or Morpho, Euler and Aave. A position is at risk.
      </>
    ),
  },
  {
    content: (
      <>
        <b>Nectar Keepers</b> flag it.
      </>
    ),
  },
  {
    kind: "decision",
    content: (
      <>
        <b>Nectar Route</b> checks DEX and prop AMM depth. Deep enough: liquidate and fill in one
        transaction.
      </>
    ),
  },
  {
    kind: "settle",
    arrowBefore: "↓ too thin",
    content: (
      <>
        <b>Pappus</b> settles against committed quotes, Nectar Reserve last: the debt is repaid,
        the buyer gets the collateral.
      </>
    ),
  },
  {
    content: (
      <>
        <b>Nectar Feed</b> publishes committed capacity, and each borrowing limit is set from it.
      </>
    ),
  },
];

export function ArchitectureDiagram() {
  return (
    <>
      <div className={cx(styles.wide, "dotted-grid")}>
        <div role="img" aria-label={DESCRIPTION} className={styles.canvas}>
          <svg className={styles.lines} width="1152" height="568" viewBox="0 0 1152 568" aria-hidden="true">
            <defs>
              <ArrowHead id="arch-arrow-dim" className={styles.arrowDim} />
              <ArrowHead id="arch-arrow-accent" className={styles.arrowAccent} />
            </defs>
            {EDGES.map((edge) => (
              <path
                key={edge.d}
                d={edge.d}
                className={cx(styles[edge.tone], edge.flow && "flow-dash")}
                markerEnd={edge.arrow ? `url(#arch-arrow-${edge.tone})` : undefined}
              />
            ))}
          </svg>

          {RUNNERS.map((runner) => (
            <div
              key={`${runner.x}-${runner.y}`}
              aria-hidden="true"
              className={styles.track}
              style={{ left: runner.x, top: runner.y, width: runner.w, height: runner.h }}
            >
              <div
                className={cx(
                  styles.runner,
                  runner.axis === "x" ? styles.runnerX : styles.runnerY,
                  runner.axis === "x" ? "run-x" : "run-y",
                  "reverse" in runner && runner.reverse && "run-reverse",
                )}
                style={{ animationDelay: `${runner.delay}s` }}
              />
            </div>
          ))}

          {NODES.map((node) => (
            <div
              key={node.title}
              className={cx(
                styles.node,
                node.kind === "decision" && styles.decision,
                node.kind === "settle" && styles.settle,
              )}
              style={{ left: node.x, top: node.y, width: node.w, height: node.h }}
            >
              <span>
                <b>{node.title}</b>
                <br />
                {node.detail}
              </span>
            </div>
          ))}

          {LABELS.map((label) => (
            <div
              key={label.text}
              className={cx(
                styles.label,
                label.accent && styles.labelAccent,
                label.center && styles.center,
              )}
              style={{ left: label.x, top: label.y, width: label.w }}
            >
              {label.text}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.narrow} role="list" aria-label="How a position closes">
        {STEPS.map((step, index) => (
          <Fragment key={index}>
            {index > 0 && (
              <div aria-hidden="true" className={cx(styles.arrow, step.arrowBefore != null && styles.arrowBranch)}>
                {step.arrowBefore ?? "↓"}
              </div>
            )}
            <div
              role="listitem"
              className={cx(
                styles.step,
                step.kind === "decision" && styles.stepDecision,
                step.kind === "settle" && styles.stepSettle,
              )}
            >
              {step.content}
            </div>
          </Fragment>
        ))}
      </div>
    </>
  );
}

function ArrowHead({ id, className }: { id: string; className: string }) {
  return (
    <marker id={id} orient="auto" markerWidth="5" markerHeight="5" refX="2" refY="2" overflow="visible">
      <path d="M0 0 L4 2 L0 4 Z" className={className} stroke="none" />
    </marker>
  );
}
