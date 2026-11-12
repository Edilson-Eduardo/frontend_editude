import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useAuth } from "./AuthContext"
import { errorMessage, libraryApi } from "../services/api"

const LibraryContext = createContext(null)

/** Mantém em memória os IDs dos vídeos guardados para "Ver mais tarde". */
export function LibraryProvider({ children }) {
    const { user, setUser } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [savedIds, setSavedIds] = useState(() => new Set())
    const [pending, setPending] = useState(() => new Set())

    useEffect(() => {
        if (!user?.id) {
            setSavedIds(new Set())
            return
        }
        libraryApi
            .savedIds()
            .then((ids) => setSavedIds(new Set(ids)))
            .catch(() => {})
    }, [user?.id])

    const isSaved = useCallback((id) => savedIds.has(id), [savedIds])

    const bumpStat = useCallback(
        (delta) =>
            setUser((u) => (u?.stats ? { ...u, stats: { ...u.stats, savedVideos: Math.max(0, u.stats.savedVideos + delta) } } : u)),
        [setUser]
    )

    const toggleSave = useCallback(
        async (videoId) => {
            if (!user) {
                toast.info("Entra na tua conta para guardar vídeos.")
                navigate("/login", { state: { from: location } })
                return
            }
            if (pending.has(videoId)) return

            const wasSaved = savedIds.has(videoId)
            const update = (fn) =>
                setSavedIds((prev) => {
                    const next = new Set(prev)
                    fn(next)
                    return next
                })

            // actualização optimista
            update((s) => (wasSaved ? s.delete(videoId) : s.add(videoId)))
            setPending((p) => new Set(p).add(videoId))
            try {
                if (wasSaved) {
                    await libraryApi.unsave(videoId)
                    bumpStat(-1)
                    toast.success("Removido de Ver mais tarde")
                } else {
                    await libraryApi.save(videoId)
                    bumpStat(1)
                    toast.success("Guardado em Ver mais tarde")
                }
            } catch (err) {
                update((s) => (wasSaved ? s.add(videoId) : s.delete(videoId)))
                toast.error(errorMessage(err))
            } finally {
                setPending((p) => {
                    const next = new Set(p)
                    next.delete(videoId)
                    return next
                })
            }
        },
        [user, savedIds, pending, navigate, location, bumpStat]
    )

    const value = useMemo(
        () => ({ isSaved, toggleSave, isPending: (id) => pending.has(id) }),
        [isSaved, toggleSave, pending]
    )

    return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLibrary() {
    return useContext(LibraryContext)
}
