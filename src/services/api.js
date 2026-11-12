import axios from "axios"

export const TOKEN_KEY = "editube_token"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8001/api",
    timeout: 15000,
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

/** Extrai uma mensagem legível de um erro do axios. */
export function errorMessage(err, fallback = "Algo correu mal. Tenta novamente.") {
    return err?.response?.data?.error ?? (err?.request && !err?.response ? "Sem ligação ao servidor" : fallback)
}

/** Converte `details` da API em { campo: mensagem }. */
export function fieldErrors(err) {
    const details = err?.response?.data?.details
    if (!Array.isArray(details)) return {}
    return Object.fromEntries(details.map((d) => [d.field, d.message]))
}

/* ---------- Endpoints ---------- */

export const authApi = {
    register: (data) => api.post("/auth/register", data).then((r) => r.data),
    login: (data) => api.post("/auth/login", data).then((r) => r.data),
    me: () => api.get("/auth/me").then((r) => r.data.user),
}

export const userApi = {
    update: (data) => api.patch("/users/me", data).then((r) => r.data.user),
    changePassword: (data) => api.patch("/users/me/password", data),
}

export const videoApi = {
    list: (params) => api.get("/videos", { params }).then((r) => r.data),
    get: (id) => api.get(`/videos/${id}`).then((r) => r.data),
    related: (id) => api.get(`/videos/${id}/related`).then((r) => r.data.items),
}

export const libraryApi = {
    saved: (params) => api.get("/library/saved", { params }).then((r) => r.data),
    savedIds: () => api.get("/library/saved/ids").then((r) => r.data.ids),
    save: (videoId) => api.post("/library/saved", { videoId }).then((r) => r.data),
    unsave: (videoId) => api.delete(`/library/saved/${videoId}`),
    history: (params) => api.get("/library/history", { params }).then((r) => r.data),
    recordWatch: (videoId) => api.post("/library/history", { videoId }),
    clearHistory: () => api.delete("/library/history"),
}

export default api
