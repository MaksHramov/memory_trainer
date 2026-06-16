const TEST_TYPE_LABELS: Record<string, string> = {
  MEMORY_WORDS: 'Запоминание слов',
  ATTENTION_ODD_ONE: 'Тест на внимательность',
}

export function getTestTypeLabel(testType: string, testTypeLabel?: string): string {
  if (testTypeLabel && testTypeLabel !== testType) {
    return testTypeLabel
  }
  return TEST_TYPE_LABELS[testType] ?? testTypeLabel ?? testType
}
