import { useEffect, useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import Topbar from "./Topbar"
import SideNav from "./SideNav"
import MobileTabBar from "./MobileTabBar"
import Footer from "./Footer"
import AgeGate from "./AgeGate"

function AppLayout() {
    const { pathname } = useLocation()
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [compact, setCompact] = useState(false)

    // a página de vídeo usa toda a largura → menu lateral compacto
    const isWatch = pathname.startsWith("/watch/")
    const navCompact = isWatch ? !compact : compact

    useEffect(() => {
        window.scrollTo({ top: 0 })
    }, [pathname])

    const toggleNav = () => {
        if (window.matchMedia("(min-width: 1024px)").matches) setCompact((c) => !c)
        else setDrawerOpen((o) => !o)
    }

    return (
        <>
            <Topbar onToggleNav={toggleNav} />
            <SideNav open={drawerOpen} compact={navCompact} onClose={() => setDrawerOpen(false)} />

            <div className={`pt-16 pb-16 md:pb-0 ${navCompact ? "lg:pl-20" : "lg:pl-60"}`}>
                <main className="min-h-[calc(100vh-4rem)] px-4 py-6 md:px-6 lg:px-8">
                    <Outlet />
                </main>
                <Footer />
            </div>

            <MobileTabBar />
            <AgeGate />
        </>
    )
}

export default AppLayout
