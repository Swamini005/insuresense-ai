import {
    createContext,
    useContext,
    useState,
    useCallback,
    type ReactNode,
} from "react";
import {
    apiFetch,
    getToken,
    setToken,
    clearAuth,
    getStoredUser,
    setStoredUser,
    type AuthUser,
} from "@/lib/api";

interface AuthResponse {
    user: AuthUser;
    token: string;
}

interface AuthContextValue {
    user: AuthUser | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name?: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(() => (getToken() ? getStoredUser() : null));

    const persist = useCallback((res: AuthResponse) => {
        setToken(res.token);
        setStoredUser(res.user);
        setUser(res.user);
    }, []);

    const login = useCallback(
        async (email: string, password: string) => {
            const res = await apiFetch<AuthResponse>("/api/auth/login", {
                method: "POST",
                body: { email, password },
            });
            persist(res);
        },
        [persist]
    );

    const signup = useCallback(
        async (email: string, password: string, name?: string) => {
            const res = await apiFetch<AuthResponse>("/api/auth/signup", {
                method: "POST",
                body: { email, password, name },
            });
            persist(res);
        },
        [persist]
    );

    const logout = useCallback(() => {
        clearAuth();
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider
            value={{ user, isAuthenticated: !!user, login, signup, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}
