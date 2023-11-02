import React from 'react';
import { TextAreaInput } from '../Inputs';
import { form_data } from '../../application_form_types';

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

      <TextAreaInput
        name="theme_essay"
        placeholder="List tools you are familiar with (Optional)"
        value={formData.theme_essay || ''}
        onChange={handleChange}
        error={errors.theme_essay}
        valid={!errors.theme_essay}
        onBlur={handleBlur}
      >
        Our theme for 2024 is “Connection”. From letting people embody avatars
        that they connect with or even giving people the ability to feel closer
        to friends and family at great distance, Connection can mean different
        things to different people. What does Connection mean to you? (Long
        answer)
      </TextAreaInput>

      <TextAreaInput
        name="theme_essay_follow_up"
        placeholder="Describe any other skills or experiences (Optional)"
        value={formData.theme_essay_follow_up || ''}
        onChange={handleChange}
        error={errors.theme_essay_follow_up}
        valid={!errors.theme_essay_follow_up}
        onBlur={handleBlur}
      >
        How do you think XR technologies can help us with “Connection”? (Long
        answer)
      </TextAreaInput>
    </div>
  );
};

export default ThematicForm;
