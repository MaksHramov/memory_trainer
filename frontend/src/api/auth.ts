const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export interface AuthResponse {
  token: string
  username: string
}

export interface AuthError {
  message: string
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: AuthError = await response.json().catch(() => ({
      message: 'Произошла ошибка. Попробуйте позже.',
    }))
    throw new Error(error.message)
  }
  return response.json()
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  return handleResponse<AuthResponse>(response)
}

export async function register(
  username: string,
  password: string,
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  return handleResponse<AuthResponse>(response)
}
