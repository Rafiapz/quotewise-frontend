export type StatusVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

export interface BaseEntity {
  id: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}
