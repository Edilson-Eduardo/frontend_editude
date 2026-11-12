import { useId, useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa"

/** Campo de formulário com label, erro e (para senhas) botão mostrar/ocultar. */
function Field({ label, error, hint, type = "text", className = "", ...props }) {
    const id = useId()
    const [visible, setVisible] = useState(false)
    const isPassword = type === "password"

    return (
        <div className={className}>
            <label htmlFor={id} className="label">
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    type={isPassword && visible ? "text" : type}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${id}-err` : undefined}
                    className={`input ${isPassword ? "pr-11" : ""} ${error ? "border-red-500/70 focus:border-red-500 focus:ring-red-500/30" : ""}`}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setVisible((v) => !v)}
                        aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-fg"
                    >
                        {visible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                )}
            </div>
            {error ? (
                <p id={`${id}-err`} className="mt-1.5 text-xs text-red-400">
                    {error}
                </p>
            ) : (
                hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>
            )}
        </div>
    )
}

export default Field
