import { useEffect, useMemo, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import {
  ArrowRepeat,
  CashCoin,
  ExclamationTriangle,
  Gift,
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
}

interface Overview {
  customers: {
    total: number;
    selfRegistered: number;
    appUsers: number;
    blocked: number;
    newInPeriod: number;
    activeInPeriod: number;
  };
  points: { earned: number; scanned: number; welcome: number; other: number; redeemed: number; balance: number };
  coupons: { generated: number; scanned: number; scans: number };
  redemptions: {
    byStatus: Array<{ status: string; count: number; points: number }>;
    byMethod: Array<{ method: string; count: number; points: number }>;
  };
  trend: TrendRow[];
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
const pct = (part: number, whole: number) => (whole ? `${((part / whole) * 100).toFixed(part / whole < 0.1 ? 1 : 0)}%` : "0%");
const monthLabel = (m: string) => {
  const [y, mo] = m.split("-").map(Number);
  return new Date(y, mo - 1, 1).toLocaleDateString("en-IN", { month: "short" }) + (mo === 1 ? ` ${String(y).slice(2)}` : "");
};

// Upper-cased redemption statuses from the API, in workflow order
const REDEMPTION_STAGES: Array<{ keys: string[]; label: string; hint: string; tone: string }> = [
  { keys: ["PENDING", "OPEN"], label: "Pending approval", hint: "Waiting for approval", tone: "warn" },
  { keys: ["APPROVED"], label: "Pending transfer", hint: "Approved, payment not sent", tone: "info" },
  { keys: ["UNDER PROCESS", "PROCESSING"], label: "Under process", hint: "Payment in progress", tone: "info" },
  { keys: ["SUCCESS"], label: "Successful", hint: "Paid out", tone: "good" },
  { keys: ["REJECTED", "FAIL", "FAILED"], label: "Rejected / failed", hint: "Points returned", tone: "bad" },
];

const css = `
.gd { --ink: #111827; --ink-2: #4b5563; --muted: #6b7280; --line: #e7e9ee; --card: #fff; --accent: #4f46e5; --accent-soft: #eef2ff; }
.gd-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px; margin: 8px 0 22px; }
.gd-head h3 { margin: 0; font-weight: 800; color: var(--ink); }
.gd-head p { margin: 2px 0 0; color: var(--muted); font-size: 13px; }
.gd-tabs { display: inline-flex; background: #eef0f4; border-radius: 12px; padding: 4px; gap: 4px; }
.gd-tabs button { border: 0; background: transparent; padding: 8px 22px; border-radius: 9px; font-weight: 600; color: var(--ink-2); font-size: 14px; }
.gd-tabs button.on { background: #fff; color: var(--ink); box-shadow: 0 1px 3px rgba(15,23,42,.12); }
.gd-filters { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.gd-filters .form-select, .gd-filters .form-control { width: auto; min-width: 150px; border-radius: 10px; font-size: 14px; }
.gd-refresh { border: 1px solid var(--line); background: #fff; border-radius: 10px; width: 38px; height: 38px; display: inline-flex; align-items: center; justify-content: center; color: var(--ink-2); }
.gd-section { margin-bottom: 26px; }
.gd-section > h6 { display: flex; align-items: center; gap: 8px; font-weight: 700; color: var(--ink); margin: 0 0 12px; font-size: 15px; }
.gd-section > h6 svg { color: var(--accent); }
.gd-section > h6 small { font-weight: 500; color: var(--muted); font-size: 12px; }
.gd-grid { display: grid; gap: 14px; }
.gd-g6 { grid-template-columns: repeat(6, minmax(0,1fr)); }
.gd-g5 { grid-template-columns: repeat(5, minmax(0,1fr)); }
.gd-g3 { grid-template-columns: repeat(3, minmax(0,1fr)); }
.gd-g2 { grid-template-columns: repeat(2, minmax(0,1fr)); }
@media (max-width: 1399px) { .gd-g6 { grid-template-columns: repeat(3, minmax(0,1fr)); } .gd-g5 { grid-template-columns: repeat(3, minmax(0,1fr)); } }
@media (max-width: 991px) { .gd-g3, .gd-g2 { grid-template-columns: 1fr; } }
@media (max-width: 767px) { .gd-g6, .gd-g5 { grid-template-columns: repeat(2, minmax(0,1fr)); } }
.gd-card { background: var(--card); border: 1px solid var(--line); border-radius: 16px; padding: 16px 18px; min-width: 0; }
.gd-kpi .label { font-size: 12.5px; font-weight: 600; color: var(--muted); }
.gd-kpi .value { font-size: 26px; font-weight: 800; color: var(--ink); line-height: 1.2; margin-top: 6px; font-variant-numeric: tabular-nums; }
.gd-kpi .sub { font-size: 12.5px; color: var(--muted); margin-top: 4px; }
.gd-kpi.hero { background: var(--ink); border-color: var(--ink); }
.gd-kpi.hero .label, .gd-kpi.hero .sub { color: #cbd5e1; }
.gd-kpi.hero .value { color: #fff; }
.gd-stage { position: relative; padding-left: 22px; }
.gd-stage::before { content: ""; position: absolute; left: 0; top: 18px; bottom: 18px; width: 4px; border-radius: 0 4px 4px 0; background: #cbd5e1; }
.gd-stage.warn::before { background: #d97706; } .gd-stage.info::before { background: #2563eb; } .gd-stage.good::before { background: #059669; } .gd-stage.bad::before { background: #dc2626; }
.gd-card h6 { font-size: 14px; font-weight: 700; color: var(--ink); margin: 0 0 2px; }
.gd-card .cap { font-size: 12px; color: var(--muted); margin-bottom: 12px; }
.gd-bars { display: flex; align-items: flex-end; gap: 6px; height: 160px; padding-top: 18px; border-bottom: 1px solid var(--line); position: relative; }
.gd-bar { flex: 1; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; position: relative; cursor: default; }
.gd-bar i { display: block; width: 100%; max-width: 26px; background: var(--accent); border-radius: 4px 4px 0 0; min-height: 2px; opacity: .85; transition: opacity .1s; }
.gd-bar:hover i, .gd-bar.last i { opacity: 1; }
.gd-bar .tip { display: none; position: absolute; bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%); background: var(--ink); color: #fff; font-size: 12px; padding: 6px 9px; border-radius: 8px; white-space: nowrap; z-index: 2; pointer-events: none; }
.gd-bar:hover .tip { display: block; }
.gd-bar .tip b { display: block; font-size: 13px; }
.gd-axis { display: flex; gap: 6px; margin-top: 6px; }
.gd-axis span { flex: 1; text-align: center; font-size: 11px; color: var(--muted); white-space: nowrap; overflow: hidden; }
.gd-hl { display: flex; align-items: baseline; gap: 8px; margin-bottom: 4px; }
.gd-hl b { font-size: 20px; font-weight: 800; color: var(--ink); font-variant-numeric: tabular-nums; }
.gd-hl span { font-size: 12px; color: var(--muted); }
.gd-hbar { margin-bottom: 12px; }
.gd-hbar:last-child { margin-bottom: 0; }
.gd-hbar .row1 { display: flex; justify-content: space-between; gap: 8px; font-size: 13px; color: var(--ink-2); margin-bottom: 5px; }
.gd-hbar .row1 b { color: var(--ink); font-variant-numeric: tabular-nums; font-weight: 700; }
.gd-hbar .track { height: 8px; background: #f1f2f6; border-radius: 4px; overflow: hidden; }
.gd-hbar .fill { height: 100%; border-radius: 4px; background: var(--accent); }
.gd-table { width: 100%; font-size: 13.5px; border-collapse: collapse; }
.gd-table th { font-size: 11.5px; text-transform: uppercase; letter-spacing: .05em; color: var(--muted); font-weight: 700; padding: 8px 10px; border-bottom: 1px solid var(--line); text-align: left; white-space: nowrap; }
.gd-table td { padding: 10px; border-bottom: 1px solid #f1f2f6; color: var(--ink-2); vertical-align: middle; }
.gd-table tr:last-child td { border-bottom: 0; }
.gd-table .r { text-align: right; font-variant-numeric: tabular-nums; }
.gd-table .name { color: var(--ink); font-weight: 600; }
.gd-rank { display: inline-flex; width: 24px; height: 24px; border-radius: 50%; background: #f1f2f6; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: var(--ink-2); }
.gd-chip { display: inline-block; font-size: 11.5px; font-weight: 700; padding: 2px 8px; border-radius: 999px; background: #f3f4f6; color: var(--ink); }
.gd-empty { color: var(--muted); font-size: 13px; padding: 20px 0; text-align: center; }
.gd-error { display: flex; align-items: center; gap: 10px; background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; border-radius: 12px; padding: 12px 16px; margin-bottom: 18px; font-size: 14px; }
.gd-error button { margin-left: auto; border: 1px solid #fecaca; background: #fff; color: #991b1b; border-radius: 8px; padding: 4px 12px; font-weight: 600; }
.gd-loading { opacity: .55; pointer-events: none; transition: opacity .15s; }
.gd-skel { display: inline-block; width: 70%; height: 26px; border-radius: 6px; background: linear-gradient(90deg,#f1f2f6,#e7e9ee,#f1f2f6); background-size: 200% 100%; animation: gdsk 1.2s infinite; }
@keyframes gdsk { from { background-position: 200% 0; } to { background-position: -200% 0; } }
`;

function Kpi({ label, value, sub, hero, loading }: { label: string; value: string; sub?: string; hero?: boolean; loading?: boolean }) {
  return (
    <div className={`gd-card gd-kpi ${hero ? "hero" : ""}`}>
      <div className="label">{label}</div>
      <div className="value">{loading ? <span className="gd-skel" /> : value}</div>
      {sub ? <div className="sub">{sub}</div> : null}
    </div>
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
              <b>
                {num(values[i])} {unit}
              </b>
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

function HBars({ items, color }: { items: Array<{ label: string; value: number; right?: string; color?: string }>; color?: string }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  if (!items.length) return <div className="gd-empty">No data yet</div>;
  return (
    <>
      {items.map((item) => (
        <div className="gd-hbar" key={item.label}>
          <div className="row1">
            <span>{item.label}</span>
            <b>{item.right ?? num(item.value)}</b>
          </div>
          <div className="track">
            <div className="fill" style={{ width: `${(item.value / max) * 100}%`, background: item.color || color }} />
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
        if (res?.isError || !res?.data) throw new Error(res?.message || "Could not load dashboard");
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

  const c = data?.customers;
  const p = data?.points;
  const q = data?.coupons;
  const showSkeleton = loading && !data;
  const periodLabel = PERIODS.find((x) => x.key === period)?.label || "";
  const inPeriod = period === "all" ? "all time" : periodLabel.toLowerCase();

  const stages = REDEMPTION_STAGES.map((stage) => {
    const rows = (data?.redemptions.byStatus || []).filter((s) => stage.keys.includes(s.status));
    return {
      ...stage,
      count: rows.reduce((sum, r) => sum + r.count, 0),
      points: rows.reduce((sum, r) => sum + r.points, 0),
    };
  });
  const totalRedemptions = (data?.redemptions.byStatus || []).reduce((sum, r) => sum + r.count, 0);

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
              Loyalty programme overview · {periodLabel}
              {range.from ? ` (${range.from} to ${range.to})` : ""}
            </p>
          </div>
          <div className="gd-filters">
            <div className="gd-tabs" role="tablist">
              {(["Mechanic", "Retailer"] as CustomerType[]).map((type) => (
                <button
                  key={type}
                  role="tab"
                  aria-selected={customerType === type}
                  className={customerType === type ? "on" : ""}
                  onClick={() => switchType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
            <Form.Select value={period} onChange={(e) => setPeriod(e.target.value as PeriodKey)} aria-label="Period">
              {PERIODS.map((x) => (
                <option key={x.key} value={x.key}>
                  {x.label}
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
            <h6>
              <People /> {customerType}s
            </h6>
            <div className="gd-grid gd-g6">
              <Kpi hero label={`Total ${customerType.toLowerCase()}s`} value={num(c?.total || 0)} sub="Registered, all time" loading={showSkeleton} />
              <Kpi
                label="Active (scanned)"
                value={num(c?.activeInPeriod || 0)}
                sub={`${pct(c?.activeInPeriod || 0, c?.total || 0)} of total · ${inPeriod}`}
                loading={showSkeleton}
              />
              <Kpi label="New registrations" value={num(c?.newInPeriod || 0)} sub={inPeriod} loading={showSkeleton} />
              <Kpi label="App users" value={num(c?.appUsers || 0)} sub={`${pct(c?.appUsers || 0, c?.total || 0)} have logged in`} loading={showSkeleton} />
              <Kpi
                label="Self registered"
                value={num(c?.selfRegistered || 0)}
                sub={`${num((c?.total || 0) - (c?.selfRegistered || 0))} added by team`}
                loading={showSkeleton}
              />
              <Kpi label="Blocked" value={num(c?.blocked || 0)} sub="Marked inactive" loading={showSkeleton} />
            </div>
          </div>

          <div className="gd-section">
            <h6>
              <Wallet2 /> Points <small>· {inPeriod}</small>
            </h6>
            <div className="gd-grid gd-g5">
              <Kpi hero label="Points earned" value={num(p?.earned || 0)} sub="All credits" loading={showSkeleton} />
              <Kpi label="From QR scans" value={num(p?.scanned || 0)} sub={pct(p?.scanned || 0, p?.earned || 0) + " of earned"} loading={showSkeleton} />
              <Kpi
                label="Welcome & other"
                value={num((p?.welcome || 0) + (p?.other || 0))}
                sub={`Welcome ${num(p?.welcome || 0)} · Other ${num(p?.other || 0)}`}
                loading={showSkeleton}
              />
              <Kpi label="Points redeemed" value={num(p?.redeemed || 0)} sub="Excludes rejected / failed" loading={showSkeleton} />
              <Kpi
                label="Net outstanding"
                value={num(p?.balance || 0)}
                sub={period === "all" ? "Earned minus redeemed" : "Earned minus redeemed in period"}
                loading={showSkeleton}
              />
            </div>
          </div>

          <div className="gd-section">
            <h6>
              <QrCode /> QR codes
            </h6>
            <div className="gd-grid gd-g3">
              <Kpi label="QR codes generated" value={num(q?.generated || 0)} sub={`For ${customerType.toLowerCase()}s · ${inPeriod}`} loading={showSkeleton} />
              <Kpi
                label="Unique QR codes scanned"
                value={num(q?.scanned || 0)}
                sub={q?.generated ? `${pct(q.scanned, q.generated)} of generated` : inPeriod}
                loading={showSkeleton}
              />
              <Kpi label="Total scans" value={num(q?.scans || 0)} sub={`Avg ${num(c?.activeInPeriod ? (q?.scans || 0) / c.activeInPeriod : 0)} per active ${customerType.toLowerCase()}`} loading={showSkeleton} />
            </div>
          </div>

          <div className="gd-section">
            <h6>
              <Gift /> Redemptions <small>· {num(totalRedemptions)} requests · {inPeriod}</small>
            </h6>
            <div className="gd-grid gd-g5">
              {stages.map((s) => (
                <div key={s.label} className={`gd-card gd-kpi gd-stage ${s.tone}`}>
                  <div className="label">{s.label}</div>
                  <div className="value">{showSkeleton ? <span className="gd-skel" /> : num(s.count)}</div>
                  <div className="sub">
                    {num(s.points)} pts · {s.hint}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="gd-section">
            <h6>
              <CashCoin /> Last 12 months
            </h6>
            <div className="gd-grid gd-g3">
              {[
                { field: "scannedPoints" as const, title: "Points from scans", unit: "pts" },
                { field: "redeemedPoints" as const, title: "Points redeemed", unit: "pts" },
                { field: "newCustomers" as const, title: `New ${customerType.toLowerCase()}s`, unit: "registrations" },
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
                    {showSkeleton ? <div className="gd-empty">Loading…</div> : <MonthlyBars rows={rows} field={chart.field} unit={chart.unit} />}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="gd-section">
            <div className="gd-grid gd-g2">
              {customerType === "Mechanic" ? (
                <div className="gd-card">
                  <h6>Mechanic categories</h6>
                  <div className="cap">
                    {categories?.period ? `Based on points in ${categories.period}` : "Based on yearly scanned points"} ·{" "}
                    <Link href="/customer">open customer list</Link>
                  </div>
                  <HBars
                    items={(categories?.categories || []).map((cat) => ({
                      label: cat.category,
                      value: cat.count,
                      right: `${num(cat.count)} · avg ${num(cat.avgPoints)} pts`,
                      color: MECHANIC_CATEGORY_COLOURS[cat.category],
                    }))}
                    color="var(--accent)"
                  />
                </div>
              ) : (
                <div className="gd-card">
                  <h6>Redemption methods</h6>
                  <div className="cap">Points by payout method, excluding rejected / failed</div>
                  <HBars
                    items={(data?.redemptions.byMethod || []).map((m) => ({
                      label: m.method,
                      value: m.points,
                      right: `${num(m.points)} pts · ${num(m.count)}`,
                    }))}
                    color="var(--accent)"
                  />
                </div>
              )}
              <div className="gd-card">
                <h6>Top states</h6>
                <div className="cap">Registered {customerType.toLowerCase()}s by state</div>
                <HBars items={(data?.topStates || []).map((s) => ({ label: s.state, value: s.customers }))} color="var(--accent)" />
              </div>
            </div>
          </div>

          {customerType === "Mechanic" ? (
            <div className="gd-section">
              <div className="gd-card">
                <h6>Redemption methods</h6>
                <div className="cap">Points by payout method, excluding rejected / failed · {inPeriod}</div>
                <HBars
                  items={(data?.redemptions.byMethod || []).map((m) => ({
                    label: m.method,
                    value: m.points,
                    right: `${num(m.points)} pts · ${num(m.count)} requests`,
                  }))}
                  color="var(--accent)"
                />
              </div>
            </div>
          ) : null}

          <div className="gd-section">
            <div className="gd-card">
              <h6>Top 10 {customerType.toLowerCase()}s</h6>
              <div className="cap">By points from QR scans · {inPeriod}</div>
              {data?.topCustomers?.length ? (
                <div className="table-responsive">
                  <table className="gd-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Firm / contact</th>
                        <th>Mobile</th>
                        <th>Location</th>
                        {customerType === "Mechanic" ? <th>Category</th> : null}
                        <th className="r">Scans</th>
                        <th className="r">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topCustomers.map((row, i) => (
                        <tr key={row._id}>
                          <td>
                            <span className="gd-rank">{i + 1}</span>
                          </td>
                          <td>
                            <div className="name">{row.firmName || row.contactPerson || "—"}</div>
                            {row.firmName && row.contactPerson ? <div>{row.contactPerson}</div> : null}
                          </td>
                          <td>{row.mobile || "—"}</td>
                          <td>{[row.city, row.state].filter(Boolean).join(", ") || "—"}</td>
                          {customerType === "Mechanic" ? (
                            <td>{row.category ? <span className="gd-chip">{row.category}</span> : "—"}</td>
                          ) : null}
                          <td className="r">{num(row.scans)}</td>
                          <td className="r">
                            <b>{num(row.points)}</b>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="gd-empty">{showSkeleton ? "Loading…" : "No scans in this period"}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
