import { FaBookmark, FaRegBookmark } from "react-icons/fa"
import { useLibrary } from "../../context/LibraryContext"

/** Botão "Ver mais tarde". Se o visitante não tiver sessão, é levado ao login. */
function SaveButton({ videoId, variant = "icon", className = "" }) {
    const { isSaved, toggleSave, isPending } = useLibrary()
    const saved = isSaved(videoId)
    const label = saved ? "Remover de Ver mais tarde" : "Ver mais tarde"

    const onClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleSave(videoId)
    }

    if (variant === "full") {
        return (
            <button
                type="button"
                onClick={onClick}
                disabled={isPending(videoId)}
                aria-pressed={saved}
                className={`${saved ? "btn bg-fg text-canvas hover:bg-fg/90" : "btn-ghost"} ${className}`}
            >
                {saved ? <FaBookmark /> : <FaRegBookmark />}
                {saved ? "Guardado" : "Ver mais tarde"}
            </button>
        )
    }

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={isPending(videoId)}
            aria-label={label}
            aria-pressed={saved}
            title={label}
            className={`grid h-9 w-9 place-items-center rounded-full bg-black/70 text-sm text-white backdrop-blur transition hover:bg-brand ${saved ? "text-brand hover:text-white" : ""} ${className}`}
        >
            {saved ? <FaBookmark /> : <FaRegBookmark />}
        </button>
    )
}

export default SaveButton
