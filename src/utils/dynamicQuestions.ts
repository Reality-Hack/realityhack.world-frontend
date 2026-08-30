import { ApplicationQuestion } from '@/types/models';

export type DynamicQuestionValue = string | string[] | null;
/** Answers keyed by question_key. Wider form objects are accepted via Record<string, unknown>. */
export type DynamicFormData = Record<string, DynamicQuestionValue>;
export type QuestionFormData = Record<string, unknown>;

export type QuestionTree = {
  topLevelQuestions: ApplicationQuestion[];
  childrenByParent: Map<string, ApplicationQuestion[]>;
  questionById: Map<string, ApplicationQuestion>;
  /** Record view for components that prefer plain objects over Maps. */
  childrenByParentRecord: Record<string, ApplicationQuestion[]>;
};

function compareByOrder(a: ApplicationQuestion, b: ApplicationQuestion): number {
  return (a.order ?? 0) - (b.order ?? 0);
}

export function getTriggerChoices(question: ApplicationQuestion): string[] {
  if (!Array.isArray(question.trigger_choices)) {
    return [];
  }
  return question.trigger_choices.map(String);
}

export function buildQuestionTree(
  questions: ApplicationQuestion[] | undefined,
): QuestionTree {
  const emptyTree: QuestionTree = {
    topLevelQuestions: [],
    childrenByParent: new Map(),
    questionById: new Map(),
    childrenByParentRecord: {},
  };

  if (!questions?.length) {
    return emptyTree;
  }

  const sorted = [...questions].sort(compareByOrder);
  const questionById = new Map<string, ApplicationQuestion>();
  const childrenByParent = new Map<string, ApplicationQuestion[]>();

  for (const question of sorted) {
    if (question.id) {
      questionById.set(question.id, question);
    }
    if (question.parent_question) {
      const siblings = childrenByParent.get(question.parent_question) ?? [];
      siblings.push(question);
      childrenByParent.set(question.parent_question, siblings);
    }
  }

  for (const [parentId, children] of childrenByParent) {
    childrenByParent.set(parentId, [...children].sort(compareByOrder));
  }

  const childrenByParentRecord: Record<string, ApplicationQuestion[]> = {};
  for (const [parentId, children] of childrenByParent) {
    childrenByParentRecord[parentId] = children;
  }

  return {
    topLevelQuestions: sorted.filter((question) => !question.parent_question),
    childrenByParent,
    questionById,
    childrenByParentRecord,
  };
}

export function isConfigurableQuestion(
  fieldName: string,
  questions: ApplicationQuestion[] | undefined,
): boolean {
  return questions?.some((question) => question.question_key === fieldName) ?? false;
}

/**
 * Initialize form data values for dynamic questions based on question types.
 */
export function initializeDynamicQuestions<T extends QuestionFormData>(
  questions: ApplicationQuestion[] | undefined,
  existingFormData: T,
): T {
  if (!questions) {
    return existingFormData;
  }

  const dynamicFields: Record<string, unknown> = { ...existingFormData };

  for (const question of questions) {
    const key = question.question_key;

    if (dynamicFields[key] !== undefined) {
      continue;
    }

    switch (question.question_type) {
      case 'M':
        dynamicFields[key] = [];
        break;
      case 'S':
        dynamicFields[key] = null;
        break;
      case 'T':
      case 'L':
        dynamicFields[key] = '';
        break;
      default:
        dynamicFields[key] = null;
    }
  }

  return dynamicFields as T;
}

function hasParentResponse(value: unknown): boolean {
  if (value === null || value === undefined || value === '') {
    return false;
  }
  if (Array.isArray(value) && value.length === 0) {
    return false;
  }
  return true;
}

/**
 * Check if a question should be visible based on parent response.
 */
export function shouldShowQuestion(
  question: ApplicationQuestion,
  questions: ApplicationQuestion[],
  formData: QuestionFormData,
  questionById?: Map<string, ApplicationQuestion>,
): boolean {
  if (!question.parent_question) {
    return true;
  }

  const byId = questionById ?? buildQuestionTree(questions).questionById;
  const parentQuestion =
    byId.get(question.parent_question) ??
    questions.find((candidate) => candidate.id === question.parent_question);

  if (!parentQuestion) {
    return false;
  }

  const parentValue = formData[parentQuestion.question_key];
  if (!hasParentResponse(parentValue)) {
    return false;
  }

  const triggerChoices = getTriggerChoices(question);
  if (triggerChoices.length === 0) {
    return true;
  }

  const parentArray = Array.isArray(parentValue)
    ? parentValue.map(String)
    : [String(parentValue)];

  return parentArray.some((value) => triggerChoices.includes(value));
}

/**
 * Questions visible for the current form answers (applicant flow or admin preview).
 */
export function getVisibleQuestions(
  questions: ApplicationQuestion[] | undefined,
  formData: QuestionFormData,
): ApplicationQuestion[] {
  if (!questions?.length) {
    return [];
  }

  const { questionById } = buildQuestionTree(questions);
  return questions.filter((question) =>
    shouldShowQuestion(question, questions, formData, questionById),
  );
}

/**
 * Get all required fields for visible dynamic questions.
 */
export function getDynamicRequiredFields(
  questions: ApplicationQuestion[] | undefined,
  formData: QuestionFormData,
): string[] {
  if (!questions) {
    return [];
  }

  const { questionById } = buildQuestionTree(questions);

  return questions
    .filter((question) => {
      if (!question.required) {
        return false;
      }
      return shouldShowQuestion(question, questions, formData, questionById);
    })
    .map((question) => question.question_key);
}

/**
 * Validate a dynamic question response.
 */
export function validateDynamicQuestion(
  question: ApplicationQuestion,
  value: unknown,
  isRequired: boolean,
): string {
  if (isRequired) {
    if (question.question_type === 'M' || question.question_type === 'S') {
      if (
        value === null ||
        value === undefined ||
        (Array.isArray(value) && value.length === 0)
      ) {
        return 'This field is required.';
      }
    } else if (question.question_type === 'T' || question.question_type === 'L') {
      if (!value || (typeof value === 'string' && !value.trim())) {
        return 'This field is required.';
      }
    }
  }

  if (question.question_type === 'T' || question.question_type === 'L') {
    const textValue = String(value ?? '').trim();

    if (
      question.min_length &&
      textValue.length > 0 &&
      textValue.length < question.min_length
    ) {
      return `Response must be at least ${question.min_length} characters.`;
    }

    if (question.max_length && textValue.length > question.max_length) {
      return `Response must not exceed ${question.max_length} characters.`;
    }
  }

  return '';
}

/**
 * Get the question definition for a field.
 */
export function getQuestionForField(
  fieldName: string,
  questions: ApplicationQuestion[] | undefined,
): ApplicationQuestion | undefined {
  return questions?.find((question) => question.question_key === fieldName);
}

/**
 * Check if a tab is valid including dynamic questions.
 */
export function validateTabWithDynamicQuestions(
  requiredFields: string[],
  formData: QuestionFormData,
  questions: ApplicationQuestion[] | undefined,
  staticFieldValidator: (field: string, value: unknown) => string | null,
): boolean {
  if (requiredFields.every((field) => field === '')) {
    return true;
  }

  for (const field of requiredFields) {
    const fieldValue = formData[field];
    const dynamicQuestion = getQuestionForField(field, questions);

    if (dynamicQuestion && isConfigurableQuestion(field, questions)) {
      const validationError = validateDynamicQuestion(
        dynamicQuestion,
        fieldValue,
        true,
      );

      if (validationError) {
        return false;
      }
    } else {
      const validationError = staticFieldValidator(field, fieldValue);
      if (validationError) {
        return false;
      }

      if (typeof fieldValue === 'string' && fieldValue.trim().length < 1) {
        return false;
      } else if (Array.isArray(fieldValue) && fieldValue.length === 0) {
        return false;
      } else if (typeof fieldValue === 'boolean' && fieldValue === null) {
        return false;
      } else if (!fieldValue) {
        return false;
      }
    }
  }

  return true;
}
