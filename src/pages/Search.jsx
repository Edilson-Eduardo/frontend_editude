import { useCallback } from "react"
import { useSearchParams } from "react-router-dom"
import { FaSearch } from "react-icons/fa"
import { videoApi } from "../services/api"
import { usePaginated } from "../hooks/usePaginated"
import { ORDERS } from "../lib/categories"
import VideoGrid from "../components/video/VideoGrid"
import EmptyState from "../components/ui/EmptyState"

function Search() {
    const [params, setParams] = useSearchParams()
    const q = params.get("q")?.trim() ?? ""
    const order = ORDERS[params.get("order")] ? params.get("order") : "top-weekly"

    const fetcher = useCallback((page) => videoApi.list({ q, order, page, perPage: 24 }), [q, order])
    const results = usePaginated(fetcher, `${q}|${order}`)

    const setOrder = (value) => {
        const next = new URLSearchParams(params)
        next.set("order", value)
        setParams(next)
    }

    return (
        <div className="mx-auto max-w-[1800px]">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-xl font-bold">
                    Resultados para <span className="text-brand">“{q}”</span>
                </h1>
                <label className="flex items-center gap-2 text-sm text-muted">
                    Ordenar por
                    <select
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                        className="rounded-lg border border-line bg-surface px-3 py-1.5 text-fg outline-none focus:border-brand"
                    >
                        {Object.entries(ORDERS).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <VideoGrid
                {...results}
                empty={
                    <EmptyState
                        icon={<FaSearch />}
                        title="Sem resultados"
                        description="Tenta outras palavras-chave ou termos mais gerais."
                    />
                }
            />
        </div>
    )
}

export default Search
