import { NavLink } from "../app/constants";
import { UserRow } from "./types";

// if admin, user bypasses all filtering, its VERY IMPORTANT that this is secure
export function filterLinks(links: NavLink[], user: UserRow | null) {
    const isAdmin = user?.role_level === "Admin";
    return links.filter((l) => {
        if (l.requiredStatus && user?.registration_status !== l.requiredStatus && !isAdmin) return false;
        if (l.requiredRole && user?.role_level !== l.requiredRole) return false;
        return true;
    });
}