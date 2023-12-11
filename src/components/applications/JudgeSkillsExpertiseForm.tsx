import React from 'react';
import { TextInput, TextAreaInput, SelectInput, RadioInput } from '../Inputs';
import { form_data, option_value } from '../../types/application_form_types';

interface FormProps {
  formData: Partial<form_data>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<form_data>>>;
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
  industries: option_value[];
}

const JudgeSkillsExpertiseForm: React.FC<FormProps> = ({
  formData,
  setFormData,
  handleChange,
  handleBlur,
  errors,
  industries
}) => {
  const handleSelectChange = (
    value: string[],
    name: string,
    options: { value: string; display_name: string }[]
  ) => {
    const selectedOption = options.find(option => option.value === value[0]);
    const displayName = selectedOption ? selectedOption.display_name : null;

    setFormData(prev => ({
      ...prev,
      [name]: value,
      [`${name}_option`]: displayName
    }));
  };

  return (
    <div className="px-6">
      <p className="mb-4 text-xl font-bold text-purple-900">
        Skills & Expertise
      </p>
    </div>
  );
};

export default JudgeSkillsExpertiseForm;
