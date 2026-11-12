import { Link } from "react-router-dom"
import logo from "../../assets/image-smal-transparent.png"
import AgeGate from "./AgeGate"

/** Moldura das páginas de autenticação (sem menu lateral). */
function AuthShell({ title, subtitle, children, footer }) {
    return (
        <div className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-10">
            <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-brand/20 blur-[120px]" />

            <div className="relative w-full max-w-md">
                <Link to="/" className="mb-8 flex items-center justify-center gap-2">
                    <img src={logo} alt="" className="h-10" />
                    <span className="text-2xl font-extrabold tracking-tight">
                        edi<span className="text-brand">Tube</span>
                    </span>
                </Link>

                <div className="rounded-2xl border border-line bg-surface/90 p-6 shadow-2xl shadow-black/40 backdrop-blur md:p-8">
                    <h1 className="text-2xl font-bold">{title}</h1>
                    {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
                    <div className="mt-6">{children}</div>
                </div>

                {footer && <p className="mt-6 text-center text-sm text-muted">{footer}</p>}
            </div>
            <AgeGate />
        </div>
    )
}

export default AuthShell
