import { TestRecord } from './types';

export function getLocalTests(): TestRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('miia_tests') ?? '[]');
  } catch {
    return [];
  }
}

export function setLocalTests(tests: TestRecord[]): void {
  localStorage.setItem('miia_tests', JSON.stringify(tests));
}

export function getTotalCredits(): number {
  if (typeof window === 'undefined') return 0;
  return parseInt(localStorage.getItem('miia_totalCredits') ?? '0', 10);
}

export function setTotalCredits(n: number): void {
  localStorage.setItem('miia_totalCredits', String(n));
}

export function addLocalTest(test: TestRecord): void {
  const tests = getLocalTests();
  tests.unshift(test);
  setLocalTests(tests);
}

export function updateLocalTest(testId: string, updates: Partial<TestRecord>): void {
  const tests = getLocalTests();
  const idx = tests.findIndex(t => t.testId === testId);
  if (idx !== -1) {
    tests[idx] = { ...tests[idx], ...updates };
    setLocalTests(tests);
  }
}

export function getLocalTest(testId: string): TestRecord | undefined {
  return getLocalTests().find(t => t.testId === testId);
}

export function clearLocalUserData(): void {
  localStorage.removeItem('miia_totalCredits');
  localStorage.removeItem('miia_tests');
}
