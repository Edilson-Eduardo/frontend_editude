import { formatDistanceToNow, format } from "date-fns"
import { pt } from "date-fns/locale"

const compact = new Intl.NumberFormat("pt-PT", { notation: "compact", maximumFractionDigits: 1 })

export function formatViews(n) {
    if (!n) return "0 visualizações"
    return `${compact.format(n)} visualizações`
}

export function formatDuration(totalSec) {
    if (!totalSec) return null
    const h = Math.floor(totalSec / 3600)
    const m = Math.floor((totalSec % 3600) / 60)
    const s = Math.floor(totalSec % 60)
    const pad = (v) => String(v).padStart(2, "0")
    return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`
}

export function timeAgo(date) {
    if (!date) return null
    const d = new Date(date)
    if (Number.isNaN(d.getTime())) return null
    return formatDistanceToNow(d, { addSuffix: true, locale: pt })
}

export function formatDate(date, pattern = "d 'de' MMMM 'de' yyyy") {
    if (!date) return null
    return format(new Date(date), pattern, { locale: pt })
}

export function initials(name = "") {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0].toUpperCase())
        .join("")
}
