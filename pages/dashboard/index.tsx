import { ReactNode, useEffect, useMemo, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import {
  ArrowRepeat,
  BarChartLine,
  ExclamationTriangle,
  Gift,
  ImageAlt,
  People,
  QrCode,
  Wallet2,
} from "react-bootstrap-icons";
import Link from "next/link";
import Layout from "../../components/Layout";
import BreadcrumbComponent from "../../components/Common/BreadcrumbComponent";
import {
  backendGetDashboardOverview,
  backendGetMechanicCategorySummary,
} from "../../helpers/backend_helper";
import { MechanicCategorySummary } from "../../components/Customer/MechanicCategoryTiles";
import { MECHANIC_CATEGORY_COLOURS } from "../../components/Customer/MechanicCategoryBadge";

type CustomerType = "Mechanic" | "Retailer";

interface TrendRow {
  month: string;
  scannedPoints: number;
  scans: number;
  activeCustomers: number;
  redeemedPoints: number;
  redemptions: number;
  newCustomers: number;
  damageEntries: number;
}

// Activity numbers for one range: all time, or the period chosen at the top
interface Stats {
  activeCustomers: number;
  newCustomers: number;
  points: {
    earned: number;
    scanned: number;
    welcome: number;
    welcomeCustomers: number;
    welcomeExcluded: number;
    other: number;
    redeemed: number;
    balance: number;
  };
  coupons: { generated: number; scanned: number; scans: number };
  redemptions: {
    byStatus: Array<{ status: string; count: number; points: number }>;
    byMethod: Array<{ method: string; count: number; points: number }>;
  };
  damage: {
    total: number;
    Pending: number;
    Approved: number;
    Rejected: number;
    Hold: number;
    customers: number;
    oldestPendingAt: string | null;
  };
  topCustomers: Array<{
    _id: string;
    firmName: string;
    contactPerson: string;
    mobile: string;
    city: string;
    state: string;
    category: string;
    points: number;
    scans: number;
  }>;
}

interface Overview {
  customers: { total: number; selfRegistered: number; appUsers: number; blocked: number };
  allTime: Stats;
  selected: Stats | null;
  trend: TrendRow[];
  topStates: Array<{ state: string; customers: number }>;
}

type PeriodKey = "all" | "month" | "3m" | "fy" | "custom";
const PERIODS: Array<{ key: PeriodKey; label: string }> = [
  { key: "all", label: "All time" },
  { key: "month", label: "This month" },
  { key: "3m", label: "Last 3 months" },
  { key: "fy", label: "This financial year" },
  { key: "custom", label: "Custom range" },
];
const QUICK_PERIODS: PeriodKey[] = ["month", "3m", "fy"];

const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const periodRange = (key: PeriodKey, custom: { from: string; to: string }) => {
  const today = new Date();
  if (key === "month") return { from: ymd(new Date(today.getFullYear(), today.getMonth(), 1)), to: ymd(today) };
  if (key === "3m") return { from: ymd(new Date(today.getFullYear(), today.getMonth() - 2, 1)), to: ymd(today) };
  if (key === "fy") {
    // Indian financial year starts on 1 April
    const startYear = today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;
    return { from: ymd(new Date(startYear, 3, 1)), to: ymd(today) };
  }
  if (key === "custom") return custom;
  return { from: "", to: "" };
};

const num = (n: number) => Math.round(n || 0).toLocaleString("en-IN");
const pct = (part: number, whole: number) =>
  whole ? `${((part / whole) * 100).toFixed(part / whole < 0.1 ? 1 : 0)}%` : "0%";
const share = (part: number, whole: number) => Math.min(100, whole ? (part / whole) * 100 : 0);
const shortDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const monthLabel = (m: string) => {
  const [y, mo] = m.split("-").map(Number);
  return new Date(y, mo - 1, 1).toLocaleDateString("en-IN", { month: "short" }) + (mo === 1 ? ` ${String(y).slice(2)}` : "");
};

// Upper-cased redemption statuses from the API, in workflow order
const REDEMPTION_STAGES: Array<{ keys: string[]; label: string; hint: string; tone: Tone }> = [
  { keys: ["PENDING", "OPEN"], label: "Pending approval", hint: "waiting for approval", tone: "warn" },
  { keys: ["APPROVED"], label: "Pending transfer", hint: "approved, not paid yet", tone: "info" },
  { keys: ["UNDER PROCESS", "PROCESSING"], label: "Under process", hint: "payment in progress", tone: "info" },
  { keys: ["SUCCESS"], label: "Successful", hint: "paid out", tone: "good" },
  { keys: ["REJECTED", "FAIL", "FAILED"], label: "Rejected / failed", hint: "points returned", tone: "bad" },
];

type Tone = "accent" | "warn" | "info" | "good" | "bad";

const css = `
.gd { --ink: #111827; --ink-2: #4b5563; --muted: #6b7280; --line: #e7e9ee; --card: #fff; --accent: #4f46e5; --accent-soft: #eef2ff; --tint: #f8f9ff; --tint-line: #e0e4ff; }
.gd-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px; margin: 8px 0 22px; }
.gd-head h3 { margin: 0; font-weight: 800; color: var(--ink); }
.gd-head p { margin: 2px 0 0; color: var(--muted); font-size: 13px; }
.gd-tabs { display: inline-flex; background: #eef0f4; border-radius: 12px; padding: 4px; gap: 4px; }
.gd-tabs button { border: 0; background: transparent; padding: 8px 22px; border-radius: 9px; font-weight: 600; color: var(--ink-2); font-size: 14px; }
.gd-tabs button.on { background: #fff; color: var(--ink); box-shadow: 0 1px 3px rgba(15,23,42,.12); }
.gd-filters { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.gd-filters .form-select, .gd-filters .form-control { width: auto; min-width: 150px; border-radius: 10px; font-size: 14px; }
.gd-refresh { border: 1px solid var(--line); background: #fff; border-radius: 10px; width: 38px; height: 38px; display: inline-flex; align-items: center; justify-content: center; color: var(--ink-2); }
.gd-error { display: flex; align-items: center; gap: 10px; background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; border-radius: 12px; padding: 12px 16px; margin-bottom: 18px; font-size: 14px; }
.gd-error button { margin-left: auto; border: 1px solid #fecaca; background: #fff; color: #991b1b; border-radius: 8px; padding: 4px 12px; font-weight: 600; }
.gd-loading { opacity: .55; pointer-events: none; transition: opacity .15s; }
.gd-skel { display: inline-block; width: 90px; max-width: 100%; height: 1em; border-radius: 6px; vertical-align: middle; background: linear-gradient(90deg,#f1f2f6,#e7e9ee,#f1f2f6); background-size: 200% 100%; animation: gdsk 1.2s infinite; }
@keyframes gdsk { from { background-position: 200% 0; } to { background-position: -200% 0; } }

.gd-section { margin-bottom: 22px; }
.gd-panel { background: var(--card); border: 1px solid var(--line); border-radius: 18px; padding: 20px 22px; box-shadow: 0 1px 2px rgba(15,23,42,.04); min-width: 0; }
.gd-panel-head { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-bottom: 16px; }
.gd-panel-head h5 { margin: 0; font-size: 16px; font-weight: 700; color: var(--ink); }
.gd-panel-head span { font-size: 12.5px; color: var(--muted); }
.gd-panel-head .gd-head-extra { margin-left: auto; display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
.gd-ico { width: 38px; height: 38px; border-radius: 11px; background: var(--accent-soft); color: var(--accent); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
.gd-ico svg { width: 18px; height: 18px; }
.gd-link { font-size: 13px; font-weight: 600; color: var(--accent); text-decoration: none; white-space: nowrap; }
.gd-link:hover { text-decoration: underline; }

.gd-compare { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.gd-compare.wide-left { grid-template-columns: 3fr 2fr; }
@media (max-width: 1199px) { .gd-compare, .gd-compare.wide-left { grid-template-columns: 1fr; } }
.gd-block { border: 1px solid var(--line); border-radius: 14px; padding: 16px 18px; min-width: 0; display: flex; flex-direction: column; }
.gd-block.tinted { background: var(--tint); border-color: var(--tint-line); }
.gd-block-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 16px; }
.gd-block-head b { font-size: 12.5px; text-transform: uppercase; letter-spacing: .06em; color: var(--ink-2); }
.gd-block-head small { display: block; font-size: 11.5px; color: var(--muted); font-weight: 500; text-transform: none; letter-spacing: 0; margin-top: 2px; }
.gd-note { font-size: 11.5px; font-weight: 600; padding: 3px 9px; border-radius: 999px; background: #f1f2f6; color: var(--muted); white-space: nowrap; }
.gd-note.on { background: var(--accent-soft); color: var(--accent); }
.gd-pick { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 12px; padding: 18px 8px; color: var(--ink-2); font-size: 13.5px; }
.gd-pick div { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.gd-pick button { border: 1px solid var(--tint-line); background: #fff; color: var(--accent); font-weight: 600; font-size: 13px; padding: 6px 14px; border-radius: 999px; }
.gd-pick button:hover { background: var(--accent-soft); }

.lbl { display: block; font-size: 12.5px; font-weight: 600; color: var(--muted); }
.gd-sub { display: block; font-size: 12px; color: var(--muted); margin-top: 2px; }
.gd-big { margin-bottom: 16px; }
.gd-big .v { display: block; font-size: 34px; font-weight: 800; color: var(--ink); line-height: 1.15; margin: 4px 0 2px; font-variant-numeric: tabular-nums; letter-spacing: -.01em; }
.gd-metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 18px; }
.gd-meter-head { display: flex; align-items: baseline; flex-wrap: wrap; gap: 8px; margin: 4px 0 8px; }
.gd-meter-head b { font-size: 22px; font-weight: 800; color: var(--ink); font-variant-numeric: tabular-nums; }
.gd-pctchip { font-size: 12px; font-weight: 700; color: var(--ink-2); background: #eef0f4; padding: 1px 8px; border-radius: 999px; }
.gd-track { height: 8px; background: #eef0f4; border-radius: 4px; overflow: hidden; display: flex; }
.gd-track > div { height: 100%; border-radius: 4px; transition: width .3s; background: var(--accent); }
.gd-track.warn > div { background: #d97706; } .gd-track.good > div { background: #059669; } .gd-track.info > div { background: #2563eb; } .gd-track.bad > div { background: #dc2626; }
.gd-track.lg { height: 12px; border-radius: 6px; margin-top: 12px; }
.gd-divider { height: 1px; background: var(--line); margin: 18px 0 14px; }
.gd-block.tinted .gd-divider { background: var(--tint-line); }
.gd-sublabel { font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); margin-bottom: 10px; }
.gd-stack { display: flex; gap: 2px; height: 12px; border-radius: 6px; overflow: hidden; background: #eef0f4; }
.gd-stack > div { height: 100%; min-width: 3px; }
.gd-legend { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 10px; margin-top: 10px; }
.gd-legend div { font-size: 12px; color: var(--muted); min-width: 0; }
.gd-legend b { display: block; font-size: 15px; color: var(--ink); font-variant-numeric: tabular-nums; margin-top: 2px; }
.gd-sw { display: inline-block; width: 10px; height: 10px; border-radius: 3px; margin-right: 6px; vertical-align: -1px; }
.gd-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.gd-pair .v { display: block; font-size: 22px; font-weight: 800; color: var(--ink); margin: 4px 0 2px; font-variant-numeric: tabular-nums; }
.gd-info { margin-top: 12px; font-size: 12px; color: var(--ink-2); background: rgba(255,255,255,.6); border: 1px dashed var(--line); border-radius: 10px; padding: 8px 10px; line-height: 1.5; }
.gd-stages { display: flex; flex-direction: column; gap: 12px; }
.gd-stage-row { display: grid; grid-template-columns: 1fr auto; gap: 4px 12px; align-items: baseline; }
.gd-stage-row .name { font-size: 13px; color: var(--ink); font-weight: 600; }
.gd-stage-row .name small { font-weight: 400; color: var(--muted); margin-left: 6px; }
.gd-stage-row .cnt { font-size: 15px; font-weight: 800; color: var(--ink); font-variant-numeric: tabular-nums; text-align: right; }
.gd-stage-row .cnt small { font-weight: 500; font-size: 12px; color: var(--muted); margin-left: 6px; }
.gd-stage-row .gd-track { grid-column: 1 / -1; height: 6px; }
.gd-queue { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 4px 10px; padding: 6px 12px; border-radius: 10px; background: #fffbeb; border: 1px solid #fde68a; font-size: 12.5px; color: #92400e; }
.gd-queue.ok { background: #ecfdf5; border-color: #a7f3d0; color: #065f46; }

.gd-grid { display: grid; gap: 16px; }
.gd-g3 { grid-template-columns: repeat(3, minmax(0,1fr)); }
.gd-g2 { grid-template-columns: repeat(2, minmax(0,1fr)); }
@media (max-width: 991px) { .gd-g3, .gd-g2 { grid-template-columns: 1fr; } }
.gd-card { background: var(--card); border: 1px solid var(--line); border-radius: 16px; padding: 16px 18px; min-width: 0; }
.gd-card h6 { font-size: 14px; font-weight: 700; color: var(--ink); margin: 0 0 2px; }
.gd-card .cap { font-size: 12px; color: var(--muted); margin-bottom: 12px; }
.gd-hl { display: flex; align-items: baseline; gap: 8px; margin-bottom: 4px; }
.gd-hl b { font-size: 20px; font-weight: 800; color: var(--ink); font-variant-numeric: tabular-nums; }
.gd-hl span { font-size: 12px; color: var(--muted); }
.gd-bars { display: flex; align-items: flex-end; gap: 6px; height: 150px; padding-top: 18px; border-bottom: 1px solid var(--line); }
.gd-bar { flex: 1; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; position: relative; }
.gd-bar i { display: block; width: 100%; max-width: 26px; background: var(--accent); border-radius: 4px 4px 0 0; min-height: 2px; opacity: .8; transition: opacity .1s; }
.gd-bar:hover i, .gd-bar.last i { opacity: 1; }
.gd-bar .tip { display: none; position: absolute; bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%); background: var(--ink); color: #fff; font-size: 12px; padding: 6px 9px; border-radius: 8px; white-space: nowrap; z-index: 2; pointer-events: none; }
.gd-bar:hover .tip { display: block; }
.gd-bar .tip b { display: block; font-size: 13px; }
.gd-axis { display: flex; gap: 6px; margin-top: 6px; }
.gd-axis span { flex: 1; text-align: center; font-size: 11px; color: var(--muted); white-space: nowrap; overflow: hidden; }
.gd-hbar { margin-bottom: 12px; }
.gd-hbar:last-child { margin-bottom: 0; }
.gd-hbar .r1 { display: flex; justify-content: space-between; gap: 8px; font-size: 13px; color: var(--ink-2); margin-bottom: 5px; }
.gd-hbar .r1 b { color: var(--ink); font-variant-numeric: tabular-nums; font-weight: 700; }
.gd-table { width: 100%; font-size: 13.5px; border-collapse: collapse; }
.gd-table th { font-size: 11.5px; text-transform: uppercase; letter-spacing: .05em; color: var(--muted); font-weight: 700; padding: 8px 10px; border-bottom: 1px solid var(--line); text-align: left; white-space: nowrap; }
.gd-table td { padding: 10px; border-bottom: 1px solid #f1f2f6; color: var(--ink-2); vertical-align: middle; }
.gd-table tr:last-child td { border-bottom: 0; }
.gd-table .num { text-align: right; font-variant-numeric: tabular-nums; }
.gd-table .name { color: var(--ink); font-weight: 600; }
.gd-rank { display: inline-flex; width: 24px; height: 24px; border-radius: 50%; background: #f1f2f6; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: var(--ink-2); }
.gd-chip { display: inline-block; font-size: 11.5px; font-weight: 700; padding: 2px 8px; border-radius: 999px; background: #f3f4f6; color: var(--ink); }
.gd-empty { color: var(--muted); font-size: 13px; padding: 20px 0; text-align: center; }
`;

function Val({ loading, children }: { loading: boolean; children: ReactNode }) {
  return <>{loading ? <span className="gd-skel" /> : children}</>;
}

function Meter({ label, value, total, sub, tone, loading }: { label: string; value: number; total: number; sub: string; tone?: Tone; loading: boolean }) {
  return (
    <div>
      <span className="lbl">{label}</span>
      <div className="gd-meter-head">
        <b><Val loading={loading}>{num(value)}</Val></b>
        {!loading ? <span className="gd-pctchip">{pct(value, total)}</span> : null}
      </div>
      <div className={`gd-track ${tone || ""}`}>
        <div style={{ width: `${share(value, total)}%` }} />
      </div>
      <span className="gd-sub">{sub}</span>
    </div>
  );
}

// Part-of-whole bar; the legend carries every value, so colour is never the only cue
function StackBar({ parts }: { parts: Array<{ label: string; value: number; color: string }> }) {
  const total = parts.reduce((sum, part) => sum + Math.max(0, part.value), 0);
  return (
    <>
      <div className="gd-stack" role="img" aria-label={parts.map((x) => `${x.label} ${num(x.value)}`).join(", ")}>
        {parts.map((part) =>
          part.value > 0 ? (
            <div
              key={part.label}
              title={`${part.label}: ${num(part.value)} (${pct(part.value, total)})`}
              style={{ width: `${share(part.value, total)}%`, background: part.color }}
            />
          ) : null
        )}
      </div>
      <div className="gd-legend">
        {parts.map((part) => (
          <div key={part.label}>
            <span className="gd-sw" style={{ background: part.color }} />
            {part.label}
            <b>{num(part.value)}</b>
            {pct(part.value, total)}
          </div>
        ))}
      </div>
    </>
  );
}

// One series per chart, so every chart has its own scale
function MonthlyBars({ rows, field, unit }: { rows: TrendRow[]; field: keyof TrendRow; unit: string }) {
  const values = rows.map((r) => Number(r[field]) || 0);
  const max = Math.max(...values, 1);
  if (!values.some((v) => v > 0)) return <div className="gd-empty">No activity in the last 12 months</div>;
  return (
    <>
      <div className="gd-bars" role="img" aria-label={`Monthly ${unit}`}>
        {rows.map((r, i) => (
          <div key={r.month} className={`gd-bar ${i === rows.length - 1 ? "last" : ""}`}>
            <span className="tip">
              {monthLabel(r.month)} {r.month.slice(0, 4)}
              <b>{num(values[i])} {unit}</b>
            </span>
            <i style={{ height: `${(values[i] / max) * 100}%` }} />
          </div>
        ))}
      </div>
      <div className="gd-axis">
        {rows.map((r) => (
          <span key={r.month}>{monthLabel(r.month)}</span>
        ))}
      </div>
    </>
  );
}

function HBars({ items }: { items: Array<{ label: string; value: number; right?: string; color?: string }> }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  if (!items.length) return <div className="gd-empty">No data yet</div>;
  return (
    <>
      {items.map((item) => (
        <div className="gd-hbar" key={item.label}>
          <div className="r1">
            <span>{item.label}</span>
            <b>{item.right ?? num(item.value)}</b>
          </div>
          <div className="gd-track">
            <div style={{ width: `${(item.value / max) * 100}%`, background: item.color }} />
          </div>
        </div>
      ))}
    </>
  );
}

export default function Dashboard() {
  const [customerType, setCustomerType] = useState<CustomerType>("Mechanic");
  const [period, setPeriod] = useState<PeriodKey>("all");
  const [custom, setCustom] = useState({ from: "", to: "" });
  const [data, setData] = useState<Overview | null>(null);
  const [categories, setCategories] = useState<MechanicCategorySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  const range = useMemo(() => periodRange(period, custom), [period, custom]);

  useEffect(() => {
    if (period === "custom" && (!custom.from || !custom.to)) return;
    let stale = false;
    setLoading(true);
    setError("");
    backendGetDashboardOverview({ customerType, from: range.from, to: range.to })
      .then((res: any) => {
        if (stale) return;
        if (res?.isError || !res?.data?.allTime) throw new Error(res?.message || "Could not load dashboard");
        setData(res.data);
      })
      .catch((e: any) => {
        if (!stale) setError(e?.response?.data?.message || e?.message || "Could not load dashboard");
      })
      .finally(() => {
        if (!stale) setLoading(false);
      });
    return () => {
      stale = true;
    };
  }, [customerType, range.from, range.to, reload]);

  useEffect(() => {
    backendGetMechanicCategorySummary()
      .then((res: any) => setCategories(res?.data || null))
      .catch(() => setCategories(null));
  }, [reload]);

  const switchType = (type: CustomerType) => {
    if (type === customerType) return;
    setData(null);
    setCustomerType(type);
  };

  const skel = loading && !data;
  const type = customerType.toLowerCase();
  const hasPeriod = period !== "all";
  const periodLabel = PERIODS.find((x) => x.key === period)?.label || "";
  const rangeText = range.from ? `${shortDate(range.from)} – ${shortDate(range.to)}` : "";
  const c = data?.customers;
  const all = data?.allTime;
  const sel = data?.selected;
  const dmgNow = all?.damage;
  const pendingDays = dmgNow?.oldestPendingAt
    ? Math.max(0, Math.floor((Date.now() - new Date(dmgNow.oldestPendingAt).getTime()) / 86400000))
    : null;
  // the table follows the period when one is chosen
  const topCustomers = (sel || all)?.topCustomers || [];

  // Two blocks per panel: all time on the left, the chosen period on the right
  const compare = (render: (s: Stats | undefined, scope: string) => ReactNode, wideLeft = false) => (
    <div className={`gd-compare ${wideLeft ? "wide-left" : ""}`}>
      <div className="gd-block">
        <div className="gd-block-head">
          <b>All time</b>
          <span className="gd-note">Not affected by the period filter</span>
        </div>
        {render(all, "all time")}
      </div>
      <div className="gd-block tinted">
        <div className="gd-block-head">
          <b>
            {hasPeriod ? periodLabel : "Selected period"}
            {hasPeriod && rangeText ? <small>{rangeText}</small> : null}
          </b>
          <span className="gd-note on">Changes with the period filter</span>
        </div>
        {hasPeriod && (sel || loading) ? (
          render(sel || undefined, periodLabel.toLowerCase())
        ) : (
          <div className="gd-pick">
            Pick a period to compare it with all time
            <div>
              {QUICK_PERIODS.map((key) => (
                <button key={key} onClick={() => setPeriod(key)}>
                  {PERIODS.find((x) => x.key === key)?.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const pointsBlock = (s: Stats | undefined, scope: string) => {
    const p = s?.points;
    const loadingBlock = !p;
    return (
      <>
        <div className="gd-big">
          <span className="lbl">Points earned</span>
          <span className="v"><Val loading={loadingBlock}>{num(p?.earned || 0)}</Val></span>
          <span className="gd-sub">Credits to {type}s who scanned · {scope}</span>
        </div>
        <div className="gd-sublabel">Where points came from</div>
        <StackBar
          parts={[
            { label: "QR scans", value: p?.scanned || 0, color: "#2a78d6" },
            { label: "Welcome", value: p?.welcome || 0, color: "#eb6834" },
            { label: "Other", value: p?.other || 0, color: "#1baf7a" },
          ]}
        />
        {p?.welcomeExcluded ? (
          <div className="gd-info">
            Welcome points of {num(p.welcomeCustomers)} active {type}s only. {num(p.welcomeExcluded)} pts given to {type}s
            who did not scan are left out.
          </div>
        ) : null}
        <div className="gd-divider" />
        <div className="gd-pair">
          <div>
            <span className="lbl"><span className="gd-sw" style={{ background: "#2a78d6" }} />Redeemed</span>
            <span className="v"><Val loading={loadingBlock}>{num(p?.redeemed || 0)}</Val></span>
            <span className="gd-sub">{pct(p?.redeemed || 0, p?.earned || 0)} of earned</span>
          </div>
          <div>
            <span className="lbl"><span className="gd-sw" style={{ background: "#d7dbe3" }} />Net outstanding</span>
            <span className="v"><Val loading={loadingBlock}>{num(p?.balance || 0)}</Val></span>
            <span className="gd-sub">earned minus redeemed</span>
          </div>
        </div>
        <div className="gd-track lg" title={`${pct(p?.redeemed || 0, p?.earned || 0)} redeemed`}>
          <div style={{ width: `${share(p?.redeemed || 0, p?.earned || 0)}%`, background: "#2a78d6" }} />
        </div>
      </>
    );
  };

  const qrBlock = (s: Stats | undefined) => {
    const q = s?.coupons;
    const loadingBlock = !q;
    return (
      <>
        <div className="gd-metrics">
          <Meter label="Generated" value={q?.generated || 0} total={q?.generated || 0} sub="QR codes printed" loading={loadingBlock} />
          <Meter label="Unique codes scanned" value={q?.scanned || 0} total={q?.generated || 0} sub="of generated" tone="good" loading={loadingBlock} />
        </div>
        <div className="gd-divider" />
        <div className="gd-pair">
          <div>
            <span className="lbl">Total scans</span>
            <span className="v"><Val loading={loadingBlock}>{num(q?.scans || 0)}</Val></span>
            <span className="gd-sub">including repeat scans</span>
          </div>
          <div>
            <span className="lbl">Scans per active {type}</span>
            <span className="v"><Val loading={loadingBlock}>{num(s?.activeCustomers ? (q?.scans || 0) / s.activeCustomers : 0)}</Val></span>
            <span className="gd-sub">{num(s?.activeCustomers || 0)} {type}s scanned</span>
          </div>
        </div>
      </>
    );
  };

  const redemptionBlock = (s: Stats | undefined) => {
    const rows = s?.redemptions.byStatus || [];
    const total = rows.reduce((sum, r) => sum + r.count, 0);
    const loadingBlock = !s;
    return (
      <>
        <div className="gd-big">
          <span className="lbl">Redemption requests</span>
          <span className="v"><Val loading={loadingBlock}>{num(total)}</Val></span>
          <span className="gd-sub">{num(rows.reduce((sum, r) => sum + r.points, 0))} pts requested</span>
        </div>
        <div className="gd-stages">
          {REDEMPTION_STAGES.map((stage) => {
            const match = rows.filter((r) => stage.keys.includes(r.status));
            const count = match.reduce((sum, r) => sum + r.count, 0);
            const points = match.reduce((sum, r) => sum + r.points, 0);
            return (
              <div className="gd-stage-row" key={stage.label}>
                <span className="name">
                  {stage.label}
                  <small>{stage.hint}</small>
                </span>
                <span className="cnt">
                  <Val loading={loadingBlock}>{num(count)}</Val>
                  <small>{num(points)} pts</small>
                </span>
                <div className={`gd-track ${stage.tone}`}>
                  <div style={{ width: `${share(count, total)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  const damageBlock = (s: Stats | undefined) => {
    const d = s?.damage;
    const decided = (d?.Approved || 0) + (d?.Rejected || 0);
    const loadingBlock = !d;
    return (
      <>
        <div className="gd-big">
          <span className="lbl">Entries submitted</span>
          <span className="v"><Val loading={loadingBlock}>{num(d?.total || 0)}</Val></span>
          <span className="gd-sub">by {num(d?.customers || 0)} {type}s</span>
        </div>
        <div className="gd-metrics">
          <Meter label="Pending" value={d?.Pending || 0} total={d?.total || 0} sub="not reviewed yet" tone="warn" loading={loadingBlock} />
          <Meter label="On hold" value={d?.Hold || 0} total={d?.total || 0} sub="parked for a check" tone="info" loading={loadingBlock} />
          <Meter
            label="Approved"
            value={d?.Approved || 0}
            total={d?.total || 0}
            sub={`${pct(d?.Approved || 0, decided)} of reviewed`}
            tone="good"
            loading={loadingBlock}
          />
          <Meter label="Rejected" value={d?.Rejected || 0} total={d?.total || 0} sub="no points given" tone="bad" loading={loadingBlock} />
        </div>
      </>
    );
  };

  const customersPeriodBlock = (s: Stats | undefined, scope: string) => (
    <div className="gd-metrics">
      <Meter
        label="Active (scanned at least once)"
        value={s?.activeCustomers || 0}
        total={c?.total || 0}
        sub={`of all ${type}s · ${scope}`}
        loading={!s}
      />
      <div>
        <span className="lbl">New registrations</span>
        <div className="gd-meter-head">
          <b><Val loading={!s}>{num(s?.newCustomers || 0)}</Val></b>
        </div>
        <span className="gd-sub">{scope === "all time" ? "since the programme started" : `joined in ${scope}`}</span>
      </div>
    </div>
  );

  return (
    <Layout>
      <style>{css}</style>
      <BreadcrumbComponent
        firstItem={{ href: "/dashboard", label: "Home" }}
        secondItem={{ href: "", label: "" }}
        itemlabel="Dashboard"
      />
      <div className="gd">
        <div className="gd-head">
          <div>
            <h3>{customerType} Dashboard</h3>
            <p>
              Loyalty programme overview · {hasPeriod ? `All time vs ${periodLabel.toLowerCase()}` : "All time"}
              {hasPeriod && rangeText ? ` (${rangeText})` : ""}
            </p>
          </div>
          <div className="gd-filters">
            <div className="gd-tabs" role="tablist">
              {(["Mechanic", "Retailer"] as CustomerType[]).map((t) => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={customerType === t}
                  className={customerType === t ? "on" : ""}
                  onClick={() => switchType(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            <Form.Select value={period} onChange={(e) => setPeriod(e.target.value as PeriodKey)} aria-label="Compare with period">
              {PERIODS.map((x) => (
                <option key={x.key} value={x.key}>
                  {x.key === "all" ? "Compare with…" : x.label}
                </option>
              ))}
            </Form.Select>
            {period === "custom" ? (
              <>
                <Form.Control
                  type="date"
                  value={custom.from}
                  max={custom.to || undefined}
                  onChange={(e) => setCustom({ ...custom, from: e.target.value })}
                  aria-label="From"
                />
                <Form.Control
                  type="date"
                  value={custom.to}
                  min={custom.from || undefined}
                  onChange={(e) => setCustom({ ...custom, to: e.target.value })}
                  aria-label="To"
                />
              </>
            ) : null}
            <button className="gd-refresh" title="Refresh" onClick={() => setReload((n) => n + 1)} disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : <ArrowRepeat size={16} />}
            </button>
          </div>
        </div>

        {error ? (
          <div className="gd-error">
            <ExclamationTriangle /> {error}
            <button onClick={() => setReload((n) => n + 1)}>Retry</button>
          </div>
        ) : null}

        <div className={loading && data ? "gd-loading" : ""}>
          <div className="gd-section">
            <div className="gd-panel">
              <div className="gd-panel-head">
                <span className="gd-ico"><People /></span>
                <div>
                  <h5>{customerType}s</h5>
                  <span>Registrations and app usage</span>
                </div>
              </div>
              <div className="gd-compare wide-left">
                <div className="gd-block">
                  <div className="gd-block-head">
                    <b>All time</b>
                    <span className="gd-note">Not affected by the period filter</span>
                  </div>
                  <div className="gd-big">
                    <span className="lbl">Total {type}s</span>
                    <span className="v"><Val loading={skel}>{num(c?.total || 0)}</Val></span>
                    <span className="gd-sub">registered on the programme</span>
                  </div>
                  <div className="gd-metrics">
                    <Meter label="Active (ever scanned)" value={all?.activeCustomers || 0} total={c?.total || 0} sub="scanned at least once" tone="good" loading={skel} />
                    <Meter label="App users" value={c?.appUsers || 0} total={c?.total || 0} sub="logged in to the app" loading={skel} />
                    <Meter
                      label="Self registered"
                      value={c?.selfRegistered || 0}
                      total={c?.total || 0}
                      sub={`${num((c?.total || 0) - (c?.selfRegistered || 0))} added by team`}
                      loading={skel}
                    />
                    <Meter label="Blocked" value={c?.blocked || 0} total={c?.total || 0} sub="marked inactive" tone="bad" loading={skel} />
                  </div>
                </div>
                <div className="gd-block tinted">
                  <div className="gd-block-head">
                    <b>
                      {hasPeriod ? periodLabel : "Selected period"}
                      {hasPeriod && rangeText ? <small>{rangeText}</small> : null}
                    </b>
                    <span className="gd-note on">Changes with the period filter</span>
                  </div>
                  {hasPeriod && (sel || loading) ? (
                    customersPeriodBlock(sel || undefined, periodLabel.toLowerCase())
                  ) : (
                    <div className="gd-pick">
                      Pick a period to see active {type}s and new registrations in it
                      <div>
                        {QUICK_PERIODS.map((key) => (
                          <button key={key} onClick={() => setPeriod(key)}>
                            {PERIODS.find((x) => x.key === key)?.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="gd-section">
            <div className="gd-panel">
              <div className="gd-panel-head">
                <span className="gd-ico"><Wallet2 /></span>
                <div>
                  <h5>Points</h5>
                  <span>Earned, redeemed and outstanding</span>
                </div>
              </div>
              {compare(pointsBlock)}
            </div>
          </div>

          <div className="gd-section">
            <div className="gd-panel">
              <div className="gd-panel-head">
                <span className="gd-ico"><QrCode /></span>
                <div>
                  <h5>QR codes</h5>
                  <span>Generated vs scanned</span>
                </div>
              </div>
              {compare(qrBlock)}
            </div>
          </div>

          <div className="gd-section">
            <div className="gd-panel">
              <div className="gd-panel-head">
                <span className="gd-ico"><Gift /></span>
                <div>
                  <h5>Redemptions</h5>
                  <span>Requests by stage</span>
                </div>
                <div className="gd-head-extra">
                  <Link href="/redemption" className="gd-link">Open redemptions →</Link>
                </div>
              </div>
              {compare(redemptionBlock)}
            </div>
          </div>

          <div className="gd-section">
            <div className="gd-panel">
              <div className="gd-panel-head">
                <span className="gd-ico"><ImageAlt /></span>
                <div>
                  <h5>Damage entries</h5>
                  <span>QR codes sent with a photo for manual approval</span>
                </div>
                <div className="gd-head-extra">
                  {dmgNow ? (
                    dmgNow.Pending ? (
                      <span className="gd-queue">
                        <b>{num(dmgNow.Pending)} waiting today</b>
                        {pendingDays !== null ? (
                          <span>oldest {pendingDays === 0 ? "from today" : `${pendingDays} day${pendingDays === 1 ? "" : "s"} old`}</span>
                        ) : null}
                      </span>
                    ) : (
                      <span className="gd-queue ok">Nothing waiting for approval</span>
                    )
                  ) : null}
                  <Link href="/damageentries" className="gd-link">Open damage entries →</Link>
                </div>
              </div>
              {compare(damageBlock)}
            </div>
          </div>

          <div className="gd-section">
            <div className="gd-panel">
              <div className="gd-panel-head">
                <span className="gd-ico"><BarChartLine /></span>
                <div>
                  <h5>Last 12 months</h5>
                  <span>Month by month, hover a bar for the value</span>
                </div>
              </div>
              <div className="gd-grid gd-g2">
                {[
                  { field: "scannedPoints" as const, title: "Points from scans", unit: "pts" },
                  { field: "redeemedPoints" as const, title: "Points redeemed", unit: "pts" },
                  { field: "newCustomers" as const, title: `New ${type}s`, unit: "registrations" },
                  { field: "damageEntries" as const, title: "Damage entries", unit: "entries" },
                ].map((chart) => {
                  const rows = data?.trend || [];
                  const thisMonth = rows[rows.length - 1];
                  return (
                    <div className="gd-card" key={chart.field}>
                      <h6>{chart.title}</h6>
                      <div className="gd-hl">
                        <b>{num(thisMonth ? Number(thisMonth[chart.field]) : 0)}</b>
                        <span>this month</span>
                      </div>
                      {skel ? <div className="gd-empty">Loading…</div> : <MonthlyBars rows={rows} field={chart.field} unit={chart.unit} />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="gd-section">
            <div className="gd-grid gd-g3">
              {customerType === "Mechanic" ? (
                <div className="gd-card">
                  <h6>Mechanic categories</h6>
                  <div className="cap">
                    {categories?.period ? `Based on points in ${categories.period}` : "Based on yearly scanned points"} ·{" "}
                    <Link href="/customer">customer list</Link>
                  </div>
                  <HBars
                    items={(categories?.categories || []).map((cat) => ({
                      label: cat.category,
                      value: cat.count,
                      right: `${num(cat.count)} · avg ${num(cat.avgPoints)} pts`,
                      color: MECHANIC_CATEGORY_COLOURS[cat.category],
                    }))}
                  />
                </div>
              ) : null}
              <div className="gd-card">
                <h6>Redemption methods</h6>
                <div className="cap">
                  Points by payout method · {hasPeriod ? periodLabel.toLowerCase() : "all time"}
                </div>
                <HBars
                  items={((sel || all)?.redemptions.byMethod || []).map((m) => ({
                    label: m.method,
                    value: m.points,
                    right: `${num(m.points)} pts · ${num(m.count)}`,
                  }))}
                />
              </div>
              <div className="gd-card">
                <h6>Top states</h6>
                <div className="cap">Registered {type}s by state · all time</div>
                <HBars items={(data?.topStates || []).map((s) => ({ label: s.state, value: s.customers }))} />
              </div>
            </div>
          </div>

          <div className="gd-section">
            <div className="gd-card">
              <h6>Top 10 {type}s</h6>
              <div className="cap">By points from QR scans · {hasPeriod ? periodLabel.toLowerCase() : "all time"}</div>
              {topCustomers.length ? (
                <div className="table-responsive">
                  <table className="gd-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Firm / contact</th>
                        <th>Mobile</th>
                        <th>Location</th>
                        {customerType === "Mechanic" ? <th>Category</th> : null}
                        <th className="num">Scans</th>
                        <th className="num">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topCustomers.map((row, i) => (
                        <tr key={row._id}>
                          <td><span className="gd-rank">{i + 1}</span></td>
                          <td>
                            <div className="name">{row.firmName || row.contactPerson || "—"}</div>
                            {row.firmName && row.contactPerson ? <div>{row.contactPerson}</div> : null}
                          </td>
                          <td>{row.mobile || "—"}</td>
                          <td>{[row.city, row.state].filter(Boolean).join(", ") || "—"}</td>
                          {customerType === "Mechanic" ? (
                            <td>{row.category ? <span className="gd-chip">{row.category}</span> : "—"}</td>
                          ) : null}
                          <td className="num">{num(row.scans)}</td>
                          <td className="num"><b>{num(row.points)}</b></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="gd-empty">{skel ? "Loading…" : "No scans in this period"}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
