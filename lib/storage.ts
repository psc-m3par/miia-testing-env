import usersData from '@/data/users.json';
import criteriaData from '@/data/criteria.json';
import feedbacksData from '@/data/feedbacks.json';
import { User, Criteria, Feedback } from './types';

// In-memory store seeded from JSON files
const store = {
  users: usersData.users as User[],
  criteria: criteriaData.criteria as Criteria[],
  feedbacks: feedbacksData.feedbacks as Feedback[],
};

export function getUsers(): User[] {
  return store.users;
}

export function getUserById(id: string): User | undefined {
  return store.users.find(u => u.id === id);
}

export function getUserByCode(code: string): User | undefined {
  return store.users.find(u => u.accessCode.toUpperCase() === code.toUpperCase());
}

export function updateUser(updated: User): void {
  const idx = store.users.findIndex(u => u.id === updated.id);
  if (idx !== -1) store.users[idx] = updated;
}

export function getCriteria(): Criteria[] {
  return store.criteria.filter(c => c.active);
}

export function addFeedback(feedback: Feedback): void {
  store.feedbacks.push(feedback);
}
