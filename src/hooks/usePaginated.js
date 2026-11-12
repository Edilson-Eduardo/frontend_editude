import { useCallback, useEffect, useRef, useState } from "react"
import { errorMessage } from "../services/api"

/**
 * Carrega listas paginadas no formato da API: { items, page, totalPages }.
 * `fetcher(page)` deve devolver essa estrutura. Recarrega quando `key` muda.
 */
export function usePaginated(fetcher, key) {
    const [items, setItems] = useState([])
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const requestId = useRef(0)
    const fetcherRef = useRef(fetcher)
    fetcherRef.current = fetcher

    const load = useCallback(async (nextPage, replace) => {
        const id = ++requestId.current
        setLoading(true)
        setError(null)
        try {
            const data = await fetcherRef.current(nextPage)
            if (id !== requestId.current) return
            setItems((prev) => {
                if (replace) return data.items
                const seen = new Set(prev.map((v) => v.id))
                return [...prev, ...data.items.filter((v) => !seen.has(v.id))]
            })
            setPage(data.page ?? nextPage)
            setTotalPages(data.totalPages ?? 1)
        } catch (err) {
            if (id === requestId.current) setError(errorMessage(err))
        } finally {
            if (id === requestId.current) setLoading(false)
        }
    }, [])

    useEffect(() => {
        setItems([])
        load(1, true)
    }, [key, load])

    return {
        items,
        setItems,
        loading,
        error,
        hasMore: page < totalPages,
        loadMore: () => !loading && load(page + 1, false),
        reload: () => load(1, true),
    }
}
