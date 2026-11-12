import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { FaStar, FaShareAlt } from "react-icons/fa"
import { toast } from "react-toastify"
import { errorMessage, libraryApi, videoApi } from "../services/api"
import { useAuth } from "../context/AuthContext"
import { formatDuration, formatViews, timeAgo } from "../lib/format"
import SaveButton from "../components/video/SaveButton"
import EmptyState from "../components/ui/EmptyState"

function RelatedItem({ video }) {
    return (
        <Link to={`/watch/${video.id}`} className="group flex gap-3">
            <div className="relative aspect-video w-40 shrink-0 overflow-hidden rounded-lg bg-elevated">
                {video.thumbnail && <img src={video.thumbnail} alt="" loading="lazy" className="h-full w-full object-cover" />}
                {video.durationSec > 0 && (
                    <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 text-[11px] font-semibold tabular-nums">
                        {video.durationLabel ?? formatDuration(video.durationSec)}
                    </span>
                )}
            </div>
            <div className="min-w-0">
                <h3 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-white">{video.title}</h3>
                <p className="mt-1 text-xs text-muted">{formatViews(video.views)}</p>
            </div>
        </Link>
    )
}

function Watch({ id }) {
    const { user } = useAuth()
    const [state, setState] = useState({ video: null, loading: true, error: null })
    const [related, setRelated] = useState(null)
    const { video, loading, error } = state

    useEffect(() => {
        let alive = true

        videoApi
            .get(id)
            .then((v) => alive && setState({ video: v, loading: false, error: null }))
            .catch((err) => alive && setState({ video: null, loading: false, error: errorMessage(err) }))
        videoApi
            .related(id)
            .then((items) => alive && setRelated(items))
            .catch(() => alive && setRelated([]))

        return () => {
            alive = false
        }
    }, [id])

    // regista no histórico (apenas utilizadores com sessão)
    useEffect(() => {
        if (user && video?.id) libraryApi.recordWatch(video.id).catch(() => {})
    }, [user, video?.id])

    const share = async () => {
        const url = window.location.href
        try {
            if (navigator.share) await navigator.share({ title: video.title, url })
            else {
                await navigator.clipboard.writeText(url)
                toast.success("Link copiado")
            }
        } catch {
            /* utilizador cancelou */
        }
    }

    if (error) {
        return (
            <EmptyState
                title="Vídeo indisponível"
                description={error}
                action={<Link to="/" className="btn-primary">Voltar ao início</Link>}
            />
        )
    }

    return (
        <div className="mx-auto grid max-w-[1700px] gap-8 xl:grid-cols-[minmax(0,1fr)_400px]">
            <div className="min-w-0">
                <div className="aspect-video overflow-hidden rounded-xl bg-black">
                    {video?.embedUrl ? (
                        <iframe
                            key={video.id}
                            src={video.embedUrl}
                            title={video.title}
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                            referrerPolicy="no-referrer"
                            className="h-full w-full"
                        />
                    ) : (
                        <div className="h-full w-full animate-pulse bg-elevated" />
                    )}
                </div>

                {loading || !video ? (
                    <div className="mt-5 animate-pulse space-y-3">
                        <div className="h-6 w-3/4 rounded bg-elevated" />
                        <div className="h-4 w-1/3 rounded bg-elevated" />
                    </div>
                ) : (
                    <>
                        <h1 className="mt-5 text-xl font-bold leading-snug md:text-2xl">{video.title}</h1>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                                <span>{formatViews(video.views)}</span>
                                {video.addedAt && <span>{timeAgo(video.addedAt)}</span>}
                                {video.rating != null && (
                                    <span className="inline-flex items-center gap-1 text-amber-400">
                                        <FaStar /> {video.rating.toFixed(1)}
                                    </span>
                                )}
                            </p>
                            <div className="flex gap-2">
                                <SaveButton videoId={video.id} variant="full" />
                                <button onClick={share} className="btn-ghost">
                                    <FaShareAlt /> Partilhar
                                </button>
                            </div>
                        </div>

                        {!user && (
                            <p className="mt-4 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-muted">
                                <Link to="/login" state={{ from: { pathname: `/watch/${video.id}` } }} className="font-semibold text-brand hover:underline">
                                    Entra
                                </Link>{" "}
                                para guardar este vídeo e ver mais tarde.
                            </p>
                        )}

                        {video.tags.length > 0 && (
                            <div className="mt-5 flex flex-wrap gap-2">
                                {video.tags.map((tag) => (
                                    <Link
                                        key={tag}
                                        to={`/search?q=${encodeURIComponent(tag)}`}
                                        className="rounded-full bg-white/5 px-3 py-1 text-xs text-fg/80 hover:bg-white/10"
                                    >
                                        #{tag}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            <aside>
                <h2 className="mb-4 font-semibold">A seguir</h2>
                <div className="flex flex-col gap-4">
                    {related === null
                        ? Array.from({ length: 6 }).map((_, i) => (
                              <div key={i} className="flex animate-pulse gap-3">
                                  <div className="aspect-video w-40 rounded-lg bg-elevated" />
                                  <div className="flex-1 space-y-2">
                                      <div className="h-3 rounded bg-elevated" />
                                      <div className="h-3 w-2/3 rounded bg-elevated" />
                                  </div>
                              </div>
                          ))
                        : related.map((v) => <RelatedItem key={v.id} video={v} />)}
                </div>
            </aside>
        </div>
    )
}

// `key` reinicia o estado ao navegar entre vídeos
export default function WatchRoute() {
    const { id } = useParams()
    return <Watch key={id} id={id} />
}
