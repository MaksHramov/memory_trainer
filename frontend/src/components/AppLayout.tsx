import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../App.css'

export function AppLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="app">
      <header className="header">
        <h1>Тренажёр памяти</h1>
        <p className="subtitle">Здравствуйте, {user?.username}!</p>
      </header>

      <nav className="tabs">
        <NavLink to="/test" className={({ isActive }) => (isActive ? 'tab active' : 'tab')}>
          Тест на память
        </NavLink>
        <NavLink
          to="/results"
          className={({ isActive }) => (isActive ? 'tab active' : 'tab')}
        >
          Результаты
        </NavLink>
      </nav>

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <button type="button" className="logout-button" onClick={logout}>
          Выйти
        </button>
      </footer>
    </div>
  )
}
