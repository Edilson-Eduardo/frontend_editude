import { useState } from "react"
import logo from "../../assets/image-smal-transparent.png"

const KEY = "editube_age_confirmed"

function isConfirmed() {
    try {
        return localStorage.getItem(KEY) === "1"
    } catch {
        return false
    }
}

/** Aviso de conteúdo para adultos, mostrado na primeira visita. */
function AgeGate() {
    const [confirmed, setConfirmed] = useState(isConfirmed)
    if (confirmed) return null

    const accept = () => {
        try {
            localStorage.setItem(KEY, "1")
        } catch {
            /* sem storage: pergunta de novo na próxima visita */
        }
        setConfirmed(true)
    }

    return (
        <div role="dialog" aria-modal="true" aria-labelledby="agegate-title" className="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-4 backdrop-blur-md">
            <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-8 text-center shadow-2xl">
                <img src={logo} alt="" className="mx-auto h-12" />
                <span className="mt-6 inline-block rounded-full border border-brand/50 px-3 py-1 text-sm font-bold text-brand">18+</span>
                <h2 id="agegate-title" className="mt-4 text-2xl font-bold">Conteúdo para adultos</h2>
                <p className="mt-3 text-sm text-muted">
                    Este site contém material destinado exclusivamente a maiores de 18 anos. Ao continuar, confirmas que
                    tens idade legal para ver este conteúdo no teu país.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <a href="https://www.google.com" className="btn-ghost flex-1 py-3">
                        Sair
                    </a>
                    <button onClick={accept} autoFocus className="btn-primary flex-1 py-3">
                        Tenho 18 anos ou mais
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AgeGate
