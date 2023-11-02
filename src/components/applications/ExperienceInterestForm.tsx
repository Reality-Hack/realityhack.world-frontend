import React from 'react';
import { TextInput, TextAreaInput, RadioInput, CheckboxInput } from '../Inputs';
import {
  form_data,
  participation_capacity,
  previous_participation,
  participation_role,
  design_experience,
  specialty_experience
} from '../../application_form_types';

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

const ExperienceInterestForm: React.FC<FormProps> = ({
  formData,
  handleChange,
  handleBlur,
  errors
}) => {
  const specialtyExperienceLabels = {
    expertise_domain: 'Expertise in a professional or academic domain',
    project_management: 'Expertise in project management or rapid prototyping',
    creative_guidance: 'Creative guidance and motivation',
    storytelling: 'Storytelling',
    other: 'Other'
  };

  return (
    <div className="px-6">
      <p className="mb-4 text-xl font-bold text-purple-900">
        Experience and Interest
      </p>
      <p className="pb-4">
        Select the option that best describes you. This option should best
        describe you now and not necessarily in relation to the XR industries.
        (Select one)
      </p>
      <RadioInput
        name="participation_capacity"
        value={participation_capacity.student}
        checked={
          formData.participation_capacity === participation_capacity.student
        }
        onChange={handleChange}
        label="Student"
      />
      <RadioInput
        name="participation_capacity"
        value={participation_capacity.professional}
        checked={
          formData.participation_capacity ===
          participation_capacity.professional
        }
        onChange={handleChange}
        label="Professional"
      />
      <RadioInput
        name="participation_capacity"
        value={participation_capacity.hobbyist}
        checked={
          formData.participation_capacity === participation_capacity.hobbyist
        }
        onChange={handleChange}
        label="Hobbyist"
      />
      {formData.participation_capacity === participation_capacity.student && (
        <>
          <hr className="my-4" />
          <TextInput
            name="student_school"
            placeholder="Enter school name"
            type="text"
            value={formData.student_school || ''}
            onChange={handleChange}
            error={errors.student_school}
            valid={!errors.student_school}
            onBlur={handleBlur}
          >
            What is the name of your school?
          </TextInput>
          <TextInput
            name="student_field_of_study"
            placeholder="Enter field of study"
            type="text"
            value={formData.student_field_of_study || ''}
            onChange={handleChange}
            error={errors.student_field_of_study}
            valid={!errors.student_field_of_study}
            onBlur={handleBlur}
          >
            If you are attending a higher education institution, what is your
            field of study?
          </TextInput>
          <hr className="mb-4" />
        </>
      )}
      {(formData.participation_capacity ===
        participation_capacity.professional ||
        formData.participation_capacity ===
          participation_capacity.hobbyist) && (
        <>
          <hr className="my-4" />
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
            What is your current occupation?
          </TextInput>
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
            What company do you currently work for?
          </TextInput>
          <hr className="my-4" />
        </>
      )}

      <p className="py-4">
        Have you ever participated in the MIT XR Hackathon before?
      </p>

      <RadioInput
        name="previously_participated"
        value="true"
        checked={formData.previously_participated === true}
        onChange={handleChange}
        label="Yes"
      />
      <RadioInput
        name="previously_participated"
        value="false"
        checked={formData.previously_participated === false}
        onChange={handleChange}
        label="No"
      />

      {formData.previously_participated && (
        <p className="py-4">
          What years did you previously attend? Select all that apply.
        </p>
      )}
      {formData.previously_participated && (
        <>
          <hr className="mb-4" />
          {Object.keys(previous_participation).map(key => (
            <CheckboxInput
              key={key}
              name="previous_participation"
              value={
                previous_participation[
                  key as keyof typeof previous_participation
                ]
              }
              checked={
                formData.previous_participation?.includes(
                  previous_participation[
                    key as keyof typeof previous_participation
                  ]
                ) || false
              }
              onChange={handleChange}
              label={key.replace('_', '')}
              error={errors.previous_participation}
            />
          ))}
          <hr className="my-4" />
        </>
      )}

      <p className="py-4">
        What primary role do you see yourself fulfilling for your team?
      </p>
      <div className="mb-4">
        {Object.keys(participation_role).map(key => (
          <RadioInput
            key={key}
            name="participation_role"
            value={participation_role[key as keyof typeof participation_role]}
            checked={
              formData.participation_role ===
              participation_role[key as keyof typeof participation_role]
            }
            onChange={handleChange}
            label={key.charAt(0).toUpperCase() + key.slice(1)}
          />
        ))}
      </div>
      {formData.participation_role === participation_role.designer && (
        <div className="py-4">
          <hr className="mb-4" />
          <p className="mb-4">
            What design skills are you proficient in? Select all that apply:
          </p>

          {Object.keys(design_experience).map(key => (
            <CheckboxInput
              key={key}
              name="design_experience"
              value={design_experience[key as keyof typeof design_experience]}
              checked={
                formData.design_experience?.includes(
                  design_experience[key as keyof typeof design_experience]
                ) || false
              }
              onChange={handleChange}
              label={
                key === 'ux_ui'
                  ? 'UX and UI'
                  : key.charAt(0).toUpperCase() +
                    key.slice(1).replace(/_/g, ' ')
              }
              error={errors.previous_participation}
            />
          ))}
          <hr />
        </div>
      )}
      {formData.participation_role === participation_role.developer && (
        <div className="py-4">
          <hr className="mb-4" />
          <TextAreaInput
            name="proficient_languages"
            placeholder="List platforms and programming languages"
            value={formData.proficient_languages || ''}
            onChange={handleChange}
            error={errors.proficient_languages}
            valid={!errors.proficient_languages}
            onBlur={handleBlur}
          >
            What platforms and programming languages are you already proficient
            with?
          </TextAreaInput>
          <hr />
        </div>
      )}
      {formData.participation_role === participation_role.specialist && (
        <div className="py-4">
          <hr className="mb-4" />
          <p className="mb-4">
            What specialty skills are you proficient in? Select all that apply:
          </p>
          {Object.keys(specialty_experience).map(key => (
            <CheckboxInput
              key={key}
              name="specialty_experience"
              value={
                specialty_experience[key as keyof typeof specialty_experience]
              }
              checked={
                formData.specialty_experience?.includes(
                  specialty_experience[key as keyof typeof specialty_experience]
                ) || false
              }
              onChange={handleChange}
              label={
                specialtyExperienceLabels[
                  key as keyof typeof specialtyExperienceLabels
                ]
              }
              error={errors.specialty_experience}
            />
          ))}
          <hr />
        </div>
      )}
      <TextAreaInput
        name="xr_familiarity_tools"
        placeholder="List tools you are familiar with (Optional)"
        value={formData.xr_familiarity_tools || ''}
        onChange={handleChange}
        error={errors.xr_familiarity_tools}
        valid={!errors.xr_familiarity_tools}
        onBlur={handleBlur}
      >
        Can you demonstrate familiarity with any tools related to design or
        development for XR? If so, please list.
      </TextAreaInput>
      <TextAreaInput
        name="additional_skills"
        placeholder="Describe any other skills or experiences (Optional)"
        value={formData.additional_skills || ''}
        onChange={handleChange}
        error={errors.additional_skills}
        valid={!errors.additional_skills}
        onBlur={handleBlur}
      >
        Do you have any other skills or experiences that you&apos;d like to tell
        us about?
      </TextAreaInput>
    </div>
  );
};

export default ExperienceInterestForm;
