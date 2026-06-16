import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { saveTestResult } from '../api/tests'
import {
  createMemoryRound,
  getScoreMessage,
  MEMORIZE_SECONDS,
  MEMORY_WORDS_COUNT,
  TEST_TYPE,
} from '../utils/memoryTest'
import '../styles/memory-test.css'

type Phase = 'intro' | 'memorize' | 'recall' | 'result'

export function MemoryTestPage() {
  const { user } = useAuth()
  const [phase, setPhase] = useState<Phase>('intro')
  const [targetWords, setTargetWords] = useState<string[]>([])
  const [choices, setChoices] = useState<string[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [timeLeft, setTimeLeft] = useState(MEMORIZE_SECONDS)
  const [score, setScore] = useState(0)
  const [saveStatus, setSaveStatus] = useState<'saving' | 'saved' | 'error'>('saving')
  const [saveError, setSaveError] = useState('')

  const startTest = useCallback(() => {
    const round = createMemoryRound()
    setTargetWords(round.targetWords)
    setChoices(round.choices)
    setSelected(new Set())
    setTimeLeft(MEMORIZE_SECONDS)
    setSaveStatus('saving')
    setSaveError('')
    setPhase('memorize')
  }, [])

  useEffect(() => {
    if (phase !== 'memorize' || timeLeft <= 0) return

    const timer = window.setTimeout(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setPhase('recall')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [phase, timeLeft])

  const toggleWord = (word: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(word)) {
        next.delete(word)
      } else {
        next.add(word)
      }
      return next
    })
  }

  const finishTest = () => {
    const correct = targetWords.filter((word) => selected.has(word)).length
    setScore(correct)
    setPhase('result')
  }

  useEffect(() => {
    if (phase !== 'result' || !user?.token) return

    saveTestResult(user.token, TEST_TYPE, score, MEMORY_WORDS_COUNT)
      .then(() => setSaveStatus('saved'))
      .catch((err) => {
        setSaveStatus('error')
        setSaveError(err instanceof Error ? err.message : 'Не удалось сохранить результат')
      })
  }, [phase, score, user?.token])

  if (phase === 'intro') {
    return (
      <section className="card memory-card">
        <h2>Тест: запоминание слов</h2>
        <p className="memory-text">
          Сейчас вы увидите {MEMORY_WORDS_COUNT} простых слов. У вас будет{' '}
          {MEMORIZE_SECONDS} секунд, чтобы их запомнить.
        </p>
        <p className="memory-text">
          Затем отметьте слова, которые вы помните. Не торопитесь — выбирайте
          внимательно.
        </p>
        <button type="button" className="memory-button primary" onClick={startTest}>
          Начать тест
        </button>
      </section>
    )
  }

  if (phase === 'memorize') {
    return (
      <section className="card memory-card">
        <h2>Запомните слова</h2>
        <p className="timer">Осталось: {timeLeft} сек.</p>
        <ul className="word-list">
          {targetWords.map((word) => (
            <li key={word} className="word-item">
              {word}
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="memory-button"
          onClick={() => setPhase('recall')}
        >
          Я запомнил(а)
        </button>
      </section>
    )
  }

  if (phase === 'recall') {
    return (
      <section className="card memory-card">
        <h2>Какие слова вы помните?</h2>
        <p className="memory-text">Нажмите на слова, которые запомнили.</p>
        <div className="choice-grid">
          {choices.map((word) => (
            <button
              key={word}
              type="button"
              className={`choice-button ${selected.has(word) ? 'selected' : ''}`}
              onClick={() => toggleWord(word)}
            >
              {word}
            </button>
          ))}
        </div>
        <button type="button" className="memory-button primary" onClick={finishTest}>
          Показать результат
        </button>
      </section>
    )
  }

  return (
    <section className="card memory-card">
      <h2>Ваш результат</h2>
      <p className="score-display">
        {score} из {MEMORY_WORDS_COUNT}
      </p>
      <p className="memory-text">{getScoreMessage(score, MEMORY_WORDS_COUNT)}</p>

      {saveStatus === 'saving' && <p className="save-status">Сохраняем результат...</p>}
      {saveStatus === 'saved' && (
        <p className="save-status saved">Результат сохранён во вкладке «Результаты»</p>
      )}
      {saveStatus === 'error' && <p className="save-status error">{saveError}</p>}

      <button type="button" className="memory-button primary" onClick={startTest}>
        Пройти ещё раз
      </button>
    </section>
  )
}
