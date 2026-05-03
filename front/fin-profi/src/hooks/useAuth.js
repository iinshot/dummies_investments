import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AUTH } from '../constants'

const useAuthStore = create()(persist(
    (set) => ({
        auth: AUTH.GUEST,
        setAuth: (auth) => set({ auth }),
    }), { name: "auth" }
))

export default function useAuth() {
    const auth = useAuthStore(state => state.auth)
    const setAuth = useAuthStore(state => state.setAuth)

    return [auth, setAuth]
}