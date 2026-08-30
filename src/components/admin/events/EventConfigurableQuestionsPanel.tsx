import { useApplicationquestionsList } from '@/types/endpoints';
import {
  ApplicationQuestion,
  ApplicationQuestionChoice,
  ApplicationquestionsListFormType,
} from '@/types/models';
import { useMemo } from 'react';
import AppButton from '@/components/common/AppButton';
import MetaBadge from './MetaBadge';
import {
  EventPanelError,
  EventPanelLoader,
} from './EventPanelStates';
import { QUESTION_TYPE_LABELS } from './questionTypeLabels';
import { useAdminEvent } from '@/contexts/AdminEventContext';
import { buildQuestionTree, getTriggerChoices } from '@/utils/dynamicQuestions';
import EventAdminSection from './EventAdminSection';
import EventQuestionForm from './EventQuestionForm';
import { useQuestionAdmin } from './useQuestionAdmin';

type QuestionRowProps = {
  question: ApplicationQuestion;
  childrenByParent: Map<string, ApplicationQuestion[]>;
  questionById: Map<string, ApplicationQuestion>;
  onEdit: (q: ApplicationQuestion) => void;
  onDelete: (q: ApplicationQuestion) => Promise<void>;
  depth?: number;
};

function QuestionRow({
  question,
  childrenByParent,
  questionById,
  onEdit,
  onDelete,
  depth = 0,
}: QuestionRowProps): JSX.Element {
  const childQuestions = question.id
    ? (childrenByParent.get(question.id) ?? [])
    : [];
  const choiceCount = question.choices?.length ?? 0;
  const hasChoices = question.question_type === 'S' || question.question_type === 'M';
  const parentQuestion = question.parent_question
    ? questionById.get(question.parent_question)
    : undefined;
  const triggerChoices = getTriggerChoices(question);

  return (
    <div
      className="border-b border-gray-200 pb-4 dark:border-borderDark"
      style={{ marginLeft: depth > 0 ? `${depth * 1.5}rem` : undefined }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium">{question.question_text}</span>
            {question.order !== undefined ? (
              <MetaBadge>Order {question.order}</MetaBadge>
            ) : null}
          </div>
          <div className="flex gap-2">
            <AppButton size="xs" onClick={() => onEdit(question)}>
              Edit
            </AppButton>
            <AppButton size="xs" onClick={() => void onDelete(question)}>
              Delete
            </AppButton>
          </div>
        </div>
        <div className="text-sm text-gray-500">{question.question_key}</div>
        <div className="flex flex-wrap gap-2">
          <MetaBadge>
            {QUESTION_TYPE_LABELS[question.question_type]}
          </MetaBadge>
          <MetaBadge>
            {question.required ? 'Required' : 'Optional'}
          </MetaBadge>
          {hasChoices ? (
            <MetaBadge>
              {choiceCount} {choiceCount === 1 ? 'choice' : 'choices'}
            </MetaBadge>
          ) : null}
          {parentQuestion ? (
            <MetaBadge>
              Conditional on &ldquo;{parentQuestion.question_key}&rdquo;
              {triggerChoices.length > 0
                ? `: ${triggerChoices.join(', ')}`
                : ''}
            </MetaBadge>
          ) : null}
        </div>
        {hasChoices && choiceCount > 0 ? (
          <ul className="mt-1 flex flex-col gap-1 pl-4">
            {[...(question.choices ?? [])]
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map((choice: ApplicationQuestionChoice) => (
                <li
                  key={choice.id ?? `${choice.choice_key}-${choice.choice_text}`}
                  className="text-sm text-gray-600 dark:text-gray-400"
                >
                  <span className="font-mono text-xs text-gray-500">
                    {choice.choice_key}
                  </span>
                  {' — '}
                  {choice.choice_text}
                </li>
              ))}
          </ul>
        ) : null}
      </div>
      {childQuestions.length > 0 ? (
        <div className="mt-4 flex flex-col gap-4">
          {childQuestions.map((child) => (
            <QuestionRow
              key={child.id ?? child.question_key}
              question={child}
              childrenByParent={childrenByParent}
              questionById={questionById}
              onEdit={onEdit}
              onDelete={onDelete}
              depth={depth + 1}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

type EventConfigurableQuestionsPanelProps = {
  formType: ApplicationquestionsListFormType;
  questionKindLabel: string;
};

export default function EventConfigurableQuestionsPanel({
  formType,
  questionKindLabel,
}: EventConfigurableQuestionsPanelProps): JSX.Element {
  const { eventId, isQueryEnabled, invalidateQuestionsCache } = useAdminEvent();

  const {
    data: questions,
    isLoading,
    error,
  } = useApplicationquestionsList(
    { event: eventId, form_type: formType },
    { swr: { enabled: isQueryEnabled } },
  );

  const { topLevelQuestions, childrenByParent, questionById } = useMemo(
    () => buildQuestionTree(questions),
    [questions],
  );

  const totalQuestionCount = questions?.length ?? 0;
  const followUpCount = totalQuestionCount - topLevelQuestions.length;

  const invalidate = useMemo(
    () => () => invalidateQuestionsCache(formType),
    [invalidateQuestionsCache, formType],
  );

  const {
    showForm,
    itemForForm,
    defaultOrder,
    openCreate,
    openEdit,
    closeForm,
    deleteQuestion,
    handleFormSuccess,
  } = useQuestionAdmin({
    eventId,
    questions: questions ?? [],
    invalidateQuestionsCache: invalidate,
  });

  if (isLoading) {
    return <EventPanelLoader />;
  }

  if (error) {
    return (
      <EventPanelError
        message={`Failed to load ${questionKindLabel} questions. Please try again.`}
      />
    );
  }

  const titleLabel = `${questionKindLabel.charAt(0).toUpperCase()}${questionKindLabel.slice(1)} questions`;

  return (
    <div className="pb-8">
      <EventAdminSection
        title={titleLabel}
        description={
          topLevelQuestions.length > 0
            ? `${topLevelQuestions.length} top-level ${
                topLevelQuestions.length === 1 ? 'question' : 'questions'
              }${
                followUpCount > 0
                  ? ` (${totalQuestionCount} total including conditional follow-ups)`
                  : ''
              }`
            : `Configure ${questionKindLabel} questions for this event.`
        }
        addLabel="Add question"
        onAdd={openCreate}
        count={totalQuestionCount}
      >
        {topLevelQuestions.length === 0 ? (
          <p className="text-gray-600">
            No {questionKindLabel} questions are configured for this event yet.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {topLevelQuestions.map((question) => (
              <QuestionRow
                key={question.id ?? question.question_key}
                question={question}
                childrenByParent={childrenByParent}
                questionById={questionById}
                onEdit={openEdit}
                onDelete={deleteQuestion}
              />
            ))}
          </div>
        )}
      </EventAdminSection>

      {showForm ? (
        <EventQuestionForm
          showDialog={showForm}
          item={itemForForm}
          eventId={eventId}
          formType={formType}
          defaultOrder={defaultOrder}
          questions={questions ?? []}
          onClose={closeForm}
          onSuccess={() => void handleFormSuccess()}
        />
      ) : null}
    </div>
  );
}
