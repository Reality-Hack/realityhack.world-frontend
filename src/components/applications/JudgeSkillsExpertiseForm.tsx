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
      <div className="mb-8">
        <TextInput
          name="occupation"
          placeholder="Enter occupation"
          type="text"
          value={formData.occupation || ''}
          onChange={handleChange}
          error={errors.occupation}
          valid={!errors.occupation}
          onBlur={handleBlur}
        >
          What is your current occupation?{' '}
          <span className="font-bold text-themeSecondary">*</span>
        </TextInput>
      </div>
      <div className="mb-8">
        <TextInput
          name="employer"
          placeholder="Enter employer name"
          type="text"
          value={formData.employer || ''}
          onChange={handleChange}
          error={errors.employer}
          valid={!errors.employer}
          onBlur={handleBlur}
        >
          What company do you currently work for?{' '}
          <span className="font-bold text-themeSecondary">*</span>
        </TextInput>
      </div>
      <div className="mb-8">
        <SelectInput
          name="industry"
          placeholder="Select your industry"
          options={industries}
          value={formData.industry_option || ''}
          onChange={handleSelectChange}
          onBlur={handleBlur}
          error={errors.industry}
          required={true}
          valid={!errors.industry}
        >
          What industry represents your expertise?{' '}
          <span className="font-bold text-themeSecondary">*</span>
        </SelectInput>
      </div>
      <div className="mb-8">
        <TextAreaInput
          name="Judge_qualified_fields"
          placeholder="Discuss your qualifications"
          value={formData.Judge_qualified_fields || ''}
          onChange={handleChange}
          error={errors.Judge_qualified_fields}
          valid={!errors.Judge_qualified_fields}
          onBlur={handleBlur}
        >
          List the areas you are most qualified to Judge in.{' '}
          <span className="font-bold text-themeSecondary">*</span>
        </TextAreaInput>
      </div>
      <div className="mb-8">
        <TextAreaInput
          name="Judge_Judgeing_steps"
          placeholder="Discuss your debug process"
          value={formData.Judge_Judgeing_steps || ''}
          onChange={handleChange}
          error={errors.Judge_Judgeing_steps}
          valid={!errors.Judge_Judgeing_steps}
          onBlur={handleBlur}
        >
          Walk us through the steps you would take to help someone debug an
          issue. <span className="font-bold text-themeSecondary">*</span>
        </TextAreaInput>
      </div>

      <div className="mb-8">
        <p className="py-4">
          Have you Judgeed a hackathon before? Please note that this is not a
          requirement to become a Judge.
          <span className="font-bold text-themeSecondary">*</span>
        </p>
        <RadioInput
          name="Judge_previously_Judgeed"
          value="true"
          checked={formData.Judge_previously_Judgeed === 'true'}
          onChange={handleChange}
          label="Yes"
        />
        <RadioInput
          name="Judge_previously_Judgeed"
          value="false"
          checked={formData.Judge_previously_Judgeed === 'false'}
          onChange={handleChange}
          label="No"
        />
      </div>
    </div>
  );
};

export default JudgeSkillsExpertiseForm;
