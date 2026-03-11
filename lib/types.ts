export interface TestRecord {
  testId: string;
  criteria: string;
  year: string;
  status: 'in_progress' | 'completed';
  startedAt: string;
  completedAt?: string;
  feedbackSubmitted: boolean;
  feedbackText?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  accessCode: string;
  totalCredits: number;
  usedCredits: number;
  tests: TestRecord[];
  createdAt: string;
}

export interface Criteria {
  id: string;
  name: string;
  description: string;
  years: string[];
  active: boolean;
}

export interface Feedback {
  id: string;
  userId: string;
  testId: string;
  criteria: string;
  year: string;
  textFeedback: string;
  fields: Record<string, unknown>;
  submittedAt: string;
}
