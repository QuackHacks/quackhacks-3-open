'use client'
import { createContext, useCallback, useContext, useRef, useState, useEffect } from "react";
import { UserRow } from "@/lib/types";

type UserContextType = {
    user: UserRow | null;
    updateUser: (update: Partial<UserRow>) => void;
};

const UserContext = createContext<UserContextType>({ user: null, updateUser: () => {} });

export function UserProvider({ user: initialUser, children }: { user: UserRow | null; children: React.ReactNode }) {
    const [user, setUser] = useState(initialUser);
    const localUpdateRef = useRef<Partial<UserRow> | null>(null);

    useEffect(() => {
        setUser((currentUser) => {
            const localUpdate = localUpdateRef.current;
            const currentUserId = currentUser?.id ?? null;
            const nextUserId = initialUser?.id ?? null;

            if (!initialUser || currentUserId !== nextUserId) {
                localUpdateRef.current = null;
                return initialUser;
            }

            if (!localUpdate) return initialUser;

            const reconciledUser = { ...initialUser, ...localUpdate };
            const serverCaughtUp = Object.entries(localUpdate).every(
                ([key, value]) => Object.is(initialUser[key as keyof UserRow], value),
            );

            if (serverCaughtUp) {
                localUpdateRef.current = null;
                return initialUser;
            }

            return reconciledUser;
        });
    }, [initialUser]);

    const updateUser = useCallback((update: Partial<UserRow>) => {
        localUpdateRef.current = { ...(localUpdateRef.current ?? {}), ...update };
        setUser(prev => prev ? { ...prev, ...update } : prev);
    }, []);

    return <UserContext.Provider value={{ user, updateUser }}>{children}</UserContext.Provider>;
}

export const useQuackhacksUser = () => useContext(UserContext).user;
export const useUpdateUser = () => useContext(UserContext).updateUser;
