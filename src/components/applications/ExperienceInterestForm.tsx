import React from 'react';
import {
  digital_designer_skills,
  form_data,
  option_value,
  participation_capacity,
  participation_role,
  previous_participation
} from '../../types/application_form_types';
import {
  CheckboxInput,
  RadioInput,
  SelectInput,
  TextAreaInput,
  TextInput
} from '../Inputs';

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

export const previousParticipationLabels = {
  _2016: '2016',
  _2017: '2017',
  _2018: '2018',
  _2019: '2019',
  _2020: '2020',
  _2021: '2021',
  _2022: '2022',
  _2023: '2023'
};

export const DesignSkillsLabels = {
  digital_art: 'Digital Art',
  animation: 'Animation',
  sound: 'Sound',
  ux_ui: 'UX and UI',
  video: 'Video',
  other: 'Other'
};

const ExperienceInterestForm: React.FC<FormProps> = ({
  formData,
  setFormData,
  handleChange,
  handleBlur,
  errors,
  industries
}) => {

  const previousParticipationLabels = {
    _2016: '2016',
    _2017: '2017',
    _2018: '2018',
    _2019: '2019',
    _2020: '2020',
    _2022: '2022',
    _2023: '2023'
  }
  const participationCapacityLabels = {
    student : 'Student',
    professional : 'Professional',
    hobbyist : 'Hobbyist'
  }

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
        Experience and Interest
      </p>
      <p className="pb-4">
        Select the option that best describes you. This option should best
        describe you now and not necessarily in relation to the XR industries.
        <span className="font-bold text-themeSecondary">*</span>
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
            What is the name of your school?{' '}
            <span className="font-bold text-themeSecondary">*</span>
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
            field of study?{' '}
            <span className="font-bold text-themeSecondary">*</span>
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
            What is your current occupation?{' '}
            <span className="font-bold text-themeSecondary">*</span>
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
            What company do you currently work for?{' '}
            <span className="font-bold text-themeSecondary">*</span>
          </TextInput>
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
          <hr className="my-4" />
        </>
      )}

      <p className="py-4">
        Have you ever participated in the MIT XR Hackathon before?{' '}
        <span className="font-bold text-themeSecondary">*</span>
      </p>

      <RadioInput
        name="previously_participated"
        value="true"
        checked={formData.previously_participated === 'true'}
        onChange={handleChange}
        label="Yes"
      />
      <RadioInput
        name="previously_participated"
        value="false"
        checked={formData.previously_participated === 'false'}
        onChange={handleChange}
        label="No"
      />

      {formData.previously_participated === 'true' && (
        <>
          <br />
          <hr className="mb-4" />
          <p className="py-4">
            What years did you previously attend? Select all that apply.
          </p>
          {Object.keys(previous_participation).map(key => (
            <CheckboxInput
              key={key}
              name="previous_participation"
              value={
                previousParticipationLabels[
                  key as keyof typeof previousParticipationLabels
                ] as previous_participation
              }
              checked={
                formData.previous_participation?.includes(
                  previousParticipationLabels[
                    key as keyof typeof previousParticipationLabels
                  ] as previous_participation
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
        What primary role do you see yourself fulfilling for your team?{' '}
        <span className="font-bold text-themeSecondary">*</span>
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
            label={key
              .split('_')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}
          />
        ))}
        <p className="ml-4 text-xs italic max-w-[520px]">
          Recommended for management students and others experienced in
          business, marketing, and project management. Project managers help
          their team by doing market research, refining concepts, guiding the
          project pitch, and preparing presentation materials.
        </p>
      </div>
      {formData.participation_role === participation_role.designer && (
        <div className="py-4">
          <hr className="mb-4" />
          <p className="mb-4">
            What design skills are you proficient in? Select all that apply:{' '}
            <span className="font-bold text-themeSecondary">*</span>
          </p>

          {Object.keys(digital_designer_skills).map(key => (
            <CheckboxInput
              key={key}
              name="digital_designer_skills"
              value={
                digital_designer_skills[
                  key as keyof typeof digital_designer_skills
                ]
              }
              checked={
                formData.digital_designer_skills?.includes(
                  digital_designer_skills[
                    key as keyof typeof digital_designer_skills
                  ]
                ) || false
              }
              onChange={handleChange}
              label={
                key === 'ux_ui'
                  ? 'UX and UI'
                  : key.charAt(0).toUpperCase() +
                    key.slice(1).replace(/_/g, ' ')
              }
              error={errors.digital_designer_skills}
            />
          ))}

          {formData.digital_designer_skills?.includes(
            digital_designer_skills.other
          ) && (
            <TextInput
              name="digital_designer_skills_other"
              placeholder="Please specify"
              type="text"
              value={formData.digital_designer_skills_other || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.digital_designer_skills_other}
              valid={!errors.digital_designer_skills_other}
              other={true}
              required={true}
            />
          )}
          <hr />
        </div>
      )}
      {formData.participation_role === participation_role.specialist && (
        <div className="py-4">
          <hr className="mb-4" />
          <TextAreaInput
            name="specialized_expertise"
            placeholder="List your domain areas or skills of expertise."
            value={formData.specialized_expertise || ''}
            onChange={handleChange}
            error={errors.specialized_expertise}
            valid={!errors.specialized_expertise}
            onBlur={handleBlur}
          >
            What are your areas or skills of expertise?{' '}
            <span className="font-bold text-themeSecondary">*</span>
          </TextAreaInput>
          <br />
        </div>
      )}
      <TextAreaInput
        name="experience_with_xr"
        placeholder="List tools you are familiar with (Optional)"
        value={formData.experience_with_xr || ''}
        onChange={handleChange}
        error={errors.experience_with_xr}
        valid={!errors.experience_with_xr}
        onBlur={handleBlur}
      >
        Can you demonstrate familiarity with any tools related to design,
        development, or programming languages for XR? If so, please list.
      </TextAreaInput>
    </div>
  );
};

export default ExperienceInterestForm;
