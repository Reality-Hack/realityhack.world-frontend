import React from 'react';
import { TextAreaInput, RadioInput } from '../Inputs';
import {
  form_data,
  hardware_hack_interest
} from '@/types/application_form_types';

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

export const hardwareHackLabels = {
  not_interested: 'Not at all interested, I’ll pass',
  mild_interest: 'Some mild interest',
  likely: 'Most likely',
  certain: '100% I want to join'
};

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
        placeholder="Enter your response here."
        value={formData.theme_essay || ''}
        onChange={handleChange}
        error={errors.theme_essay}
        valid={!errors.theme_essay}
        onBlur={handleBlur}
      >
        Our theme for 2024 is “Connection”. From letting people embody avatars
        that they connect with or even giving people the ability to feel closer
        to friends and family at great distance, Connection can mean different
        things to different people. What does Connection mean to you?{' '}
        <span className="font-bold text-themeSecondary">*</span>
      </TextAreaInput>

      <TextAreaInput
        name="theme_essay_follow_up"
        placeholder="Enter your response here."
        value={formData.theme_essay_follow_up || ''}
        onChange={handleChange}
        error={errors.theme_essay_follow_up}
        valid={!errors.theme_essay_follow_up}
        onBlur={handleBlur}
      >
        How do you think XR technologies can help us with “Connection”?{' '}
        <span className="font-bold text-themeSecondary">*</span>
      </TextAreaInput>
      <p className="mb-4">
        How interested would you be in participating in The Hardware Hack this
        year? The Hardware Hack is a special hand-on track where participants
        use hardware kits to design XR devices that interface with our bodies
        and with our surroundings. (optional)
      </p>
      <div className="pb-6">
        {Object.keys(hardware_hack_interest).map(key => (
          <RadioInput
            key={key}
            name="hardware_hack_interest"
            value={
              hardware_hack_interest[key as keyof typeof hardware_hack_interest]
            }
            checked={
              formData.hardware_hack_interest?.includes(
                hardware_hack_interest[
                  key as keyof typeof hardware_hack_interest
                ]
              ) || false
            }
            onChange={handleChange}
            label={hardwareHackLabels[key as keyof typeof hardwareHackLabels]}
            // error={errors.specialized_expertise}
          />
        ))}
      </div>
    </div>
  );
};

export default ThematicForm;
