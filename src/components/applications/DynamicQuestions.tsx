import React, { useMemo } from 'react';
import { RadioInput, CheckboxInput, TextAreaInput } from '../Inputs';
import type { ApplicationQuestion } from '@/types/models';
import {
  buildQuestionTree,
  QuestionFormData,
  shouldShowQuestion,
} from '@/utils/dynamicQuestions';

interface DynamicQuestionsProps {
  questions: ApplicationQuestion[];
  formData: QuestionFormData;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  handleBlur: (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  errors: Record<string, string>;
}

const DynamicQuestions: React.FC<DynamicQuestionsProps> = ({
  questions,
  formData,
  handleChange,
  handleBlur,
  errors,
}) => {
  const { topLevelQuestions, childrenByParentRecord, questionById } = useMemo(
    () => buildQuestionTree(questions),
    [questions],
  );

  const isQuestionVisible = (question: ApplicationQuestion): boolean =>
    shouldShowQuestion(question, questions, formData, questionById);

  if (questions.length === 0) {
    return (
      <div className="py-4 text-gray-600">
        No dynamic questions configured for this event.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {topLevelQuestions.map((question) => (
        <DynamicQuestion
          key={question.id ?? question.question_key}
          question={question}
          depth={0}
          formData={formData}
          handleChange={handleChange}
          handleBlur={handleBlur}
          errors={errors}
          questions={questions}
          childrenByParent={childrenByParentRecord}
          isQuestionVisible={isQuestionVisible}
        />
      ))}
    </div>
  );
};

export default DynamicQuestions;

type DynamicQuestionProps = {
  question: ApplicationQuestion;
  depth: number;
  formData: QuestionFormData;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  handleBlur: (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  errors: Record<string, string>;
  questions: ApplicationQuestion[];
  childrenByParent: Record<string, ApplicationQuestion[]>;
  isQuestionVisible: (question: ApplicationQuestion) => boolean;
};

const DynamicQuestion: React.FC<DynamicQuestionProps> = ({
  question,
  depth,
  formData,
  handleChange,
  handleBlur,
  errors,
  questions,
  childrenByParent,
  isQuestionVisible,
}) => {
  const questionKey = question.question_key;
  const questionType = question.question_type;
  const currentValue = formData[questionKey];

  const childQuestions =
    question.id !== undefined ? (childrenByParent[question.id] ?? []) : [];

  if (questionType === 'T' || questionType === 'L') {
    return (
      <div className={depth > 0 ? 'pl-4 pb-4' : 'pb-4'}>
        <TextAreaInput
          name={questionKey}
          placeholder={question.placeholder_text || 'Enter your response here.'}
          value={String(currentValue || '')}
          onChange={handleChange}
          error={errors[questionKey]}
          valid={!errors[questionKey]}
          onBlur={handleBlur}
          rows={questionType === 'L' ? 12 : 4}
        >
          {question.question_text}
          {question.required ? (
            <span className="font-bold text-themeSecondary">*</span>
          ) : null}
        </TextAreaInput>

        {childQuestions.map((childQuestion) =>
          isQuestionVisible(childQuestion) ? (
            <DynamicQuestion
              key={childQuestion.id ?? childQuestion.question_key}
              question={childQuestion}
              depth={depth + 1}
              formData={formData}
              handleChange={handleChange}
              handleBlur={handleBlur}
              errors={errors}
              questions={questions}
              childrenByParent={childrenByParent}
              isQuestionVisible={isQuestionVisible}
            />
          ) : null,
        )}
      </div>
    );
  }

  const isMultipleChoice = questionType === 'M';
  const InputComponent = isMultipleChoice ? CheckboxInput : RadioInput;

  return (
    <div className={depth > 0 ? 'pl-4 pb-4' : 'pb-4'}>
      <p className={`pb-2 ${question.required ? '' : 'mb-4'}`}>
        {question.question_text}
        {question.required ? (
          <span className="font-bold text-themeSecondary">*</span>
        ) : null}
      </p>

      <div className={isMultipleChoice ? 'pl-4' : ''}>
        {question.choices?.map((choice) => {
          let isChecked = false;
          if (currentValue) {
            if (Array.isArray(currentValue)) {
              isChecked = currentValue.includes(choice.choice_key);
            } else {
              isChecked = String(currentValue) === choice.choice_key;
            }
          }

          return (
            <InputComponent
              key={choice.id ?? choice.choice_key}
              name={questionKey}
              value={choice.choice_key}
              checked={isChecked}
              onChange={handleChange}
              onBlur={handleBlur}
              label={choice.choice_text}
              error={errors[questionKey]}
            />
          );
        })}
      </div>

      {childQuestions.map((childQuestion) =>
        isQuestionVisible(childQuestion) ? (
          <DynamicQuestion
            key={childQuestion.id ?? childQuestion.question_key}
            question={childQuestion}
            depth={depth + 1}
            formData={formData}
            handleChange={handleChange}
            handleBlur={handleBlur}
            errors={errors}
            questions={questions}
            childrenByParent={childrenByParent}
            isQuestionVisible={isQuestionVisible}
          />
        ) : null,
      )}
    </div>
  );
};
