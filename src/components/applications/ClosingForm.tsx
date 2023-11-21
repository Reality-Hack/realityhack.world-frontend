import React from 'react';
import { form_data, heard_about_us } from '../../types/application_form_types';
import { CheckboxInput, TextAreaInput, TextInput } from '../Inputs'; // Ensure TextInput is imported

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

export const heardAboutUsLabels = {
  friend: 'A friend',
  volunteer: 'A Reality Hack organizer or volunteer',
  network: 'A teacher or someone in my professional network',
  social: 'Social Media',
  campus: 'Campus poster or ad',
  participated: 'I participated in the MIT XR Hackathon before',
  other: 'Other'
};

const ClosingForm: React.FC<FormProps> = ({
  formData,
  handleChange,
  handleBlur,
  errors
}) => {
  return (
    <div className="px-6">
      <p className="mb-4">
        How did you hear about Reality Hack? Select all that apply. (Optional)
      </p>
      {Object.keys(heard_about_us).map(key => (
        <CheckboxInput
          key={key}
          name="heard_about_us"
          value={heardAboutUsLabels[key as keyof typeof heardAboutUsLabels]}
          checked={
            (Array.isArray(formData.heard_about_us) &&
              formData.heard_about_us.includes(
                heardAboutUsLabels[key as keyof typeof heardAboutUsLabels] as heard_about_us
              )) ||
            false
          }
          onChange={handleChange}
          label={heardAboutUsLabels[key as keyof typeof heardAboutUsLabels]}
        />
      ))}

      {Array.isArray(formData.heard_about_us) &&
        formData.heard_about_us.includes(heard_about_us.other) && (
          <TextInput
            name="heard_about_us_other"
            placeholder="Please specify"
            type="text"
            value={formData.heard_about_us_other || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.heard_about_us_other}
            valid={!errors.heard_about_us_other}
            other={true}
          />
        )}
      <div className="pt-4">
        <TextAreaInput
          name="outreach_groups"
          placeholder=""
          value={formData.outreach_groups || ''}
          onChange={handleChange}
          error={errors.outreach_groups}
          valid={!errors.outreach_groups}
          onBlur={handleBlur}
        >
          Help us reach more communities that matter! What are your favorite
          online groups (LinkedIn, Discord, etc.) related to XR, creative
          technology, or social justice and accessibility? All languages
          welcome!
        </TextAreaInput>
      </div>
    </div>
  );
};

export default ClosingForm;
