import React from "react";
import { MECHANIC_CATEGORIES, MECHANIC_CATEGORY_COLOURS } from "./MechanicCategoryBadge";

export interface MechanicCategorySummary {
  period: string;
  updatedAt: string | null;
  total: { count: number; points: number; avgPoints: number };
  categories: Array<{ category: string; count: number; share: number; points: number; avgPoints: number }>;
}

interface Props {
  summary: MechanicCategorySummary | null;
  // categories the customer list is filtered on; every category = "All Mechanics"
  selected: string[];
  onSelect: (categories: string[]) => void;
}

const number = (n: number) => Math.round(n || 0).toLocaleString("en-IN");
const share = (s: number) => {
  const pct = (s || 0) * 100;
  return (pct > 0 && pct < 1 ? pct.toFixed(1) : Math.round(pct).toString()) + "%";
};

const css = `
.mct { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 14px; margin-bottom: 18px; }
@media (max-width: 1399px) { .mct { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (max-width: 767px) { .mct { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.mct-tile { position: relative; text-align: left; background: #fff; border: 1px solid #eceef2; border-radius: 16px; padding: 16px 18px; overflow: hidden; cursor: pointer; transition: box-shadow .15s, transform .15s, border-color .15s; width: 100%; }
.mct-tile:hover { box-shadow: 0 6px 18px rgba(15,23,42,.08); transform: translateY(-1px); }
.mct-tile.on { border: 2px solid #111827; padding: 15px 17px; box-shadow: 0 6px 18px rgba(15,23,42,.10); }
.mct-tile .bar { position: absolute; left: 0; right: 0; top: 0; height: 4px; }
.mct-name { font-size: 13px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
.mct-count { display: flex; align-items: center; gap: 8px; margin-top: 6px; }
.mct-count b { font-size: 30px; font-weight: 800; color: #111827; line-height: 1.1; }
.mct-share { font-size: 12px; font-weight: 700; padding: 2px 8px; border-radius: 999px; background: #f3f4f6; color: #111827; }
.mct-meta { font-size: 13px; color: #6b7280; line-height: 1.5; margin-top: 6px; }
.mct-head { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 8px; margin-bottom: 10px; }
.mct-head h6 { margin: 0; font-weight: 700; }
.mct-head span { font-size: 12px; color: #6b7280; }
.mct-clear { border: 0; background: none; color: #2563eb; font-size: 13px; font-weight: 600; padding: 0; }
`;

// Mechanics per loyalty category (as on the SFA loyalty dashboard); a click filters the customer list
export default function MechanicCategoryTiles({ summary, selected, onSelect }: Props) {
  if (!summary) return null;
  const all = MECHANIC_CATEGORIES.every((c) => selected.includes(c));
  const only = selected.length === 1 ? selected[0] : "";
  const tiles = [
    { key: "all", label: "All Mechanics", colour: "#111827", count: summary.total.count, points: summary.total.points, avg: summary.total.avgPoints, share: null as number | null },
    ...summary.categories.map((c) => ({
      key: c.category,
      label: c.category,
      colour: MECHANIC_CATEGORY_COLOURS[c.category],
      count: c.count,
      points: c.points,
      avg: c.avgPoints,
      share: c.share,
    })),
  ];
  return (
    <div>
      <style>{css}</style>
      <div className="mct-head">
        <h6>
          Mechanic Category{" "}
          {summary.period ? <span>· {summary.period}</span> : null}
        </h6>
        {selected.length ? (
          <button type="button" className="mct-clear" onClick={() => onSelect([])}>
            Clear category filter
          </button>
        ) : (
          <span>Click a tile to see those mechanics</span>
        )}
      </div>
      <div className="mct">
        {tiles.map((tile) => {
          const on = tile.key === "all" ? all : only === tile.key;
          return (
            <button
              key={tile.key}
              type="button"
              className={"mct-tile" + (on ? " on" : "")}
              onClick={() => onSelect(on ? [] : tile.key === "all" ? [...MECHANIC_CATEGORIES] : [tile.key])}
              title={on ? "Click again to remove the filter" : "Show only these mechanics"}
            >
              {tile.key !== "all" ? <span className="bar" style={{ background: tile.colour }} /> : null}
              <div className="mct-name" style={{ color: tile.key === "all" ? "#111827" : tile.colour }}>
                {tile.label}
              </div>
              <div className="mct-count">
                <b>{number(tile.count)}</b>
                {tile.share !== null ? <span className="mct-share">{share(tile.share)}</span> : null}
              </div>
              <div className="mct-meta">
                {number(tile.points)} pts
                <br />
                avg {number(tile.avg)} / mechanic
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
