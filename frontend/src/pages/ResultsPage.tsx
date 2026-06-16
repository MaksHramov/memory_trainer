import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getTestResults, type TestResult } from '../api/tests'
import { getTestTypeLabel } from '../utils/testLabels'
import '../styles/results.css'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function ResultsPage() {
  const { user } = useAuth()
  const [results, setResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user?.token) return

    getTestResults(user.token)
      .then(setResults)
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Не удалось загрузить результаты')
      })
      .finally(() => setLoading(false))
  }, [user?.token])

  if (loading) {
    return (
      <section className="card results-card">
        <p className="results-text">Загрузка результатов...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="card results-card">
        <p className="results-error">{error}</p>
      </section>
    )
  }

  if (results.length === 0) {
    return (
      <section className="card results-card">
        <h2>Результаты</h2>
        <p className="results-text">
          Пока нет сохранённых результатов. Пройдите тест на вкладке «Тест на память».
        </p>
      </section>
    )
  }

  return (
    <section className="card results-card">
      <h2>Результаты</h2>
      <ul className="results-list">
        {results.map((result) => (
          <li key={result.id} className="result-item">
            <div className="result-header">
              <span className="result-title">
                {getTestTypeLabel(result.testType, result.testTypeLabel)}
              </span>
              <span className="result-score">
                {result.score} / {result.maxScore}
              </span>
            </div>
            <span className="result-date">{formatDate(result.completedAt)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
