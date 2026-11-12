import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { toast } from "react-toastify"
import { useAuth } from "../context/AuthContext"
import { errorMessage, fieldErrors } from "../services/api"
import AuthShell from "../components/layout/AuthShell"
import Field from "../components/ui/Field"

function Login() {
    const { login } = useAuth()
    const location = useLocation()
    const [form, setForm] = useState({ identifier: "", password: "" })
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)

    const onChange = (e) => {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
        setErrors((er) => ({ ...er, [e.target.name]: undefined, form: undefined }))
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        const local = {}
        if (!form.identifier.trim()) local.identifier = "Indica o email ou nome de utilizador"
        if (!form.password) local.password = "Indica a senha"
        if (Object.keys(local).length) return setErrors(local)

        setSubmitting(true)
        try {
            await login(form)
            toast.success("Bem-vindo de volta!")
            // o redireccionamento é feito por <GuestOnly>
        } catch (err) {
            setErrors({ ...fieldErrors(err), form: errorMessage(err) })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <AuthShell
            title="Entrar"
            subtitle="Acede à tua conta para guardar vídeos e ver o teu histórico."
            footer={
                <>
                    Ainda não tens conta?{" "}
                    <Link to="/registro" state={location.state} className="font-semibold text-brand hover:underline">
                        Criar conta
                    </Link>
                </>
            }
        >
            <form onSubmit={onSubmit} noValidate className="space-y-4">
                {errors.form && (
                    <div role="alert" className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                        {errors.form}
                    </div>
                )}
                <Field
                    label="Email ou nome de utilizador"
                    name="identifier"
                    autoComplete="username"
                    value={form.identifier}
                    onChange={onChange}
                    error={errors.identifier}
                    autoFocus
                />
                <Field
                    label="Senha"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={form.password}
                    onChange={onChange}
                    error={errors.password}
                />
                <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
                    {submitting ? "A entrar..." : "Entrar"}
                </button>
                <p className="text-center text-xs text-muted">
                    Ou <Link to="/" className="underline hover:text-fg">continua sem sessão</Link> — podes ver vídeos sem conta.
                </p>
            </form>
        </AuthShell>
    )
}

export default Login
