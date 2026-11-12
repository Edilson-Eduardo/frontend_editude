import { useState } from "react"
import { initials } from "../../lib/format"

const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    xl: "h-24 w-24 text-3xl md:h-28 md:w-28",
}

function Avatar({ user, size = "md", className = "" }) {
    const [broken, setBroken] = useState(false)
    const cls = `${sizes[size]} shrink-0 rounded-full ${className}`

    if (user?.avatarUrl && !broken) {
        return <img src={user.avatarUrl} alt="" onError={() => setBroken(true)} className={`${cls} object-cover`} />
    }
    return (
        <span className={`${cls} grid place-items-center bg-gradient-to-br from-accent to-brand font-bold text-white`}>
            {initials(user?.name) || "?"}
        </span>
    )
}

export default Avatar
