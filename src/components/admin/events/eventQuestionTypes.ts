import type {
  ApplicationQuestion,
  ApplicationQuestionChoice,
  ApplicationquestionsListFormType,
} from '@/types/models';

export type { ApplicationquestionsListFormType as QuestionFormType };

/** A choice row in the form — may be unsaved (no `id`) or an existing choice. */
export type ChoiceRow = {
  id?: string;
  choice_key: string;
  choice_text: string;
  order: number;
};

/** Subset of ApplicationQuestion fields used in the admin form. */
export type QuestionFormValues = {
  question_text: string;
  question_key: string;
  question_type: ApplicationQuestion['question_type'];
  required: boolean;
  order: number;
  placeholder_text: string;
  parent_question: string;
  trigger_choices: string[];
  choices: ChoiceRow[];
};

export function toChoiceRow(choice: ApplicationQuestionChoice): ChoiceRow {
  return {
    id: choice.id,
    choice_key: choice.choice_key,
    choice_text: choice.choice_text,
    order: choice.order ?? 0,
  };
}

export function questionNeedsChoices(
  type: ApplicationQuestion['question_type'],
): boolean {
  return type === 'S' || type === 'M';
}

export function nextQuestionOrder(questions: ApplicationQuestion[]): number {
  if (questions.length === 0) {
    return 0;
  }
  return Math.max(...questions.map((q) => q.order ?? 0)) + 1;
}

export function nextChoiceOrder(choices: ChoiceRow[]): number {
  if (choices.length === 0) {
    return 0;
  }
  return Math.max(...choices.map((c) => c.order)) + 1;
}

export function initialFormValues(
  item: ApplicationQuestion | null,
  defaultOrder: number,
): QuestionFormValues {
  return {
    question_text: item?.question_text ?? '',
    question_key: item?.question_key ?? '',
    question_type: item?.question_type ?? 'T',
    required: item?.required ?? true,
    order: item?.order ?? defaultOrder,
    placeholder_text: item?.placeholder_text ?? '',
    parent_question: item?.parent_question ?? '',
    trigger_choices: Array.isArray(item?.trigger_choices)
      ? (item.trigger_choices as string[])
      : [],
    choices: (item?.choices ? [...item.choices] : []).map(toChoiceRow),
  };
}
