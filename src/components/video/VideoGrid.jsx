import { useEffect, useRef } from "react"
import VideoCard, { VideoCardSkeleton } from "./VideoCard"
import EmptyState from "../ui/EmptyState"

/**
 * Grelha de vídeos com scroll infinito.
 * Recebe o resultado de `usePaginated` (items, loading, error, hasMore, loadMore, reload).
 */
function VideoGrid({ items, loading, error, hasMore, loadMore, reload, empty, renderMeta }) {
    const sentinel = useRef(null)

    useEffect(() => {
        if (!hasMore || loading || error || !sentinel.current) return
        const io = new IntersectionObserver(([entry]) => entry.isIntersecting && loadMore(), {
            rootMargin: "600px",
        })
        io.observe(sentinel.current)
        return () => io.disconnect()
    }, [hasMore, loading, error, loadMore])

    if (!loading && error && items.length === 0) {
        return (
            <EmptyState
                title="Não foi possível carregar os vídeos"
                description={error}
                action={<button className="btn-primary" onClick={reload}>Tentar novamente</button>}
            />
        )
    }

    if (!loading && items.length === 0) return empty ?? <EmptyState title="Nenhum vídeo encontrado" />

    return (
        <>
            <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {items.map((video) => (
                    <VideoCard key={video.id} video={video} meta={renderMeta?.(video)} />
                ))}
                {loading &&
                    Array.from({ length: items.length ? 4 : 12 }).map((_, i) => <VideoCardSkeleton key={`s${i}`} />)}
            </div>

            {error && items.length > 0 && (
                <div className="mt-8 text-center">
                    <button className="btn-ghost" onClick={loadMore}>Tentar carregar mais</button>
                </div>
            )}
            <div ref={sentinel} aria-hidden className="h-px" />
        </>
    )
}

export default VideoGrid
