import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { authApi, TOKEN_KEY } from "../services/api"

const AuthContext = createContext(null)

function readToken() {
    try {
        return localStorage.getItem(TOKEN_KEY)
    } catch {
        return null
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    // enquanto houver token guardado, valida-o antes de mostrar estado "visitante"
    const [initializing, setInitializing] = useState(() => Boolean(readToken()))

    const persistSession = useCallback(({ user, token }) => {
        localStorage.setItem(TOKEN_KEY, token)
        setUser(user)
    }, [])

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY)
        setUser(null)
    }, [])

    useEffect(() => {
        if (!readToken()) return
        authApi
            .me()
            .then(setUser)
            .catch((err) => {
                if (err?.response?.status === 401) logout()
            })
            .finally(() => setInitializing(false))
    }, [logout])

    const value = useMemo(
        () => ({
            user,
            isAuthenticated: Boolean(user),
            initializing,
            login: async (credentials) => persistSession(await authApi.login(credentials)),
            register: async (data) => persistSession(await authApi.register(data)),
            logout,
            setUser,
            refreshUser: async () => setUser(await authApi.me()),
        }),
        [user, initializing, persistSession, logout]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext)
}
