import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { toast } from "react-toastify"
import { useAuth } from "../context/AuthContext"
import { errorMessage, fieldErrors } from "../services/api"
import AuthShell from "../components/layout/AuthShell"
import Field from "../components/ui/Field"

const MIN_AGE = 18

function maxBirthDate() {
    const d = new Date()
    d.setFullYear(d.getFullYear() - MIN_AGE)
    return d.toISOString().slice(0, 10)
}

function validate(form) {
    const e = {}
    if (form.name.trim().length < 2) e.name = "Indica o teu nome"
    if (!/^[a-z0-9_.]{3,30}$/i.test(form.username)) e.username = "3–30 caracteres: letras, números, _ ou ."
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Email inválido"
    if (!form.birthDate) e.birthDate = "Indica a data de nascimento"
    else if (form.birthDate > maxBirthDate()) e.birthDate = `Precisas ter pelo menos ${MIN_AGE} anos`
    if (form.password.length < 8) e.password = "Pelo menos 8 caracteres"
    if (form.confirm !== form.password) e.confirm = "As senhas não coincidem"
    if (!form.terms) e.terms = "Tens de aceitar os termos"
    return e
}

function Register() {
    const { register } = useAuth()
    const location = useLocation()
    const [form, setForm] = useState({
        name: "",
        username: "",
        email: "",
        birthDate: "",
        password: "",
        confirm: "",
        terms: false,
    })
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)

    const onChange = (e) => {
        const { name, type, checked, value } = e.target
        setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }))
        setErrors((er) => ({ ...er, [name]: undefined, form: undefined }))
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        const local = validate(form)
        if (Object.keys(local).length) return setErrors(local)

        setSubmitting(true)
        try {
            // eslint-disable-next-line no-unused-vars
            const { confirm, terms, ...payload } = form
            await register(payload)
            toast.success("Conta criada com sucesso!")
        } catch (err) {
            setErrors({ ...fieldErrors(err), form: errorMessage(err) })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <AuthShell
            title="Criar conta"
            subtitle="É grátis. Guarda vídeos e acompanha o que já viste."
            footer={
                <>
                    Já tens conta?{" "}
                    <Link to="/login" state={location.state} className="font-semibold text-brand hover:underline">
                        Entrar
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
                <Field label="Nome" name="name" autoComplete="name" value={form.name} onChange={onChange} error={errors.name} autoFocus />
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                        label="Nome de utilizador"
                        name="username"
                        autoComplete="username"
                        value={form.username}
                        onChange={onChange}
                        error={errors.username}
                    />
                    <Field
                        label="Data de nascimento"
                        name="birthDate"
                        type="date"
                        max={maxBirthDate()}
                        value={form.birthDate}
                        onChange={onChange}
                        error={errors.birthDate}
                    />
                </div>
                <Field label="Email" name="email" type="email" autoComplete="email" value={form.email} onChange={onChange} error={errors.email} />
                <Field
                    label="Senha"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={onChange}
                    error={errors.password}
                    hint="Mínimo 8 caracteres"
                />
                <Field
                    label="Confirmar senha"
                    name="confirm"
                    type="password"
                    autoComplete="new-password"
                    value={form.confirm}
                    onChange={onChange}
                    error={errors.confirm}
                />

                <div>
                    <label className="flex items-start gap-3 text-sm text-muted">
                        <input
                            type="checkbox"
                            name="terms"
                            checked={form.terms}
                            onChange={onChange}
                            className="mt-0.5 h-4 w-4 accent-brand"
                        />
                        <span>
                            Confirmo que tenho {MIN_AGE} anos ou mais e aceito os{" "}
                            <a href="/termos" className="text-fg underline">Termos de Uso</a> e a{" "}
                            <a href="/privacidade" className="text-fg underline">Política de Privacidade</a>.
                        </span>
                    </label>
                    {errors.terms && <p className="mt-1.5 text-xs text-red-400">{errors.terms}</p>}
                </div>

                <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
                    {submitting ? "A criar conta..." : "Criar conta"}
                </button>
            </form>
        </AuthShell>
    )
}

export default Register
