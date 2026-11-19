import React from 'react';
import { PackageOpen } from 'lucide-react';

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        {icon || <PackageOpen className="h-7 w-7" />}
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
      {description && <p className="text-sm text-slate-500 max-w-sm mb-5">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};
