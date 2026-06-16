import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import '../App.css'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export function HomePage() {
  const { user, logout } = useAuth()
  const [backendStatus, setBackendStatus] = useState<string>('проверка...')

  useEffect(() => {
    fetch(`${API_URL}/api/health`)
      .then((res) => res.json())
      .then((data) => setBackendStatus(data.status === 'ok' ? 'подключён' : 'ошибка'))
      .catch(() => setBackendStatus('недоступен'))
  }, [])

  return (
    <div className="app">
      <header className="header">
        <h1>Тренажёр памяти</h1>
        <p className="subtitle">
          Упражнения для тренировки внимания и памяти
        </p>
      </header>

      <main className="main">
        <section className="card">
          <h2>Добро пожаловать, {user?.username}!</h2>
          <p>
            Это приложение поможет поддерживать когнитивные навыки с помощью
            простых и понятных упражнений.
          </p>
        </section>

        <section className="card status-card">
          <h2>Статус системы</h2>
          <p>
            Сервер: <span className="status">{backendStatus}</span>
          </p>
        </section>

        <button type="button" className="logout-button" onClick={logout}>
          Выйти
        </button>
      </main>

      <footer className="footer">
        <p>Memory Trainer — забота о здоровье ума</p>
      </footer>
    </div>
  )
}
