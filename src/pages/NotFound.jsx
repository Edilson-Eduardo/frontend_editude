import { Link } from "react-router-dom"
import EmptyState from "../components/ui/EmptyState"

function NotFound() {
    return (
        <EmptyState
            icon={<span className="text-6xl font-extrabold text-brand">404</span>}
            title="Página não encontrada"
            description="O endereço que procuras não existe ou foi removido."
            action={<Link to="/" className="btn-primary">Voltar ao início</Link>}
        />
    )
}

export default NotFound
