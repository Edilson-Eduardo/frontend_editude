import { NavLink } from "react-router-dom"
import { FaHome, FaBookmark, FaHistory, FaUserCircle } from "react-icons/fa"
import { useAuth } from "../../context/AuthContext"

function MobileTabBar() {
    const { user } = useAuth()
    const tabs = [
        { to: "/", icon: <FaHome />, label: "Início", end: true },
        { to: "/library/saved", icon: <FaBookmark />, label: "Guardados" },
        { to: "/library/history", icon: <FaHistory />, label: "Histórico" },
        user
            ? { to: "/perfil", icon: <FaUserCircle />, label: "Perfil" }
            : { to: "/login", icon: <FaUserCircle />, label: "Entrar" },
    ]

    return (
        <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-line bg-canvas/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
            {tabs.map((t) => (
                <NavLink
                    key={t.to}
                    to={t.to}
                    end={t.end}
                    className={({ isActive }) =>
                        `flex flex-col items-center gap-1 py-2 text-[11px] ${isActive ? "text-fg" : "text-muted"}`
                    }
                >
                    <span className="text-lg">{t.icon}</span>
                    {t.label}
                </NavLink>
            ))}
        </nav>
    )
}

export default MobileTabBar
