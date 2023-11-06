import React from 'react';
import { CheckboxInput } from '../Inputs';
import { form_data, heard_about_us } from '../../application_form_types';

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

const ClosingForm: React.FC<FormProps> = ({ formData, handleChange }) => {
  const heardAboutUsLabels = {
    friend: 'A friend',
    volunteer: 'A Reality Hack organizer or volunteer',
    network: 'A teacher or someone in my professional network',
    social: 'Social Media',
    campus: 'Campus poster or ad',
    participated: 'I participated in the MIT XR Hackathon before',
    other: 'Other'
  };

  return (
    <div className="px-6">
      <p className="mb-4">
        How did you hear about Reality Hack? Select all that apply. (Optional)
      </p>
      {Object.keys(heard_about_us).map(key => (
        <CheckboxInput
          key={key}
          name="heard_about_us"
          value={heard_about_us[key as keyof typeof heard_about_us]}
          checked={
            (Array.isArray(formData.heard_about_us) &&
              formData.heard_about_us.includes(
                heard_about_us[key as keyof typeof heard_about_us]
              )) ||
            false
          }
          onChange={handleChange}
          label={heardAboutUsLabels[key as keyof typeof heard_about_us]}
        />
      ))}
    </div>
  );
};

export default ClosingForm;
