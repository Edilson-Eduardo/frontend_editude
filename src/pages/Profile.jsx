import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FaBookmark, FaHistory, FaCalendarAlt, FaPen } from "react-icons/fa"
import { toast } from "react-toastify"
import { useAuth } from "../context/AuthContext"
import { errorMessage, fieldErrors, libraryApi, userApi } from "../services/api"
import { formatDate } from "../lib/format"
import Avatar from "../components/ui/Avatar"
import Field from "../components/ui/Field"
import VideoCard from "../components/video/VideoCard"

function Shelf({ title, to, icon, fetcher, metaKey, metaLabel }) {
    const [items, setItems] = useState(null)

    useEffect(() => {
        fetcher({ page: 1, perPage: 4 })
            .then((r) => setItems(r.items))
            .catch(() => setItems([]))
    }, [fetcher])

    return (
        <section>
            <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold">
                    <span className="text-brand">{icon}</span> {title}
                </h2>
                <Link to={to} className="text-sm font-semibold text-brand hover:underline">
                    Ver tudo
                </Link>
            </div>
            {items === null ? (
                <div className="h-40 animate-pulse rounded-xl bg-elevated" />
            ) : items.length === 0 ? (
                <p className="rounded-xl border border-dashed border-line px-4 py-8 text-center text-sm text-muted">Nada aqui ainda.</p>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {items.map((v) => (
                        <VideoCard key={v.id} video={v} meta={<span>{metaLabel} {formatDate(v[metaKey], "d MMM yyyy")}</span>} />
                    ))}
                </div>
            )}
        </section>
    )
}

function EditProfile({ user, onClose }) {
    const { setUser } = useAuth()
    const [form, setForm] = useState({
        name: user.name ?? "",
        username: user.username ?? "",
        bio: user.bio ?? "",
        avatarUrl: user.avatarUrl ?? "",
    })
    const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "" })
    const [errors, setErrors] = useState({})
    const [saving, setSaving] = useState(false)

    const onChange = (setter) => (e) => {
        setter((f) => ({ ...f, [e.target.name]: e.target.value }))
        setErrors((er) => ({ ...er, [e.target.name]: undefined }))
    }

    const saveProfile = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            setUser(await userApi.update(form))
            toast.success("Perfil actualizado")
            onClose()
        } catch (err) {
            setErrors(fieldErrors(err))
            toast.error(errorMessage(err))
        } finally {
            setSaving(false)
        }
    }

    const savePassword = async (e) => {
        e.preventDefault()
        if (pwd.newPassword.length < 8) return setErrors({ newPassword: "Pelo menos 8 caracteres" })
        setSaving(true)
        try {
            await userApi.changePassword(pwd)
            setPwd({ currentPassword: "", newPassword: "" })
            toast.success("Senha alterada")
        } catch (err) {
            setErrors(fieldErrors(err))
            toast.error(errorMessage(err))
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <form onSubmit={saveProfile} className="space-y-4 rounded-2xl border border-line bg-surface p-6">
                <h2 className="text-lg font-bold">Editar perfil</h2>
                <Field label="Nome" name="name" value={form.name} onChange={onChange(setForm)} error={errors.name} />
                <Field label="Nome de utilizador" name="username" value={form.username} onChange={onChange(setForm)} error={errors.username} />
                <Field
                    label="URL da foto de perfil"
                    name="avatarUrl"
                    type="url"
                    placeholder="https://..."
                    value={form.avatarUrl}
                    onChange={onChange(setForm)}
                    error={errors.avatarUrl}
                />
                <div>
                    <label htmlFor="bio" className="label">
                        Bio
                    </label>
                    <textarea
                        id="bio"
                        name="bio"
                        rows={3}
                        maxLength={280}
                        value={form.bio}
                        onChange={onChange(setForm)}
                        className="input resize-none"
                        placeholder="Fala um pouco sobre ti"
                    />
                    <p className="mt-1 text-right text-xs text-muted">{form.bio.length}/280</p>
                </div>
                <div className="flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="btn-ghost">
                        Cancelar
                    </button>
                    <button disabled={saving} className="btn-primary">
                        Guardar alterações
                    </button>
                </div>
            </form>

            <form onSubmit={savePassword} className="h-fit space-y-4 rounded-2xl border border-line bg-surface p-6">
                <h2 className="text-lg font-bold">Alterar senha</h2>
                <Field
                    label="Senha actual"
                    name="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    value={pwd.currentPassword}
                    onChange={onChange(setPwd)}
                    error={errors.currentPassword}
                />
                <Field
                    label="Nova senha"
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    value={pwd.newPassword}
                    onChange={onChange(setPwd)}
                    error={errors.newPassword}
                    hint="Mínimo 8 caracteres"
                />
                <div className="flex justify-end">
                    <button disabled={saving || !pwd.currentPassword || !pwd.newPassword} className="btn-primary">
                        Alterar senha
                    </button>
                </div>
            </form>
        </div>
    )
}

function Profile() {
    const { user } = useAuth()
    const [editing, setEditing] = useState(false)

    const stats = [
        { label: "Guardados", value: user.stats?.savedVideos ?? 0, icon: <FaBookmark /> },
        { label: "Vídeos vistos", value: user.stats?.watched ?? 0, icon: <FaHistory /> },
    ]

    return (
        <div className="mx-auto max-w-6xl space-y-10">
            <section className="overflow-hidden rounded-2xl border border-line bg-surface">
                <div className="h-28 bg-gradient-to-r from-accent/40 via-brand/40 to-fuchsia-500/30 md:h-36" />
                <div className="flex flex-col gap-5 px-6 pb-6 md:flex-row md:items-end md:px-8">
                    <Avatar user={user} size="xl" className="-mt-12 ring-4 ring-surface md:-mt-14" />
                    <div className="min-w-0 flex-1">
                        <h1 className="truncate text-2xl font-bold">{user.name}</h1>
                        <p className="text-muted">@{user.username}</p>
                        {user.bio && <p className="mt-2 max-w-2xl text-sm text-fg/90">{user.bio}</p>}
                        <p className="mt-2 flex items-center gap-2 text-xs text-muted">
                            <FaCalendarAlt /> Membro desde {formatDate(user.createdAt, "MMMM 'de' yyyy")}
                        </p>
                    </div>
                    <div className="flex items-center gap-6">
                        {stats.map((s) => (
                            <div key={s.label} className="text-center">
                                <p className="text-2xl font-bold">{s.value}</p>
                                <p className="text-xs text-muted">{s.label}</p>
                            </div>
                        ))}
                        {!editing && (
                            <button onClick={() => setEditing(true)} className="btn-ghost">
                                <FaPen /> Editar
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {editing && <EditProfile user={user} onClose={() => setEditing(false)} />}

            <Shelf title="Ver mais tarde" to="/library/saved" icon={<FaBookmark />} fetcher={libraryApi.saved} metaKey="savedAt" metaLabel="Guardado a" />
            <Shelf title="Vistos recentemente" to="/library/history" icon={<FaHistory />} fetcher={libraryApi.history} metaKey="watchedAt" metaLabel="Visto a" />
        </div>
    )
}

export default Profile
