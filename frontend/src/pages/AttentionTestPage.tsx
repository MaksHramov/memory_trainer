import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { saveTestResult } from '../api/tests'
import {
  ATTENTION_ROUNDS,
  createAttentionRound,
  getAttentionScoreMessage,
  SHAPE_LABELS,
  TEST_TYPE,
  type AttentionRound,
  type ShapeType,
} from '../utils/attentionTest'
import '../styles/attention-test.css'

type Phase = 'intro' | 'round' | 'feedback' | 'result'

function ShapeIcon({ shape }: { shape: ShapeType }) {
  return <span className={`shape-icon shape-${shape}`} aria-hidden="true" />
}

export function AttentionTestPage() {
  const { user } = useAuth()
  const [phase, setPhase] = useState<Phase>('intro')
  const [roundNumber, setRoundNumber] = useState(1)
  const [currentRound, setCurrentRound] = useState<AttentionRound | null>(null)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [saveStatus, setSaveStatus] = useState<'saving' | 'saved' | 'error'>('saving')
  const [saveError, setSaveError] = useState('')

  const startRound = useCallback((number: number) => {
    setRoundNumber(number)
    setCurrentRound(createAttentionRound())
    setPhase('round')
  }, [])

  const startTest = useCallback(() => {
    setScore(0)
    setSaveStatus('saving')
    setSaveError('')
    startRound(1)
  }, [startRound])

  const handleChoice = (index: number) => {
    if (phase !== 'round' || !currentRound) return

    const isCorrect = index === currentRound.oddIndex
    if (isCorrect) {
      setScore((prev) => prev + 1)
      setFeedback('Верно! Отличная внимательность.')
    } else {
      const oddShape = currentRound.cells[currentRound.oddIndex]
      setFeedback(`Неверно. Лишняя фигура — ${SHAPE_LABELS[oddShape]}.`)
    }
    setPhase('feedback')
  }

  useEffect(() => {
    if (phase !== 'feedback') return

    const timer = window.setTimeout(() => {
      if (roundNumber >= ATTENTION_ROUNDS) {
        setPhase('result')
      } else {
        startRound(roundNumber + 1)
      }
    }, 1500)

    return () => window.clearTimeout(timer)
  }, [phase, roundNumber, startRound])

  useEffect(() => {
    if (phase !== 'result' || !user?.token) return

    saveTestResult(user.token, TEST_TYPE, score, ATTENTION_ROUNDS)
      .then(() => setSaveStatus('saved'))
      .catch((err) => {
        setSaveStatus('error')
        setSaveError(err instanceof Error ? err.message : 'Не удалось сохранить результат')
      })
  }, [phase, score, user?.token])

  if (phase === 'intro') {
    return (
      <section className="card attention-card">
        <h2>Тест: найди лишнее</h2>
        <p className="attention-text">
          Перед вами появится сетка из 9 фигур. Восемь одинаковых, одна — другая.
        </p>
        <p className="attention-text">
          Нажмите на фигуру, которая отличается. Всего {ATTENTION_ROUNDS} заданий.
          Смотрите внимательно и не торопитесь.
        </p>
        <button type="button" className="attention-button primary" onClick={startTest}>
          Начать тест
        </button>
      </section>
    )
  }

  if (phase === 'round' && currentRound) {
    return (
      <section className="card attention-card">
        <h2>Задание {roundNumber} из {ATTENTION_ROUNDS}</h2>
        <p className="attention-text">Нажмите на фигуру, которая отличается от остальных.</p>
        <div className="shape-grid">
          {currentRound.cells.map((shape, index) => (
            <button
              key={index}
              type="button"
              className="shape-cell"
              onClick={() => handleChoice(index)}
              aria-label={`Фигура ${index + 1}: ${SHAPE_LABELS[shape]}`}
            >
              <ShapeIcon shape={shape} />
            </button>
          ))}
        </div>
      </section>
    )
  }

  if (phase === 'feedback') {
    return (
      <section className="card attention-card">
        <p className="feedback-text">{feedback}</p>
        <p className="attention-text">Следующее задание...</p>
      </section>
    )
  }

  return (
    <section className="card attention-card">
      <h2>Ваш результат</h2>
      <p className="score-display">
        {score} из {ATTENTION_ROUNDS}
      </p>
      <p className="attention-text">
        {getAttentionScoreMessage(score, ATTENTION_ROUNDS)}
      </p>

      {saveStatus === 'saving' && <p className="save-status">Сохраняем результат...</p>}
      {saveStatus === 'saved' && (
        <p className="save-status saved">Результат сохранён во вкладке «Результаты»</p>
      )}
      {saveStatus === 'error' && <p className="save-status error">{saveError}</p>}

      <button type="button" className="attention-button primary" onClick={startTest}>
        Пройти ещё раз
      </button>
    </section>
  )
}
