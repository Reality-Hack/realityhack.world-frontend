import { useCallback } from 'react';
import { toast } from 'sonner';
import {
  applicationquestionsDestroy,
} from '@/types/endpoints';
import type { ApplicationQuestion } from '@/types/models';
import { useAdminFormDialog } from './useAdminFormDialog';
import { nextQuestionOrder } from './eventQuestionTypes';

type UseQuestionAdminArgs = {
  eventId: string;
  questions: ApplicationQuestion[];
  invalidateQuestionsCache: () => Promise<void>;
};

export type UseQuestionAdminResult = {
  showForm: boolean;
  itemForForm: ApplicationQuestion | null;
  defaultOrder: number;
  openCreate: () => void;
  openEdit: (item: ApplicationQuestion) => void;
  closeForm: () => void;
  deleteQuestion: (item: ApplicationQuestion) => Promise<void>;
  handleFormSuccess: () => Promise<void>;
};

export function useQuestionAdmin({
  eventId,
  questions,
  invalidateQuestionsCache,
}: UseQuestionAdminArgs): UseQuestionAdminResult {
  const dialog = useAdminFormDialog<ApplicationQuestion>();

  const defaultOrder = nextQuestionOrder(questions);

  const eventRequestOptions = { params: { event: eventId } };

  const handleFormSuccess = useCallback(async (): Promise<void> => {
    await invalidateQuestionsCache();
  }, [invalidateQuestionsCache]);

  const deleteQuestion = useCallback(
    async (item: ApplicationQuestion): Promise<void> => {
      if (!item.id) {
        return;
      }

      const confirmed = window.confirm(
        `Delete question "${item.question_key}"? This cannot be undone.`,
      );
      if (!confirmed) {
        return;
      }

      try {
        await applicationquestionsDestroy(item.id, eventRequestOptions);
        toast.success('Question deleted');
        await invalidateQuestionsCache();
      } catch {
        toast.error('Failed to delete question');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [eventId, invalidateQuestionsCache],
  );

  return {
    showForm: dialog.showForm,
    itemForForm: dialog.itemForForm,
    defaultOrder,
    openCreate: dialog.openCreate,
    openEdit: dialog.openEdit,
    closeForm: dialog.closeForm,
    deleteQuestion,
    handleFormSuccess,
  };
}
