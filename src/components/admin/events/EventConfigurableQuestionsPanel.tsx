import { useApplicationquestionsList } from '@/types/endpoints';
import {
  ApplicationQuestion,
  ApplicationQuestionChoice,
  ApplicationquestionsListFormType,
} from '@/types/models';
import { useMemo } from 'react';
import MetaBadge from './MetaBadge';
import {
  EventPanelEmpty,
  EventPanelError,
  EventPanelLoader,
} from './EventPanelStates';
import { sortByOrder } from './sortByOrder';
import { QUESTION_TYPE_LABELS } from './questionTypeLabels';
import { useAdminEvent } from '@/contexts/AdminEventContext';

type QuestionRowProps = {
  question: ApplicationQuestion;
  childrenByParent: Map<string, ApplicationQuestion[]>;
  questionById: Map<string, ApplicationQuestion>;
  depth?: number;
};

function QuestionRow({
  question,
  childrenByParent,
  questionById,
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
  const triggerChoices = Array.isArray(question.trigger_choices)
    ? (question.trigger_choices as string[])
    : [];

  return (
    <div
      className="border-b border-gray-200 pb-4 dark:border-borderDark"
      style={{ marginLeft: depth > 0 ? `${depth * 1.5}rem` : undefined }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium">{question.question_text}</span>
          {question.order !== undefined ? (
            <MetaBadge>Order {question.order}</MetaBadge>
          ) : null}
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
                <li key={choice.id ?? `${choice.choice_key}-${choice.choice_text}`} className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-mono text-xs text-gray-500">{choice.choice_key}</span>
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
  const { eventId, isQueryEnabled } = useAdminEvent();

  const {
    data: questions,
    isLoading,
    error,
  } = useApplicationquestionsList(
    { event: eventId, form_type: formType },
    { swr: { enabled: isQueryEnabled } },
  );

  const { topLevelQuestions, childrenByParent, questionById } = useMemo(() => {
    const sorted = sortByOrder(questions ?? []);
    const byParent = new Map<string, ApplicationQuestion[]>();
    const byId = new Map<string, ApplicationQuestion>();

    for (const question of sorted) {
      if (question.id) {
        byId.set(question.id, question);
      }
      if (question.parent_question) {
        const siblings = byParent.get(question.parent_question) ?? [];
        siblings.push(question);
        byParent.set(question.parent_question, siblings);
      }
    }

    return {
      topLevelQuestions: sorted.filter((question) => !question.parent_question),
      childrenByParent: byParent,
      questionById: byId,
    };
  }, [questions]);

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

  if (topLevelQuestions.length === 0) {
    return (
      <EventPanelEmpty
        message={`No ${questionKindLabel} questions are configured for this event.`}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-8">
      <p className="text-sm text-gray-600">
        {topLevelQuestions.length}{' '}
        {topLevelQuestions.length === 1 ? 'question' : 'questions'}
        {(questions?.length ?? 0) > topLevelQuestions.length
          ? ` (${questions?.length} total including conditional follow-ups)`
          : ''}
      </p>
      {topLevelQuestions.map((question) => (
        <QuestionRow
          key={question.id ?? question.question_key}
          question={question}
          childrenByParent={childrenByParent}
          questionById={questionById}
        />
      ))}
    </div>
  );
}
