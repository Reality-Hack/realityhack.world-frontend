import React from 'react';
import type { ApplicationQuestion } from '@/types/models';
import type { QuestionFormData } from '@/utils/dynamicQuestions';
import DynamicQuestions from './DynamicQuestions';

interface FormProps {
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

const ThematicForm: React.FC<FormProps> = ({
  questions,
  formData,
  handleChange,
  handleBlur,
  errors,
}) => {
  return (
    <div className="px-6">
      <p className="mb-4 text-xl font-bold text-purple-900">Thematic</p>
      <DynamicQuestions
        questions={questions}
        formData={formData}
        handleChange={handleChange}
        handleBlur={handleBlur}
        errors={errors}
      />
    </div>
  );
};

export default ThematicForm;
