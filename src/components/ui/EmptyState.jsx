function EmptyState({ icon, title, description, action }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line px-6 py-16 text-center">
            {icon && <div className="mb-4 text-4xl text-muted">{icon}</div>}
            <h3 className="text-lg font-semibold">{title}</h3>
            {description && <p className="mt-1 max-w-md text-sm text-muted">{description}</p>}
            {action && <div className="mt-6">{action}</div>}
        </div>
    )
}

export default EmptyState
