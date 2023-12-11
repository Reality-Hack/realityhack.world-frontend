import React from 'react';
import { TextInput } from '../Inputs';
import { form_data } from '../../types/application_form_types';

interface FormProps {
  formData: Partial<form_data>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleBlur: (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  errors: Record<string, string>;
}

const AdditionalPersonalInformationForm: React.FC<FormProps> = ({
  formData,
  handleChange,
  handleBlur,
  errors
}) => {
  return (
    <div className="px-6 mb-8">
      <p className="mb-4 text-xl font-bold text-purple-900">
        Basic Info and Demographics
      </p>
      <TextInput
        name="first_name"
        placeholder="e.g. Alex"
        type="text"
        value={formData.first_name || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.first_name}
        valid={!errors.first_name}
      >
        First Name or Preferred Name
        <span className="font-bold text-themeSecondary">*</span>
      </TextInput>
      <TextInput
        name="middle_name"
        placeholder="e.g. John"
        type="text"
        value={formData.middle_name || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.middle_name}
        valid={!errors.middle_name}
      >
        Middle name or initial (optional)
      </TextInput>
      <TextInput
        name="last_name"
        placeholder="e.g. Smith"
        type="text"
        value={formData.last_name || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.last_name}
        valid={!errors.last_name}
      >
        Last Name <span className="font-bold text-themeSecondary">*</span>
      </TextInput>
      <TextInput
        name="pronouns"
        placeholder="e.g. she/her/hers"
        type="text"
        value={formData.pronouns || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.pronouns}
        valid={!errors.pronouns}
      >
        Preferred pronouns{' '}
        <span className="font-bold text-themeSecondary">*</span>
      </TextInput>
      <TextInput
        name="email"
        placeholder="e.g. alex@example.com"
        type="email"
        value={formData.email || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.email}
        valid={!errors.email}
      >
        Email <span className="font-bold text-themeSecondary">*</span>
      </TextInput>
      <TextInput
        name="communications_platform_username"
        placeholder="e.g. https://example.com/alex"
        type="url"
        value={formData.communications_platform_username || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.communications_platform_username}
        valid={!errors.communications_platform_username}
      >
        Link to your preferred social media account{' '}
        <span className="font-bold text-themeSecondary">*</span>
      </TextInput>
      <TextInput
        name="portfolio"
        placeholder="e.g. https://example.com/alex"
        type="url"
        value={formData.portfolio || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.portfolio}
        valid={!errors.portfolio}
      >
        Link to your portfolio or an example of your past work{' '}
        <span className="font-bold text-themeSecondary">*</span>
      </TextInput>
    </div>
  );
};

export default AdditionalPersonalInformationForm;
