import React, { useEffect, useMemo, useState } from "react";
import { Alert, Badge, Button, Col, Form, InputGroup, Row, Spinner, Table } from "react-bootstrap";
import { CheckLg, PersonPlus, Search, ShieldLock, Trash } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../components/Layout";
import {
    backendGetPermissions,
    backendGetRolePermissions,
    backendGetUserPermissions,
    backendUpdateRolePermission,
} from "../../helpers/backend_helper";

interface RolePermission {
    role: string;
    canAccess: string[];
    isNew?: boolean;
}

// Matrix columns; anything else (approver, plants, reports...) is shown as a named switch in "Other"
const ACTIONS = ["read", "create", "update", "delete", "export", "import"];

const MODULE_LABELS: Record<string, string> = {
    dashboard: "Dashboard",
    users: "Users",
    customers: "Customers",
    transactions: "Transactions",
    redemptions: "Redemptions",
    loyaltyscheme: "Loyalty Scheme",
    gift: "Gifts",
    coupons: "QR Coupons",
    products: "Products",
    category: "Category",
    subcategory: "Sub Category",
    reports: "Reports",
    setting: "Settings",
    permission: "Permissions",
    address: "Address",
    callsummary: "Call Summary",
    news: "News",
};

const OTHER_LABELS: Record<string, string> = {
    kycapprover: "KYC approver",
    payeeapprover: "Payee approver",
    approver: "Approver",
    transfer: "Transfer",
    delhi: "Delhi plant",
    dewas: "Dewas plant",
    kshipra: "Kshipra plant",
    search: "Search",
    damageentryscan: "Damage entry scan",
    otprequest: "OTP log",
    cashfree: "Cashfree report",
    cashfreeimport: "Cashfree import",
    cashfreeexport: "Cashfree export",
    send: "Send",
};

const labelOf = (module: string) => MODULE_LABELS[module] || module.charAt(0).toUpperCase() + module.slice(1);
const actionOf = (permission: string) => permission.slice(permission.indexOf(".") + 1);
const sameRoles = (a: RolePermission[], b: RolePermission[]) =>
    JSON.stringify(a.map((r) => [r.role.trim(), [...r.canAccess].sort()])) ===
    JSON.stringify(b.map((r) => [r.role.trim(), [...r.canAccess].sort()]));

export default function SettingPermission() {
    const dispatch = useDispatch();
    const myPermissions = useSelector((state: any) => state?.permission?.permission);
    const canUpdate = Array.isArray(myPermissions) && myPermissions.includes("permission.update");

    const [allPermissions, setAllPermissions] = useState<string[]>([]);
    const [saved, setSaved] = useState<RolePermission[]>([]);
    const [roles, setRoles] = useState<RolePermission[]>([]);
    const [selected, setSelected] = useState(0);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "danger"; text: string } | null>(null);

    const load = async () => {
        setIsLoading(true);
        try {
            const [permRes, roleRes] = await Promise.all([backendGetPermissions(), backendGetRolePermissions()]);
            const list: string[] = Array.isArray(permRes?.data) ? permRes.data : [];
            const roleList: RolePermission[] = (Array.isArray(roleRes?.data) ? roleRes.data : []).map((r: any) => ({
                role: String(r?.role || ""),
                canAccess: Array.isArray(r?.canAccess) ? r.canAccess : [],
            }));
            setAllPermissions(list);
            setSaved(roleList);
            setRoles(roleList);
            setSelected((index) => Math.min(index, Math.max(roleList.length - 1, 0)));
        } catch (error: any) {
            setMessage({ type: "danger", text: error?.response?.data?.message || "Unable to load permissions" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const isDirty = !sameRoles(roles, saved);
    useEffect(() => {
        const warn = (event: BeforeUnloadEvent) => {
            if (!isDirty) return;
            event.preventDefault();
            event.returnValue = "";
        };
        window.addEventListener("beforeunload", warn);
        return () => window.removeEventListener("beforeunload", warn);
    }, [isDirty]);

    // { module: { actions: {read: 'x.read', ...}, other: ['x.approver', ...] } } in the order the server lists them
    const modules = useMemo(() => {
        const grouped: Record<string, { actions: Record<string, string>; other: string[] }> = {};
        allPermissions.forEach((permission) => {
            const module = permission.split(".")[0];
            grouped[module] = grouped[module] || { actions: {}, other: [] };
            const action = actionOf(permission);
            if (ACTIONS.includes(action)) grouped[module].actions[action] = permission;
            else grouped[module].other.push(permission);
        });
        return Object.entries(grouped);
    }, [allPermissions]);

    const visibleModules = modules.filter(([module, group]) => {
        const term = search.trim().toLowerCase();
        if (!term) return true;
        return labelOf(module).toLowerCase().includes(term) ||
            [...Object.values(group.actions), ...group.other].some((p) => p.includes(term) || (OTHER_LABELS[actionOf(p)] || "").toLowerCase().includes(term));
    });

    const role = roles[selected];
    const has = (permission: string) => !!role?.canAccess.includes(permission);
    const known = new Set(allPermissions);
    const oldPermissions = role ? role.canAccess.filter((p) => !known.has(p)) : [];

    const updateRole = (change: (current: RolePermission) => RolePermission) => {
        setMessage(null);
        setRoles((list) => list.map((item, index) => (index === selected ? change(item) : item)));
    };

    const setMany = (permissions: string[], on: boolean) =>
        updateRole((current) => ({
            ...current,
            canAccess: on
                ? Array.from(new Set([...current.canAccess, ...permissions]))
                : current.canAccess.filter((p) => !permissions.includes(p)),
        }));

    const addRole = () => {
        setRoles((list) => [...list, { role: "", canAccess: [], isNew: true }]);
        setSelected(roles.length);
        setSearch("");
        setMessage(null);
    };

    const removeRole = () => {
        if (!role) return;
        if (!role.isNew && !window.confirm(`Remove role "${role.role}"? It is saved only when you press Save, and only if no user has this role.`)) return;
        setRoles((list) => list.filter((_, index) => index !== selected));
        setSelected((index) => Math.max(index - 1, 0));
        setMessage(null);
    };

    const discard = () => {
        setRoles(saved);
        setSelected((index) => Math.min(index, Math.max(saved.length - 1, 0)));
        setMessage(null);
    };

    const save = async () => {
        const names = roles.map((r) => r.role.trim().toLowerCase());
        const emptyIndex = names.findIndex((name) => !name);
        if (emptyIndex !== -1) {
            setSelected(emptyIndex);
            setMessage({ type: "danger", text: "Please enter a name for the new role." });
            return;
        }
        const duplicate = names.find((name, index) => names.indexOf(name) !== index);
        if (duplicate) {
            setMessage({ type: "danger", text: `Role "${duplicate}" is added twice.` });
            return;
        }
        setIsSaving(true);
        setMessage(null);
        try {
            const res = await backendUpdateRolePermission(roles.map(({ role: name, canAccess }) => ({ role: name.trim(), canAccess })));
            if (res?.isError) throw { response: { data: res } };
            await load();
            setMessage({ type: "success", text: "Permissions saved. Users get the new permissions on their next page load." });
            // refresh this user's own menu right away
            const mine = await backendGetUserPermissions().catch(() => null);
            if (mine && !mine.isError && Array.isArray(mine.data?.canAccess)) {
                dispatch({ type: "GET_PERMISSION", payload: mine.data.canAccess });
            }
        } catch (error: any) {
            setMessage({ type: "danger", text: error?.response?.data?.message || "Unable to save permissions" });
        } finally {
            setIsSaving(false);
        }
    };

    const renderCheck = (permission: string | undefined, label?: string) => {
        if (!permission) return <span className="text-muted">–</span>;
        return (
            <Form.Check
                type="checkbox"
                id={`perm-${selected}-${permission}`}
                className="pm-check"
                checked={has(permission)}
                disabled={!canUpdate}
                onChange={(event) => setMany([permission], event.target.checked)}
                label={label}
                title={permission}
            />
        );
    };

    return (
        <Layout>
            <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-4">
                <div>
                    <h3 className="mb-1">Roles &amp; Permissions</h3>
                    <div className="text-muted small">Pick a role on the left, tick what it can do, then Save.</div>
                </div>
                {canUpdate ? (
                    <div className="d-flex align-items-center gap-2">
                        {isDirty ? <Badge bg="warning" text="dark">Unsaved changes</Badge> : null}
                        <Button className="cd-btn cd-btn-outline" disabled={!isDirty || isSaving} onClick={discard}>
                            Discard
                        </Button>
                        <Button variant="dark" className="cd-btn" disabled={!isDirty || isSaving} onClick={save}>
                            {isSaving ? <Spinner animation="border" size="sm" /> : <CheckLg />} Save
                        </Button>
                    </div>
                ) : null}
            </div>

            {message ? (
                <Alert variant={message.type} dismissible onClose={() => setMessage(null)}>{message.text}</Alert>
            ) : null}
            {!canUpdate && !isLoading ? (
                <Alert variant="secondary"><ShieldLock /> View only: you need the permission.update permission to change roles.</Alert>
            ) : null}

            {isLoading ? (
                <div className="text-center py-5"><Spinner animation="border" /></div>
            ) : (
                <Row className="g-3">
                    <Col lg={3}>
                        <div className="pm-card">
                            <div className="pm-card-title">Roles</div>
                            <div className="pm-role-list">
                                {roles.map((item, index) => {
                                    const changed = !saved.some((s) => s.role === item.role && sameRoles([s], [item]));
                                    return (
                                        <button
                                            type="button"
                                            key={index}
                                            className={`pm-role ${index === selected ? "active" : ""}`}
                                            onClick={() => { setSelected(index); setMessage(null); }}
                                        >
                                            <span className="pm-role-name">{item.role.trim() || "New role"}</span>
                                            <span className="pm-role-meta">
                                                {item.canAccess.length} permissions
                                                {item.isNew ? <Badge bg="info" className="ms-2">New</Badge> : changed ? <Badge bg="warning" text="dark" className="ms-2">Edited</Badge> : null}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                            {canUpdate ? (
                                <Button className="cd-btn cd-btn-outline w-100 mt-2" onClick={addRole}>
                                    <PersonPlus /> Add role
                                </Button>
                            ) : null}
                        </div>
                    </Col>

                    <Col lg={9}>
                        {role ? (
                            <div className="pm-card">
                                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                                    <div className="flex-grow-1" style={{ maxWidth: 360 }}>
                                        {role.isNew ? (
                                            <Form.Control
                                                autoFocus
                                                placeholder="Role name, e.g. Sales Manager"
                                                value={role.role}
                                                maxLength={50}
                                                onChange={(event) => updateRole((current) => ({ ...current, role: event.target.value }))}
                                            />
                                        ) : (
                                            <>
                                                <div className="pm-editing-label">Editing role</div>
                                                <h5 className="mb-0">{role.role}</h5>
                                            </>
                                        )}
                                    </div>
                                    <div className="d-flex flex-wrap gap-2">
                                        <InputGroup size="sm" style={{ width: 220 }}>
                                            <InputGroup.Text><Search /></InputGroup.Text>
                                            <Form.Control placeholder="Search module" value={search} onChange={(e) => setSearch(e.target.value)} />
                                        </InputGroup>
                                        {canUpdate ? (
                                            <>
                                                <Button size="sm" className="cd-btn-outline" onClick={() => setMany(allPermissions, true)}>Select all</Button>
                                                <Button size="sm" className="cd-btn-outline" onClick={() => setMany(allPermissions, false)}>Clear all</Button>
                                                <Button size="sm" variant="outline-danger" onClick={removeRole}><Trash /> Remove role</Button>
                                            </>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="pm-table-wrap">
                                    <Table className="mb-0 pm-table" hover>
                                        <thead>
                                            <tr>
                                                <th>Module</th>
                                                <th className="text-center">All</th>
                                                {ACTIONS.map((action) => <th key={action} className="text-center text-capitalize">{action}</th>)}
                                                <th>Other</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {visibleModules.map(([module, group]) => {
                                                const all = [...Object.values(group.actions), ...group.other];
                                                const count = all.filter(has).length;
                                                return (
                                                    <tr key={module}>
                                                        <td className="fw-semibold text-nowrap">{labelOf(module)}</td>
                                                        <td className="text-center">
                                                            <Form.Check
                                                                type="checkbox"
                                                                className="pm-check"
                                                                checked={count === all.length}
                                                                ref={(el: HTMLInputElement | null) => { if (el) el.indeterminate = count > 0 && count < all.length; }}
                                                                disabled={!canUpdate}
                                                                onChange={(event) => setMany(all, event.target.checked)}
                                                                title={`All ${labelOf(module)} permissions`}
                                                            />
                                                        </td>
                                                        {ACTIONS.map((action) => <td key={action} className="text-center">{renderCheck(group.actions[action])}</td>)}
                                                        <td>
                                                            <div className="d-flex flex-wrap gap-3">
                                                                {group.other.map((permission) => (
                                                                    <span key={permission}>{renderCheck(permission, OTHER_LABELS[actionOf(permission)] || actionOf(permission))}</span>
                                                                ))}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {!visibleModules.length ? (
                                                <tr><td colSpan={ACTIONS.length + 3} className="text-center text-muted py-4">No module matches "{search}"</td></tr>
                                            ) : null}
                                        </tbody>
                                    </Table>
                                </div>
                                <div className="small text-muted mt-2">
                                    {role.canAccess.filter((p) => known.has(p)).length} of {allPermissions.length} permissions selected
                                    {oldPermissions.length ? ` · ${oldPermissions.length} older permission(s) kept as they are` : ""}
                                </div>
                            </div>
                        ) : (
                            <div className="pm-card text-center text-muted py-5">No roles yet. Use Add role.</div>
                        )}
                    </Col>
                </Row>
            )}
        </Layout>
    );
}
