export const Roles = {
  ASSISTANT: 'ASSISTANT',
  PROFESSOR: 'PROFESSOR',
  STAFF: 'STAFF',
  ADMIN: 'ADMIN'
} as const;

export type Role = keyof typeof Roles;
