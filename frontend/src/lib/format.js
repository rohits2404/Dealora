import { format, formatDistanceToNow, isValid } from "date-fns";

export function currency(value = 0, { compact = false } = {}) {
    const n = Number(value) || 0;
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: compact ? "compact" : "standard",
        maximumFractionDigits: compact ? 1 : 0,
    }).format(n);
}

export function shortDate(value) {
    const d = new Date(value);
    return isValid(d) ? format(d, "dd MMM yyyy") : "—";
}

export function timeOf(value) {
    const d = new Date(value);
    return isValid(d) ? format(d, "hh:mm a") : "";
}

export function relative(value) {
    const d = new Date(value);
    return isValid(d) ? `${formatDistanceToNow(d)} ago` : "";
}

export function dateInputValue(value) {
    const d = new Date(value);
    return isValid(d) ? format(d, "yyyy-MM-dd") : "";
}
