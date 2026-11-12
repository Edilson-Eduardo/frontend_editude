import { Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import AppLayout from "./components/layout/AppLayout"
import RequireAuth, { GuestOnly } from "./routes/RequireAuth"

// Páginas
import Home from "./pages/Home"
import Search from "./pages/Search"
import Watch from "./pages/Watch"
import { Saved, History } from "./pages/Library"
import Profile from "./pages/Profile"
import Login from "./pages/Login"
import Register from "./pages/Register"
import NotFound from "./pages/NotFound"

function App() {
    return (
        <>
            <Routes>
                <Route element={<AppLayout />}>
                    {/* Públicas — qualquer visitante pode ver vídeos */}
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/watch/:id" element={<Watch />} />

                    {/* Privadas — exigem sessão */}
                    <Route path="/library/saved" element={<RequireAuth><Saved /></RequireAuth>} />
                    <Route path="/library/history" element={<RequireAuth><History /></RequireAuth>} />
                    <Route path="/perfil" element={<RequireAuth><Profile /></RequireAuth>} />

                    <Route path="*" element={<NotFound />} />
                </Route>

                <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
                <Route path="/registro" element={<GuestOnly><Register /></GuestOnly>} />
            </Routes>

            <ToastContainer theme="dark" position="bottom-right" autoClose={2500} closeButton newestOnTop />
        </>
    )
}

export default App
