export const WORD_POOL = [
  'стол',
  'окно',
  'книга',
  'чай',
  'сад',
  'лампа',
  'ключ',
  'часы',
  'мост',
  'река',
  'хлеб',
  'кошка',
  'дом',
  'солнце',
  'ручка',
  'цветок',
  'зеркало',
  'шкаф',
  'птица',
  'мёд',
] as const

export const MEMORY_WORDS_COUNT = 5
export const MEMORIZE_SECONDS = 25
export const TEST_TYPE = 'MEMORY_WORDS'

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function createMemoryRound() {
  const targetWords = shuffle([...WORD_POOL]).slice(0, MEMORY_WORDS_COUNT)
  const distractors = shuffle(
    WORD_POOL.filter((word) => !targetWords.includes(word)),
  ).slice(0, MEMORY_WORDS_COUNT)
  const choices = shuffle([...targetWords, ...distractors])

  return { targetWords, choices }
}

export function getScoreMessage(score: number, maxScore: number): string {
  const ratio = score / maxScore
  if (ratio === 1) return 'Превосходно! Вы запомнили все слова.'
  if (ratio >= 0.6) return 'Хороший результат! Продолжайте тренироваться.'
  if (ratio >= 0.4) return 'Неплохо! С каждым разом будет лучше.'
  return 'Это нормально. Попробуйте ещё раз — память тренируется.'
}
