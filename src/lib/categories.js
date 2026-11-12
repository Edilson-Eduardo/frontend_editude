/**
 * Categorias mostradas na página inicial.
 * `query` é enviado à API (/api/videos?q=...). "all" devolve tudo.
 */
export const CATEGORIES = [
    { slug: "todos", label: "Todos", query: "" },
    { slug: "amador", label: "Amador", query: "amateur" },
    { slug: "casal", label: "Casal", query: "couple" },
    { slug: "latina", label: "Latina", query: "latina" },
    { slug: "ebony", label: "Ebony", query: "ebony" },
    { slug: "morena", label: "Morena", query: "brunette" },
    { slug: "loira", label: "Loira", query: "blonde" },
    { slug: "milf", label: "MILF", query: "milf" },
    { slug: "lesbicas", label: "Lésbicas", query: "lesbian" },
    { slug: "gay", label: "Gay", query: "gay" },
    { slug: "hd", label: "HD", query: "hd" },
]

/** Ordenações suportadas pela API (ver server/src/providers/videoProvider.js). */
export const ORDERS = {
    "top-weekly": "Em alta",
    latest: "Mais recentes",
    "most-popular": "Mais vistos",
    "top-rated": "Mais votados",
    "top-monthly": "Top do mês",
    longest: "Mais longos",
}
