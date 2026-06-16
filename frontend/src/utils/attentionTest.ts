export const ATTENTION_ROUNDS = 5
export const TEST_TYPE = 'ATTENTION_ODD_ONE'

export type ShapeType = 'circle' | 'square' | 'triangle'

export interface AttentionRound {
  cells: ShapeType[]
  oddIndex: number
}

const SHAPES: ShapeType[] = ['circle', 'square', 'triangle']

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function createAttentionRound(): AttentionRound {
  const mainShape = SHAPES[Math.floor(Math.random() * SHAPES.length)]
  let oddShape = SHAPES[Math.floor(Math.random() * SHAPES.length)]
  while (oddShape === mainShape) {
    oddShape = SHAPES[Math.floor(Math.random() * SHAPES.length)]
  }

  const oddIndex = Math.floor(Math.random() * 9)
  const cells = Array.from({ length: 9 }, (_, i) =>
    i === oddIndex ? oddShape : mainShape,
  )

  return { cells, oddIndex }
}

export function getAttentionScoreMessage(score: number, maxScore: number): string {
  const ratio = score / maxScore
  if (ratio === 1) return 'Отличная внимательность! Все ответы верны.'
  if (ratio >= 0.6) return 'Хороший результат! Вы внимательны.'
  if (ratio >= 0.4) return 'Неплохо! Тренируйтесь регулярно.'
  return 'Не расстраивайтесь — внимание улучшается с практикой.'
}

export const SHAPE_LABELS: Record<ShapeType, string> = {
  circle: 'круг',
  square: 'квадрат',
  triangle: 'треугольник',
}
