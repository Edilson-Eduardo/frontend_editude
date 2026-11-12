import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { FaBars, FaSearch, FaTimes, FaUser, FaBookmark, FaHistory, FaSignOutAlt, FaArrowLeft } from "react-icons/fa"
import { useAuth } from "../../context/AuthContext"
import Avatar from "../ui/Avatar"
import logo from "../../assets/image-smal-transparent.png"

function SearchForm({ autoFocus, onDone }) {
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const [term, setTerm] = useState(params.get("q") ?? "")

    const submit = (e) => {
        e.preventDefault()
        const q = term.trim()
        if (!q) return
        navigate(`/search?q=${encodeURIComponent(q)}`)
        onDone?.()
    }

    return (
        <form onSubmit={submit} role="search" className="flex w-full items-center">
            <div className="relative flex-1">
                <input
                    type="search"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="Pesquisar vídeos"
                    aria-label="Pesquisar vídeos"
                    autoFocus={autoFocus}
                    className="h-10 w-full rounded-l-full border border-line bg-surface pl-5 pr-9 text-sm outline-none placeholder:text-muted focus:border-brand"
                />
                {term && (
                    <button
                        type="button"
                        onClick={() => setTerm("")}
                        aria-label="Limpar pesquisa"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-fg"
                    >
                        <FaTimes />
                    </button>
                )}
            </div>
            <button
                type="submit"
                aria-label="Pesquisar"
                className="grid h-10 w-14 place-items-center rounded-r-full border border-l-0 border-line bg-elevated text-muted hover:text-fg"
            >
                <FaSearch />
            </button>
        </form>
    )
}

function UserMenu() {
    const { user, logout } = useAuth()
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        if (!open) return
        const close = (e) => !ref.current?.contains(e.target) && setOpen(false)
        const esc = (e) => e.key === "Escape" && setOpen(false)
        document.addEventListener("mousedown", close)
        document.addEventListener("keydown", esc)
        return () => {
            document.removeEventListener("mousedown", close)
            document.removeEventListener("keydown", esc)
        }
    }, [open])

    const items = [
        { to: "/perfil", icon: <FaUser />, label: "O meu perfil" },
        { to: "/library/saved", icon: <FaBookmark />, label: "Ver mais tarde" },
        { to: "/library/history", icon: <FaHistory />, label: "Histórico" },
    ]

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label="Menu da conta"
                className="rounded-full ring-brand/60 transition hover:ring-2"
            >
                <Avatar user={user} size="sm" />
            </button>

            {open && (
                <div role="menu" className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-line bg-elevated shadow-2xl shadow-black/50">
                    <div className="flex items-center gap-3 border-b border-line p-4">
                        <Avatar user={user} />
                        <div className="min-w-0">
                            <p className="truncate font-semibold">{user.name}</p>
                            <p className="truncate text-sm text-muted">@{user.username}</p>
                        </div>
                    </div>
                    <div className="py-1">
                        {items.map((item) => (
                            <Link
                                key={item.to}
                                to={item.to}
                                role="menuitem"
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5"
                            >
                                <span className="text-muted">{item.icon}</span>
                                {item.label}
                            </Link>
                        ))}
                        <button
                            role="menuitem"
                            onClick={() => {
                                setOpen(false)
                                logout()
                            }}
                            className="flex w-full items-center gap-3 border-t border-line px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10"
                        >
                            <FaSignOutAlt />
                            Terminar sessão
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

function Topbar({ onToggleNav }) {
    const { user, initializing } = useAuth()
    const [mobileSearch, setMobileSearch] = useState(false)

    if (mobileSearch) {
        return (
            <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center gap-2 border-b border-line bg-canvas/95 px-3 backdrop-blur">
                <button onClick={() => setMobileSearch(false)} aria-label="Voltar" className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10">
                    <FaArrowLeft />
                </button>
                <SearchForm autoFocus onDone={() => setMobileSearch(false)} />
            </header>
        )
    }

    return (
        <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-line/60 bg-canvas/90 px-3 backdrop-blur md:px-5">
            <div className="flex items-center gap-2">
                <button onClick={onToggleNav} aria-label="Abrir menu" className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10">
                    <FaBars />
                </button>
                <Link to="/" className="flex items-center gap-1.5" aria-label="ediTube - início">
                    <img src={logo} alt="" className="h-8 w-auto" />
                    <span className="text-lg font-extrabold tracking-tight">
                        edi<span className="text-brand">Tube</span>
                    </span>
                </Link>
            </div>

            <div className="hidden max-w-xl flex-1 md:block">
                <SearchForm />
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => setMobileSearch(true)}
                    aria-label="Pesquisar"
                    className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10 md:hidden"
                >
                    <FaSearch />
                </button>

                {initializing ? (
                    <span className="h-8 w-8 animate-pulse rounded-full bg-elevated" />
                ) : user ? (
                    <UserMenu />
                ) : (
                    <>
                        <Link to="/registro" className="btn-ghost hidden sm:inline-flex">
                            Criar conta
                        </Link>
                        <Link to="/login" className="btn-primary">
                            Entrar
                        </Link>
                    </>
                )}
            </div>
        </header>
    )
}

export default Topbar
