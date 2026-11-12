import { NavLink, useLocation } from "react-router-dom"
import { FaFire, FaClock, FaStar, FaEye, FaBookmark, FaHistory, FaUser, FaLock } from "react-icons/fa"
import { useAuth } from "../../context/AuthContext"

const explore = [
    { to: "/", order: "top-weekly", icon: <FaFire />, label: "Em alta" },
    { to: "/?order=latest", order: "latest", icon: <FaClock />, label: "Mais recentes" },
    { to: "/?order=most-popular", order: "most-popular", icon: <FaEye />, label: "Mais vistos" },
    { to: "/?order=top-rated", order: "top-rated", icon: <FaStar />, label: "Mais votados" },
]

const library = [
    { to: "/library/saved", icon: <FaBookmark />, label: "Ver mais tarde" },
    { to: "/library/history", icon: <FaHistory />, label: "Histórico" },
    { to: "/perfil", icon: <FaUser />, label: "O meu perfil" },
]

const itemCls = (active, compact) =>
    `flex items-center rounded-lg text-sm transition-colors ${
        compact ? "flex-col gap-1.5 px-1 py-4 text-[10px]" : "gap-4 px-3 py-2.5"
    } ${active ? "bg-white/10 font-semibold text-fg" : "text-fg/80 hover:bg-white/5"}`

/**
 * Navegação lateral.
 * - Desktop: fixa à esquerda; `compact` mostra só ícones.
 * - Mobile: gaveta sobreposta (`open`).
 */
function SideNav({ open, compact, onClose }) {
    const { user } = useAuth()
    const { pathname, search } = useLocation()
    const currentOrder = new URLSearchParams(search).get("order") ?? "top-weekly"

    const content = (isCompact) => (
        <nav className="flex flex-col gap-1 p-3" aria-label="Navegação principal">
            {explore.map((item) => (
                <NavLink
                    key={item.label}
                    to={item.to}
                    onClick={onClose}
                    className={itemCls(pathname === "/" && currentOrder === item.order, isCompact)}
                >
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                </NavLink>
            ))}

            <hr className="my-3 border-line" />
            {!isCompact && <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted">Biblioteca</p>}

            {library.map((item) => (
                <NavLink key={item.to} to={item.to} onClick={onClose} className={({ isActive }) => itemCls(isActive, isCompact)}>
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                </NavLink>
            ))}

            {!user && !isCompact && (
                <div className="mt-4 rounded-xl border border-line bg-surface p-4 text-sm">
                    <p className="flex items-center gap-2 font-semibold">
                        <FaLock className="text-brand" /> Guarda os teus favoritos
                    </p>
                    <p className="mt-1 text-muted">Entra para guardar vídeos e acompanhar o que já viste.</p>
                    <NavLink to="/login" onClick={onClose} className="btn-primary mt-3 w-full">
                        Entrar
                    </NavLink>
                </div>
            )}

            {!isCompact && (
                <p className="mt-6 px-3 text-xs leading-relaxed text-muted/70">
                    © {new Date().getFullYear()} ediTube · Conteúdo para maiores de 18 anos.
                </p>
            )}
        </nav>
    )

    return (
        <>
            {/* Desktop */}
            <aside
                className={`fixed bottom-0 left-0 top-16 z-30 hidden overflow-y-auto bg-canvas lg:block ${
                    compact ? "w-20" : "w-60"
                }`}
            >
                {content(compact)}
            </aside>

            {/* Mobile / tablet */}
            <div className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
                <div
                    onClick={onClose}
                    className={`absolute inset-0 bg-black/60 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
                />
                <aside
                    className={`absolute inset-y-0 left-0 w-72 overflow-y-auto bg-surface pt-4 shadow-2xl transition-transform ${
                        open ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    {content(false)}
                </aside>
            </div>
        </>
    )
}

export default SideNav
