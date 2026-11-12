import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { FaStar } from "react-icons/fa"
import SaveButton from "./SaveButton"
import { formatDuration, formatViews, timeAgo } from "../../lib/format"

/**
 * Cartão de vídeo com pré-visualização ao passar o rato
 * (percorre as miniaturas devolvidas pela API).
 */
function VideoCard({ video, meta }) {
    const [frame, setFrame] = useState(-1)
    const timer = useRef(null)
    const previews = video.previews ?? []
    const src = frame >= 0 && previews[frame] ? previews[frame] : video.thumbnail
    const duration = video.durationLabel ?? formatDuration(video.durationSec)

    const startPreview = () => {
        if (previews.length < 2 || timer.current) return
        let i = 0
        timer.current = setInterval(() => {
            i = (i + 1) % previews.length
            setFrame(i)
        }, 650)
    }
    const stopPreview = () => {
        clearInterval(timer.current)
        timer.current = null
        setFrame(-1)
    }
    useEffect(() => () => clearInterval(timer.current), [])

    return (
        <article className="group" onMouseEnter={startPreview} onMouseLeave={stopPreview}>
            <Link to={`/watch/${video.id}`} className="block focus-visible:outline-none">
                <div className="relative aspect-video overflow-hidden rounded-xl bg-elevated ring-brand/70 transition group-focus-within:ring-2">
                    {src ? (
                        <img
                            src={src}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                        />
                    ) : (
                        <div className="h-full w-full bg-gradient-to-br from-elevated to-surface" />
                    )}

                    {duration && (
                        <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-1.5 py-0.5 text-xs font-semibold tabular-nums">
                            {duration}
                        </span>
                    )}

                    <SaveButton
                        videoId={video.id}
                        className="absolute right-2 top-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100"
                    />
                </div>

                <div className="mt-3 px-0.5">
                    <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-fg group-hover:text-white">
                        {video.title}
                    </h3>
                    <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-xs text-muted">
                        {meta ?? (
                            <>
                                {video.views != null && <span>{formatViews(video.views)}</span>}
                                {video.addedAt && <span aria-hidden>•</span>}
                                {video.addedAt && <span>{timeAgo(video.addedAt)}</span>}
                                {video.rating != null && (
                                    <span className="ml-auto inline-flex items-center gap-1 text-amber-400/90">
                                        <FaStar className="text-[10px]" />
                                        {video.rating.toFixed(1)}
                                    </span>
                                )}
                            </>
                        )}
                    </p>
                </div>
            </Link>
        </article>
    )
}

export function VideoCardSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="aspect-video rounded-xl bg-elevated" />
            <div className="mt-3 h-4 w-11/12 rounded bg-elevated" />
            <div className="mt-2 h-3 w-1/2 rounded bg-elevated" />
        </div>
    )
}

export default VideoCard
