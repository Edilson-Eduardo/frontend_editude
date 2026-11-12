import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

/** Protege rotas privadas; redirecciona para o login e volta depois. */
function RequireAuth({ children }) {
    const { user, initializing } = useAuth()
    const location = useLocation()

    if (initializing) {
        return (
            <div className="grid min-h-[50vh] place-items-center">
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
            </div>
        )
    }
    if (!user) return <Navigate to="/login" replace state={{ from: location }} />
    return children
}

/** Para /login e /registro: quem já tem sessão vai para a página inicial. */
export function GuestOnly({ children }) {
    const { user } = useAuth()
    const location = useLocation()
    const from = location.state?.from
    if (user) return <Navigate to={from ? `${from.pathname}${from.search ?? ""}` : "/"} replace />
    return children
}

export default RequireAuth
