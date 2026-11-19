export type StatusVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}
