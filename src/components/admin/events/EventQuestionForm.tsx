import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AppButton from '@/components/common/AppButton';
import AppDialog from '@/components/common/AppDialog';
import { CustomMultiSelect } from '@/components/CustomSelect';
import { TextInput } from '@/components/Inputs';
import {
  applicationquestionchoicesCreate,
  applicationquestionchoicesDestroy,
  applicationquestionchoicesPartialUpdate,
  applicationquestionsCreate,
  applicationquestionsPartialUpdate,
} from '@/types/endpoints';
import type {
  ApplicationQuestion,
  ApplicationQuestionRequest,
} from '@/types/models';
import { QUESTION_TYPE_LABELS } from './questionTypeLabels';
import type {
  ChoiceRow,
  QuestionFormType,
  QuestionFormValues,
} from './eventQuestionTypes';
import {
  initialFormValues,
  nextChoiceOrder,
  questionNeedsChoices,
} from './eventQuestionTypes';

type EventQuestionFormProps = {
  showDialog: boolean;
  item: ApplicationQuestion | null;
  eventId: string;
  formType: QuestionFormType;
  defaultOrder: number;
  questions: ApplicationQuestion[];
  onClose: () => void;
  onSuccess: () => void;
};

const QUESTION_TYPE_OPTIONS = Object.entries(QUESTION_TYPE_LABELS).map(
  ([value, label]) => ({ value, label }),
);

function ChoiceRowEditor({
  row,
  index,
  onChange,
  onRemove,
}: {
  row: ChoiceRow;
  index: number;
  onChange: (index: number, field: keyof ChoiceRow, value: string) => void;
  onRemove: (index: number) => void;
}): JSX.Element {
  return (
    <div className="flex items-start gap-2">
      <div className="flex flex-1 flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={row.choice_key}
          placeholder="Key (e.g. A, YES)"
          maxLength={24}
          onChange={(e) => onChange(index, 'choice_key', e.target.value)}
          className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm sm:w-28"
        />
        <input
          type="text"
          value={row.choice_text}
          placeholder="Display text"
          onChange={(e) => onChange(index, 'choice_text', e.target.value)}
          className="w-full flex-1 rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="mt-1.5 text-sm text-red-500 hover:text-red-700"
        aria-label="Remove choice"
      >
        ✕
      </button>
    </div>
  );
}

async function syncChoices(
  questionId: string,
  formChoices: ChoiceRow[],
  originalChoices: ChoiceRow[],
): Promise<void> {
  const originalById = new Map(
    originalChoices.filter((c) => c.id).map((c) => [c.id!, c]),
  );
  const formIds = new Set(formChoices.filter((c) => c.id).map((c) => c.id!));

  const toDelete = [...originalById.keys()].filter((id) => !formIds.has(id));
  const toCreate = formChoices.filter((c) => !c.id);
  const toUpdate = formChoices.filter((c) => {
    if (!c.id) return false;
    const orig = originalById.get(c.id);
    return (
      orig &&
      (orig.choice_key !== c.choice_key ||
        orig.choice_text !== c.choice_text ||
        orig.order !== c.order)
    );
  });

  await Promise.all([
    ...toDelete.map((id) => applicationquestionchoicesDestroy(id)),
    ...toCreate.map((c, i) =>
      applicationquestionchoicesCreate({
        question: questionId,
        choice_key: c.choice_key,
        choice_text: c.choice_text,
        order: c.order + i,
      }),
    ),
    ...toUpdate.map((c) =>
      applicationquestionchoicesPartialUpdate(c.id!, {
        question: questionId,
        choice_key: c.choice_key,
        choice_text: c.choice_text,
        order: c.order,
      }),
    ),
  ]);
}

export default function EventQuestionForm({
  showDialog,
  item,
  eventId,
  formType,
  defaultOrder,
  questions,
  onClose,
  onSuccess,
}: EventQuestionFormProps): JSX.Element {
  const [values, setValues] = useState<QuestionFormValues>(() =>
    initialFormValues(item, defaultOrder),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = !!item?.id;

  useEffect(() => {
    if (showDialog) {
      setValues(initialFormValues(item, defaultOrder));
    }
  }, [showDialog, item, defaultOrder]);

  function set<K extends keyof QuestionFormValues>(
    key: K,
    value: QuestionFormValues[K],
  ): void {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleTypeChange(newType: ApplicationQuestion['question_type']): void {
    setValues((prev) => ({
      ...prev,
      question_type: newType,
      choices: questionNeedsChoices(newType) ? prev.choices : [],
    }));
  }

  function handleParentChange(parentId: string): void {
    setValues((prev) => ({
      ...prev,
      parent_question: parentId,
      trigger_choices: [],
    }));
  }

  function handleChoiceChange(
    index: number,
    field: keyof ChoiceRow,
    value: string,
  ): void {
    setValues((prev) => {
      const updated = prev.choices.map((c, i) =>
        i === index ? { ...c, [field]: value } : c,
      );
      return { ...prev, choices: updated };
    });
  }

  function addChoice(): void {
    setValues((prev) => ({
      ...prev,
      choices: [
        ...prev.choices,
        { choice_key: '', choice_text: '', order: nextChoiceOrder(prev.choices) },
      ],
    }));
  }

  function removeChoice(index: number): void {
    setValues((prev) => ({
      ...prev,
      choices: prev.choices.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(): Promise<void> {
    if (!values.question_text.trim() || !values.question_key.trim()) {
      toast.error('Question text and key are required.');
      return;
    }

    if (questionNeedsChoices(values.question_type)) {
      const hasEmpty = values.choices.some(
        (c) => !c.choice_key.trim() || !c.choice_text.trim(),
      );
      if (hasEmpty) {
        toast.error('All choices must have a key and text.');
        return;
      }
    }

    const payload: ApplicationQuestionRequest = {
      question_key: values.question_key.trim(),
      question_text: values.question_text.trim(),
      question_type: values.question_type,
      required: values.required,
      order: values.order,
      form_type: formType,
      placeholder_text: values.placeholder_text.trim() || undefined,
      parent_question: values.parent_question || null,
      trigger_choices: (values.trigger_choices.length > 0
        ? values.trigger_choices
        : []) as unknown as ApplicationQuestionRequest['trigger_choices'],
    };

    const eventRequestOptions = { params: { event: eventId } };

    setIsSubmitting(true);
    try {
      let savedId: string | undefined;

      if (isEdit && item?.id) {
        await applicationquestionsPartialUpdate(item.id, payload, eventRequestOptions);
        savedId = item.id;
      } else {
        const created = await applicationquestionsCreate(payload, eventRequestOptions);
        savedId = created.id;
      }

      if (savedId && questionNeedsChoices(values.question_type)) {
        const originalChoices = (item?.choices ?? []).map((c) => ({
          id: c.id,
          choice_key: c.choice_key,
          choice_text: c.choice_text,
          order: c.order ?? 0,
        }));
        await syncChoices(savedId, values.choices, originalChoices);
      }

      toast.success(isEdit ? 'Question updated' : 'Question created');
      onSuccess();
      onClose();
    } catch {
      toast.error(isEdit ? 'Failed to update question' : 'Failed to create question');
    } finally {
      setIsSubmitting(false);
    }
  }

  const parentQuestion = questions.find((q) => q.id === values.parent_question);
  const parentChoiceOptions = (parentQuestion?.choices ?? []).map((c) => ({
    value: c.choice_key,
    label: `${c.choice_key} — ${c.choice_text}`,
  }));

  const parentOptions = questions
    .filter((q) => q.id !== item?.id)
    .map((q) => ({ value: q.id ?? '', label: q.question_key }));

  const showChoices = questionNeedsChoices(values.question_type);

  return (
    <AppDialog
      showDialog={showDialog}
      onClose={onClose}
      title={isEdit ? 'Edit question' : 'Add question'}
      onSubmit={() => void handleSubmit()}
      isSubmitting={isSubmitting}
    >
      <div className="flex flex-col gap-4 pt-1">
        <TextInput
          name="question_text"
          placeholder="Question text shown to applicants"
          value={values.question_text}
          onChange={(e) => set('question_text', e.target.value)}
          required
        >
          Question text
        </TextInput>
        <TextInput
          name="question_key"
          placeholder="e.g. hardware_hack_interest"
          value={values.question_key}
          onChange={(e) => set('question_key', e.target.value)}
          required
        >
          Key
        </TextInput>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Question type
          </label>
          <select
            value={values.question_type}
            onChange={(e) =>
              handleTypeChange(e.target.value as ApplicationQuestion['question_type'])
            }
            className="rounded border border-gray-300 px-2 py-1.5 text-sm"
          >
            {QUESTION_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="required-checkbox"
            type="checkbox"
            checked={values.required}
            onChange={(e) => set('required', e.target.checked)}
            className="accent-themePrimary"
          />
          <label htmlFor="required-checkbox" className="text-sm text-gray-700">
            Required
          </label>
        </div>

        <TextInput
          name="order"
          placeholder="Display order"
          type="number"
          value={String(values.order)}
          onChange={(e) => set('order', Number(e.target.value))}
        >
          Order
        </TextInput>

        <TextInput
          name="placeholder_text"
          placeholder="Placeholder text (optional)"
          value={values.placeholder_text}
          onChange={(e) => set('placeholder_text', e.target.value)}
        >
          Placeholder
        </TextInput>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Parent question (optional)
          </label>
          <select
            value={values.parent_question}
            onChange={(e) => handleParentChange(e.target.value)}
            className="rounded border border-gray-300 px-2 py-1.5 text-sm"
          >
            <option value="">— None —</option>
            {parentOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {values.parent_question && parentChoiceOptions.length > 0 ? (
          <div className="flex flex-col gap-1">
            <div className=" text-sm font-medium text-gray-700">
              Show when parent answer is
            </div>
            <CustomMultiSelect
              label="Trigger choices"
              options={parentChoiceOptions}
              value={values.trigger_choices}
              onChange={(v) => set('trigger_choices', v as string[])}
              search
              width="100%"
            />
          </div>
        ) : null}

        {showChoices ? (
          <div className="flex flex-col gap-2">
            <div className="text-sm font-medium text-gray-700">Choices</div>
            {values.choices.map((row, i) => (
              <ChoiceRowEditor
                key={row.id ?? `new-${i}`}
                row={row}
                index={i}
                onChange={handleChoiceChange}
                onRemove={removeChoice}
              />
            ))}
            <AppButton onClick={addChoice} size="xs" className="self-start">
              + Add choice
            </AppButton>
          </div>
        ) : null}
      </div>
    </AppDialog>
  );
}
