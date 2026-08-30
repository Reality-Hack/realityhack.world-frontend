import { useCallback, useState } from 'react';

export type UseAdminFormDialogResult<T> = {
  showForm: boolean;
  itemForForm: T | null;
  isEdit: boolean;
  openCreate: () => void;
  openEdit: (item: T) => void;
  closeForm: () => void;
};

export function useAdminFormDialog<T>(): UseAdminFormDialogResult<T> {
  const [showForm, setShowForm] = useState(false);
  const [itemForForm, setItemForForm] = useState<T | null>(null);

  const openCreate = useCallback((): void => {
    setItemForForm(null);
    setShowForm(true);
  }, []);

  const openEdit = useCallback((item: T): void => {
    setItemForForm(item);
    setShowForm(true);
  }, []);

  const closeForm = useCallback((): void => {
    setShowForm(false);
    setItemForForm(null);
  }, []);

  return {
    showForm,
    itemForForm,
    isEdit: itemForForm !== null,
    openCreate,
    openEdit,
    closeForm,
  };
}
