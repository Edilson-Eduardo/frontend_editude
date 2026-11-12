import { useCallback } from "react"
import { Link } from "react-router-dom"
import { FaBookmark, FaHistory, FaTrash } from "react-icons/fa"
import { toast } from "react-toastify"
import { errorMessage, libraryApi } from "../services/api"
import { usePaginated } from "../hooks/usePaginated"
import { useLibrary } from "../context/LibraryContext"
import { useAuth } from "../context/AuthContext"
import { timeAgo } from "../lib/format"
import VideoGrid from "../components/video/VideoGrid"
import EmptyState from "../components/ui/EmptyState"

export function Saved() {
    const { isSaved } = useLibrary()
    const fetcher = useCallback((page) => libraryApi.saved({ page, perPage: 24 }), [])
    const list = usePaginated(fetcher, "saved")
    // remove da grelha os vídeos que deixaram de estar guardados
    const items = list.items.filter((v) => isSaved(v.id))

    return (
        <div className="mx-auto max-w-[1800px]">
            <header className="mb-6">
                <h1 className="flex items-center gap-3 text-2xl font-bold">
                    <FaBookmark className="text-brand" /> Ver mais tarde
                </h1>
                <p className="mt-1 text-sm text-muted">Os vídeos que guardaste para assistir quando quiseres.</p>
            </header>
            <VideoGrid
                {...list}
                items={items}
                renderMeta={(v) => <span>Guardado {timeAgo(v.savedAt)}</span>}
                empty={
                    <EmptyState
                        icon={<FaBookmark />}
                        title="Ainda não guardaste nenhum vídeo"
                        description="Usa o ícone de marcador num vídeo para o guardar aqui."
                        action={<Link to="/" className="btn-primary">Explorar vídeos</Link>}
                    />
                }
            />
        </div>
    )
}

export function History() {
    const { setUser } = useAuth()
    const fetcher = useCallback((page) => libraryApi.history({ page, perPage: 24 }), [])
    const list = usePaginated(fetcher, "history")

    const clear = async () => {
        if (!window.confirm("Limpar todo o histórico de visualização?")) return
        try {
            await libraryApi.clearHistory()
            list.setItems([])
            setUser((u) => (u?.stats ? { ...u, stats: { ...u.stats, watched: 0 } } : u))
            toast.success("Histórico limpo")
        } catch (err) {
            toast.error(errorMessage(err))
        }
    }

    return (
        <div className="mx-auto max-w-[1800px]">
            <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="flex items-center gap-3 text-2xl font-bold">
                        <FaHistory className="text-brand" /> Histórico
                    </h1>
                    <p className="mt-1 text-sm text-muted">Os vídeos que viste recentemente.</p>
                </div>
                {list.items.length > 0 && (
                    <button onClick={clear} className="btn-ghost text-red-300">
                        <FaTrash /> Limpar histórico
                    </button>
                )}
            </header>
            <VideoGrid
                {...list}
                renderMeta={(v) => <span>Visto {timeAgo(v.watchedAt)}</span>}
                empty={
                    <EmptyState
                        icon={<FaHistory />}
                        title="O teu histórico está vazio"
                        description="Os vídeos que vires aparecem aqui."
                        action={<Link to="/" className="btn-primary">Começar a ver</Link>}
                    />
                }
            />
        </div>
    )
}
