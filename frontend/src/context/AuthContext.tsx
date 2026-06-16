import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { login as loginApi, register as registerApi } from '../api/auth'

interface User {
  username: string
  token: string
}

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => void
}

const STORAGE_KEY = 'memory_trainer_auth'

const AuthContext = createContext<AuthContextValue | null>(null)

function loadUser(): User | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

function saveUser(user: User | null) {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadUser)

  const login = useCallback(async (username: string, password: string) => {
    const response = await loginApi(username, password)
    const nextUser = { username: response.username, token: response.token }
    setUser(nextUser)
    saveUser(nextUser)
  }, [])

  const register = useCallback(async (username: string, password: string) => {
    const response = await registerApi(username, password)
    const nextUser = { username: response.username, token: response.token }
    setUser(nextUser)
    saveUser(nextUser)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    saveUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      login,
      register,
      logout,
    }),
    [user, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
