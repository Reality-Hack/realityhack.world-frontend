import React from 'react';
import {
  form_data,
} from '@/types/application_form_types';
import DynamicQuestions from './DynamicQuestions';

interface FormProps {
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

const ThematicForm: React.FC<FormProps> = ({
  formData,
  handleChange,
  handleBlur,
  errors
}) => {
  return (
    <div className="px-6">
      <p className="mb-4 text-xl font-bold text-purple-900">Thematic</p>
        <DynamicQuestions
          formData={formData}
          handleChange={handleChange}
          handleBlur={handleBlur}
          errors={errors}
        />
    </div>
  );
};

export default ThematicForm;
