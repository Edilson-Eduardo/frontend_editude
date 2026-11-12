import { useCallback } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { FaPlay } from "react-icons/fa"
import { videoApi } from "../services/api"
import { usePaginated } from "../hooks/usePaginated"
import { CATEGORIES, ORDERS } from "../lib/categories"
import { formatViews } from "../lib/format"
import VideoGrid from "../components/video/VideoGrid"
import SaveButton from "../components/video/SaveButton"

function CategoryChips({ active, onSelect }) {
    return (
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
            {CATEGORIES.map((c) => (
                <button
                    key={c.slug}
                    onClick={() => onSelect(c.slug)}
                    aria-pressed={active === c.slug}
                    className={`shrink-0 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
                        active === c.slug ? "bg-fg text-canvas" : "bg-white/8 text-fg hover:bg-white/15"
                    }`}
                >
                    {c.label}
                </button>
            ))}
        </div>
    )
}

function Hero({ video }) {
    return (
        <section className="relative mb-10 overflow-hidden rounded-2xl border border-line bg-surface">
            <img src={video.thumbnail} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40 blur-[1px]" />
            <div className="absolute inset-0 bg-gradient-to-r from-canvas via-canvas/80 to-transparent" />
            <div className="relative flex min-h-[260px] flex-col justify-end gap-4 p-6 md:min-h-[340px] md:max-w-2xl md:p-10">
                <span className="w-fit rounded-full bg-brand/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand">
                    Destaque
                </span>
                <h1 className="line-clamp-2 text-2xl font-extrabold leading-tight md:text-4xl">{video.title}</h1>
                <p className="text-sm text-muted">
                    {formatViews(video.views)}
                    {video.durationLabel && ` · ${video.durationLabel}`}
                </p>
                <div className="flex flex-wrap gap-3">
                    <Link to={`/watch/${video.id}`} className="btn-primary px-6 py-3 text-base">
                        <FaPlay /> Assistir
                    </Link>
                    <SaveButton videoId={video.id} variant="full" className="px-6 py-3 text-base" />
                </div>
            </div>
        </section>
    )
}

function Home() {
    const [params, setParams] = useSearchParams()
    const order = ORDERS[params.get("order")] ? params.get("order") : "top-weekly"
    const categorySlug = params.get("cat") ?? "todos"
    const category = CATEGORIES.find((c) => c.slug === categorySlug) ?? CATEGORIES[0]

    const fetcher = useCallback(
        (page) => videoApi.list({ q: category.query || undefined, order, page, perPage: 24 }),
        [category.query, order]
    )
    const feed = usePaginated(fetcher, `${order}|${category.query}`)

    const selectCategory = (slug) => {
        const next = new URLSearchParams(params)
        if (slug === "todos") next.delete("cat")
        else next.set("cat", slug)
        setParams(next)
    }

    const [featured, ...rest] = feed.items
    const showHero = Boolean(featured?.thumbnail)

    return (
        <div className="mx-auto max-w-[1800px]">
            <div className="sticky top-16 z-20 -mx-4 mb-6 bg-canvas/95 px-4 py-3 backdrop-blur md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
                <CategoryChips active={category.slug} onSelect={selectCategory} />
            </div>

            {showHero && <Hero video={featured} />}

            <div className="mb-5 flex items-end justify-between">
                <h2 className="text-xl font-bold">
                    {ORDERS[order]}
                    {category.slug !== "todos" && <span className="text-muted"> · {category.label}</span>}
                </h2>
            </div>

            <VideoGrid {...feed} items={showHero ? rest : feed.items} />
        </div>
    )
}

export default Home
