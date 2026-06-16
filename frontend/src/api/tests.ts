const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export interface TestResult {
  id: number
  testType: string
  testTypeLabel: string
  score: number
  maxScore: number
  completedAt: string
}

interface ErrorBody {
  message: string
}

async function authFetch<T>(
  path: string,
  token: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error: ErrorBody = await response.json().catch(() => ({
      message: 'Произошла ошибка. Попробуйте позже.',
    }))
    throw new Error(error.message)
  }

  return response.json()
}

export async function saveTestResult(
  token: string,
  testType: string,
  score: number,
  maxScore: number,
): Promise<TestResult> {
  return authFetch<TestResult>('/api/tests/results', token, {
    method: 'POST',
    body: JSON.stringify({ testType, score, maxScore }),
  })
}

export async function getTestResults(token: string): Promise<TestResult[]> {
  return authFetch<TestResult[]>('/api/tests/results', token)
}
