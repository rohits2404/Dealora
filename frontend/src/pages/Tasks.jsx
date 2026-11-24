import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { isPast, isToday } from "date-fns";
import {
    Plus,
    MoreHorizontal,
    Pencil,
    Trash2,
    CalendarCheck,
    CheckCircle2,
    Circle,
    CircleDot,
    Clock,
    AlertTriangle,
    Building2,
} from "lucide-react";

import { PageHeader } from "../components/common/PageHeader";
import { EmptyState } from "../components/common/EmptyState";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import { StatCard } from "../components/common/StatCard";

import {
    Button,
    Card,
    Input,
    Textarea,
    Select,
    Field,
    Badge,
    Dialog,
    Dropdown,
    DropdownItem,
    Tabs,
    Spinner,
} from "../components/ui";

import { tasksApi, leadsApi } from "../lib/services";
import { shortDate, dateInputValue } from "../lib/format";
import {
    TASK_STATUSES,
    TASK_PRIORITIES,
    TASK_STATUS_STYLES,
    PRIORITY_STYLES,
} from "../lib/constants";
import { cn } from "../lib/utils";

const PRIORITY_BAR = {
    High: "bg-rose-400",
    Medium: "bg-amber-400",
    Low: "bg-slate-300",
};

const GROUPS = [
    {
        key: "overdue",
        label: "Overdue",
        labelClass: "text-rose-700",
        countClass: "bg-rose-50 text-rose-700",
    },
    {
        key: "today",
        label: "Due Today",
        labelClass: "text-amber-700",
        countClass: "bg-amber-50 text-amber-700",
    },
    {
        key: "upcoming",
        label: "Upcoming",
        labelClass: "text-ink",
        countClass: "bg-surface-muted text-ink-soft",
    },
    {
        key: "nodate",
        label: "No Due Date",
        labelClass: "text-ink-soft",
        countClass: "bg-surface-muted text-ink-soft",
    },
    {
        key: "completed",
        label: "Completed",
        labelClass: "text-brand-700",
        countClass: "bg-brand-50 text-brand-700",
    },
];

const STATUS_TABS = [
    { value: "all", label: "All" },
    { value: "Pending", label: "Pending" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
];

function isOverdue(task) {
    if (!task.dueDate || task.status === "Completed") return false;
    const d = new Date(task.dueDate);
    return isPast(d) && !isToday(d);
}

function groupKey(task) {
    if (task.status === "Completed") return "completed";
    if (!task.dueDate) return "nodate";
    const d = new Date(task.dueDate);
    if (isToday(d)) return "today";
    if (isPast(d)) return "overdue";
    return "upcoming";
}

function TaskFormDialog({ open, onClose, task, leads, onSaved }) {
    const isEdit = Boolean(task);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    useEffect(() => {
        if (open) {
            reset(
                task
                    ? {
                          title: task.title ?? "",
                          description: task.description ?? "",
                          dueDate: dateInputValue(task.dueDate),
                          status: task.status ?? "Pending",
                          priority: task.priority ?? "Medium",
                          relatedLead: task.relatedLead?._id ?? "",
                      }
                    : {
                          title: "",
                          description: "",
                          dueDate: "",
                          status: "Pending",
                          priority: "Medium",
                          relatedLead: "",
                      },
            );
        }
    }, [open, task, reset]);

    const onSubmit = async (values) => {
        const payload = {
            title: values.title.trim(),
            description: values.description?.trim() || undefined,
            dueDate: values.dueDate || undefined,
            status: values.status,
            priority: values.priority,
            relatedLead: values.relatedLead || null,
        };

        try {
            if (isEdit) {
                await tasksApi.update(task._id, payload);
                toast.success("Task Updated");
            } else {
                await tasksApi.create(payload);
                toast.success("Task Created");
            }

            onSaved();
            onClose();
        } catch (err) {
            toast.error(err?.message ?? "Something Went Wrong");
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            title={isEdit ? "Edit Task" : "New Task"}
            description={
                isEdit
                    ? "Update The Details Below."
                    : "Fill In The Details To Create A Task."
            }
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Field label="Title" error={errors.title?.message}>
                    <Input
                        placeholder="E.g. Follow Up With Acme Corp"
                        {...register("title", {
                            required: "Title Is Required",
                        })}
                    />
                </Field>

                <Field label="Description">
                    <Textarea
                        rows={3}
                        placeholder="Optional Notes…"
                        {...register("description")}
                    />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                    <Field label="Due Date">
                        <Input type="date" {...register("dueDate")} />
                    </Field>

                    <Field label="Priority">
                        <Select {...register("priority")}>
                            {TASK_PRIORITIES.map((p) => (
                                <option key={p} value={p}>
                                    {p}
                                </option>
                            ))}
                        </Select>
                    </Field>
                </div>

                <Field label="Status">
                    <Select {...register("status")}>
                        {TASK_STATUSES.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </Select>
                </Field>

                <Field label="Linked Lead">
                    <Select {...register("relatedLead")}>
                        <option value="">No Linked Lead</option>
                        {leads.map((l) => (
                            <option key={l._id} value={l._id}>
                                {l.name}
                                {l.company ? ` — ${l.company}` : ""}
                            </option>
                        ))}
                    </Select>
                </Field>

                <div className="flex gap-3 pt-1">
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        className="flex-1"
                        loading={isSubmitting}
                    >
                        {isEdit ? "Save Changes" : "Create Task"}
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}

function TaskRow({ task, onToggle, onEdit, onDelete }) {
    const done = task.status === "Completed";
    const inProg = task.status === "In Progress";
    const overdue = isOverdue(task);
    const dueToday = task.dueDate ? isToday(new Date(task.dueDate)) : false;

    return (
        <div className="group relative flex items-start gap-3 px-5 py-4 transition-colors hover:bg-surface-muted/50">
            <span
                aria-hidden
                className={cn(
                    "absolute left-0 top-3 bottom-3 w-0.75 rounded-full",
                    PRIORITY_BAR[task.priority] ?? "bg-slate-300",
                )}
            />

            <button
                onClick={() => onToggle(task)}
                aria-label={done ? "Mark As Pending" : "Mark As Completed"}
                className={cn(
                    "mt-0.5 shrink-0 rounded-full p-0.5 transition-colors",
                    done
                        ? "text-brand-600 hover:text-brand-400"
                        : inProg
                          ? "text-sky-500 hover:text-brand-500"
                          : "text-ink-soft hover:text-brand-500",
                )}
            >
                {done ? (
                    <CheckCircle2 className="h-5 w-5" />
                ) : inProg ? (
                    <CircleDot className="h-5 w-5" />
                ) : (
                    <Circle className="h-5 w-5" />
                )}
            </button>

            <div className="min-w-0 flex-1">
                <p
                    className={cn(
                        "text-sm font-medium leading-snug",
                        done ? "line-through text-ink-soft" : "text-ink",
                    )}
                >
                    {task.title}
                </p>

                {task.description && (
                    <p className="mt-0.5 truncate text-xs text-ink-soft">
                        {task.description}
                    </p>
                )}

                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {task.dueDate && (
                        <span
                            className={cn(
                                "inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-medium",
                                overdue
                                    ? "bg-rose-50 text-rose-700"
                                    : dueToday
                                      ? "bg-amber-50 text-amber-700"
                                      : "bg-surface-muted text-ink-soft",
                            )}
                        >
                            {overdue ? (
                                <AlertTriangle className="h-3 w-3" />
                            ) : (
                                <Clock className="h-3 w-3" />
                            )}

                            {overdue
                                ? `Overdue · ${shortDate(task.dueDate)}`
                                : dueToday
                                  ? `Today · ${shortDate(task.dueDate)}`
                                  : shortDate(task.dueDate)}
                        </span>
                    )}

                    <Badge
                        className={cn(
                            "text-xs",
                            PRIORITY_STYLES[task.priority],
                        )}
                    >
                        {task.priority}
                    </Badge>

                    <Badge
                        className={cn(
                            "text-xs",
                            TASK_STATUS_STYLES[task.status],
                        )}
                    >
                        {task.status}
                    </Badge>

                    {task.relatedLead && (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                            <Building2 className="h-3 w-3" />
                            {task.relatedLead.name}
                        </span>
                    )}
                </div>
            </div>

            <div className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
                <Dropdown
                    trigger={
                        <button
                            className="rounded-lg p-1.5 text-ink-soft transition hover:bg-surface-muted hover:text-ink"
                            aria-label="Task Actions"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </button>
                    }
                >
                    <DropdownItem onClick={() => onEdit(task)}>
                        <Pencil className="h-4 w-4" /> Edit
                    </DropdownItem>

                    <DropdownItem danger onClick={() => onDelete(task)}>
                        <Trash2 className="h-4 w-4" /> Delete
                    </DropdownItem>
                </Dropdown>
            </div>
        </div>
    );
}

function GroupHeader({ label, count, labelClass, countClass }) {
    return (
        <div className="flex items-center gap-2 border-b border-line bg-surface-muted/30 px-5 py-2">
            <span
                className={cn(
                    "text-xs font-semibold uppercase tracking-wide",
                    labelClass,
                )}
            >
                {label}
            </span>

            <span
                className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-semibold",
                    countClass,
                )}
            >
                {count}
            </span>
        </div>
    );
}

function ProgressCard({ completed, total }) {
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <Card className="px-5 py-4">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-ink">
                    {completed} Of {total} Tasks Done
                </span>

                <span className="text-sm font-semibold text-brand-700">
                    {pct}%
                </span>
            </div>

            <div className="h-2 w-full rounded-full bg-surface-muted overflow-hidden">
                <div
                    className="h-full rounded-full bg-linear-to-r from-brand-400 to-brand-600 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                />
            </div>
        </Card>
    );
}

export default function Tasks() {
    const [tasks, setTasks] = useState(null);
    const [leads, setLeads] = useState([]);

    const [tab, setTab] = useState("all");
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [toDelete, setToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const load = () => {
        setTasks(null);
        tasksApi
            .list()
            .then((res) => setTasks(res.tasks))
            .catch(() => setTasks([]));
    };

    useEffect(() => {
        load();
        leadsApi
            .list()
            .then((res) => setLeads(res.leads))
            .catch(() => {});
    }, []);

    const stats = useMemo(() => {
        if (!tasks) {
            return {
                total: 0,
                pending: 0,
                overdue: 0,
                completed: 0,
            };
        }

        return {
            total: tasks.length,
            pending: tasks.filter((t) => t.status === "Pending").length,
            overdue: tasks.filter(isOverdue).length,
            completed: tasks.filter((t) => t.status === "Completed").length,
        };
    }, [tasks]);

    const filtered = useMemo(() => {
        if (!tasks) return [];
        if (tab === "all") return tasks;
        return tasks.filter((t) => t.status === tab);
    }, [tasks, tab]);

    const groupedSections = useMemo(() => {
        const map = {};
        GROUPS.forEach((g) => (map[g.key] = []));

        filtered.forEach((t) => {
            const key = groupKey(t);
            map[key].push(t);
        });

        return GROUPS.filter((g) => map[g.key].length > 0).map((g) => ({
            ...g,
            tasks: map[g.key],
        }));
    }, [filtered]);

    const openNew = () => {
        setEditing(null);
        setFormOpen(true);
    };

    const openEdit = (task) => {
        setEditing(task);
        setFormOpen(true);
    };

    const handleToggle = async (task) => {
        const next = task.status === "Completed" ? "Pending" : "Completed";

        try {
            await tasksApi.update(task._id, { status: next });
            load();
        } catch (err) {
            toast.error(err?.message ?? "Could Not Update Task");
        }
    };

    const confirmDelete = async () => {
        setDeleting(true);

        try {
            await tasksApi.remove(toDelete._id);
            toast.success("Task Deleted");
            setToDelete(null);
            load();
        } catch (err) {
            toast.error(err?.message ?? "Could Not Delete Task");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Follow-Up"
                subtitle="Stay On Top Of Every Commitment."
            >
                <Button onClick={openNew}>
                    <Plus className="h-4 w-4" /> Add Task
                </Button>
            </PageHeader>

            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                <StatCard
                    label="Total Tasks"
                    value={stats.total}
                    icon={CalendarCheck}
                />
                <StatCard label="Pending" value={stats.pending} icon={Circle} />
                <StatCard
                    label="Overdue"
                    value={stats.overdue}
                    icon={AlertTriangle}
                />
                <StatCard
                    label="Completed"
                    value={stats.completed}
                    icon={CheckCircle2}
                    accent
                />
            </div>

            {tasks !== null && (
                <ProgressCard completed={stats.completed} total={stats.total} />
            )}

            <Card className="overflow-hidden">
                <div className="border-b border-line px-5 py-3">
                    <Tabs value={tab} onChange={setTab} tabs={STATUS_TABS} />
                </div>

                {tasks === null ? (
                    <div className="flex items-center justify-center py-16">
                        <Spinner />
                    </div>
                ) : filtered.length === 0 ? (
                    <EmptyState
                        icon={CalendarCheck}
                        title="No Tasks Here"
                        description={
                            tab === "all"
                                ? "Add Your First Follow-Up To Get Started."
                                : `No Tasks With Status "${tab}".`
                        }
                        action={
                            tab === "all" ? (
                                <Button onClick={openNew}>
                                    <Plus className="h-4 w-4" /> Add Task
                                </Button>
                            ) : null
                        }
                    />
                ) : (
                    <div>
                        {groupedSections.map((group) => (
                            <div key={group.key}>
                                <GroupHeader
                                    label={group.label}
                                    count={group.tasks.length}
                                    labelClass={group.labelClass}
                                    countClass={group.countClass}
                                />

                                <div className="divide-y divide-line">
                                    {group.tasks.map((task) => (
                                        <TaskRow
                                            key={task._id}
                                            task={task}
                                            onToggle={handleToggle}
                                            onEdit={openEdit}
                                            onDelete={setToDelete}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            <TaskFormDialog
                open={formOpen}
                onClose={() => setFormOpen(false)}
                task={editing}
                leads={leads}
                onSaved={load}
            />

            <ConfirmDialog
                open={Boolean(toDelete)}
                onClose={() => setToDelete(null)}
                onConfirm={confirmDelete}
                loading={deleting}
                title="Delete This Task?"
                description={`"${toDelete?.title}" Will Be Permanently Removed.`}
                confirmLabel="Delete Task"
            />
        </div>
    );
}
