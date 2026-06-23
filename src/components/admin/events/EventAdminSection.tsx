import { type ReactNode } from 'react';
import AppButton from '@/components/common/AppButton';

export type EventAdminSectionProps = {
  title: string;
  description?: ReactNode;
  addLabel: string;
  onAdd: () => void;
  addDisabled?: boolean;
  count?: number;
  children: ReactNode;
  className?: string;
};

export default function EventAdminSection({
  title,
  description,
  addLabel,
  onAdd,
  addDisabled = false,
  count,
  children,
  className,
}: EventAdminSectionProps): JSX.Element {
  const titleSuffix =
    count !== undefined ? (
      <span className="text-sm font-normal text-gray-500"> ({count})</span>
    ) : null;

  return (
    <section
      className={['flex flex-col gap-4', className].filter(Boolean).join(' ')}
    >
      <div className="flex flex-row items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">
            {title}
            {titleSuffix}
          </h2>
          {description ? (
            <p className="text-sm text-gray-600">{description}</p>
          ) : null}
        </div>
        <AppButton onClick={onAdd} disabled={addDisabled}>
          {addLabel}
        </AppButton>
      </div>
      {children}
    </section>
  );
}
