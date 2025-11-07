import React, { useMemo } from 'react';
import { RadioInput, CheckboxInput, TextAreaInput } from '../Inputs';
import { useApplicationquestionsList } from '@/types/endpoints';
import type { ApplicationQuestion, QuestionTypeEnum } from '@/types/models';
import { form_data } from '@/types/application_form_types';

interface DynamicQuestionsProps {
  formData: Partial<form_data>;
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
  formData,
  handleChange,
  handleBlur,
  errors
}) => {
  // Fetch questions from API
  const { data: questions, isLoading, error } = useApplicationquestionsList();

  // Separate top-level and child questions
  const { topLevelQuestions, childrenByParent } = useMemo(() => {
    if (!questions) return { topLevelQuestions: [], childrenByParent: {} };
    
    const topLevel = questions.filter(q => !q.parent_question);
    const children = questions.filter(q => q.parent_question);
    
    const childMap: Record<string, ApplicationQuestion[]> = {};
    children.forEach(child => {
      if (child.parent_question) {
        if (!childMap[child.parent_question]) {
          childMap[child.parent_question] = [];
        }
        childMap[child.parent_question].push(child);
      }
    });
    
    return { topLevelQuestions: topLevel, childrenByParent: childMap };
  }, [questions]);

  // Check if a child question should be shown
  const shouldShowQuestion = (question: ApplicationQuestion): boolean => {
    if (!question.parent_question) return true;
    
    // Get parent question
    const parentQuestion = questions?.find(q => q.id === question.parent_question);
    if (!parentQuestion) return false;
    
    // Get parent response from formData
    const parentResponse = formData[parentQuestion.question_key as keyof form_data];
    if (!parentResponse) return false;
    
    // If no trigger_choices specified, show if parent has any response
    if (!question.trigger_choices || question.trigger_choices.length === 0) {
      return true;
    }
    
    // Check if parent response matches any trigger choice
    // Handle both single values and arrays
    const responseArray = Array.isArray(parentResponse) 
      ? parentResponse 
      : [parentResponse];
    
    return responseArray.some(choice => 
      question.trigger_choices ? (question.trigger_choices as unknown as string[]).includes(String(choice)) : false
    );
  };

  if (isLoading) {
    return (
      <div className="py-4 text-gray-600">
        Loading dynamic questions...
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="py-4 text-red-600">
        Error loading dynamic questions. Please try again.
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="py-4 text-gray-600">
        No dynamic questions configured for this event.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {topLevelQuestions.map(question => (
        <DynamicQuestion
          key={question.id}
          question={question}
          depth={0}
          formData={formData}
          handleChange={handleChange}
          handleBlur={handleBlur}
          errors={errors}
          questions={questions}
          childrenByParent={childrenByParent}
          shouldShowQuestion={shouldShowQuestion}
        />
      ))}
    </div>
  );
};

export default DynamicQuestions;


  // Component for rendering a dynamic question
  const DynamicQuestion: React.FC<{
    question: ApplicationQuestion;
    depth: number;
    formData: Partial<form_data>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    errors: Record<string, string>;
    questions: ApplicationQuestion[] | undefined;
    childrenByParent: Record<string, ApplicationQuestion[]>;
    shouldShowQuestion: (question: ApplicationQuestion) => boolean;
  }> = ({ question, depth, formData, handleChange, handleBlur, errors, questions, childrenByParent, shouldShowQuestion }) => {
    const questionKey = useMemo(() => question.question_key, [question]);
    const questionType = useMemo(() => question.question_type, [question]);
    const currentValue = useMemo(() => {
      return formData[questionKey as keyof form_data] || '';
    }, [formData, questionKey, questionType]);
  
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
            {question.required && (
              <span className="font-bold text-themeSecondary">*</span>
            )}
          </TextAreaInput>
          
          {question.id && childrenByParent[question.id]?.map((childQuestion: ApplicationQuestion) => (
            shouldShowQuestion(childQuestion) && (
              <DynamicQuestion
                key={childQuestion.id}
                question={childQuestion}
                depth={depth + 1}
                formData={formData}
                handleChange={handleChange}
                handleBlur={handleBlur}
                errors={errors}
                questions={questions}
                childrenByParent={childrenByParent}
                shouldShowQuestion={shouldShowQuestion}
              />
            )
          ))}
        </div>
      );
    }

    const isMultipleChoice = questionType === 'M';
    const InputComponent = isMultipleChoice ? CheckboxInput : RadioInput;
    
    return (
      <div className={depth > 0 ? 'pl-4 pb-4' : 'pb-4'}>
        <p className={`pb-2 ${question.required ? '' : 'mb-4'}`}>
          {question.question_text}
          {question.required && (
            <span className="font-bold text-themeSecondary">*</span>
          )}
        </p>
        
        <div className={isMultipleChoice ? 'pl-4' : ''}>
          {question.choices?.map(choice => {
            // Determine if this choice is checked
            let isChecked = false;
            if (currentValue) {
              if (Array.isArray(currentValue)) {
                isChecked = (currentValue as any[]).includes(choice.choice_key);
              } else {
                isChecked = String(currentValue) === choice.choice_key;
              }
            }
            
            return (
              <InputComponent
                key={choice.id}
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
        
        {/* Render child questions if they should be shown */}
        {question.id && childrenByParent[question.id]?.map((childQuestion: ApplicationQuestion) => (
          shouldShowQuestion(childQuestion) && (
            <DynamicQuestion
              key={childQuestion.id}
              question={childQuestion}
              depth={depth + 1}
              formData={formData}
              handleChange={handleChange}
              handleBlur={handleBlur}
              errors={errors}
              questions={questions}
              childrenByParent={childrenByParent}
              shouldShowQuestion={shouldShowQuestion}
            />
          )
        ))}
      </div>
    );
  };