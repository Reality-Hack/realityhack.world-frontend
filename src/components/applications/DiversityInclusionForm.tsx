import React from 'react';
import { TextInput, TextAreaInput, CheckboxInput, RadioInput } from '../Inputs';
import {
  form_data,
  gender_identity,
  race_ethnic_group,
  disability_identity,
  disabilities
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

const DiversityInclusionForm: React.FC<FormProps> = ({
  formData,
  handleChange,
  handleBlur,
  errors
}) => {
  const genderIdentityLabels = {
    cisgender_female: 'Cisgender female',
    cisgender_male: 'Cisgender male',
    transgender_female: 'Transgender female',
    transgender_male: 'Transgender male',
    gender_nonconforming_nonbinary_or_gender_queer:
      'Gender non-conforming, non-binary, or gender queer',
    two_spirit: 'Two-spirit',
    other: 'Other',
    prefer_not_to_say: 'I prefer not to say'
  };

  const raceEthnicGroupLabels = {
    asian: 'Asian, Asian American, or of Asian descent',
    black: 'Black, African American, or of African descent',
    hispanic:
      'Hispanic, Latino, Latina, Latinx, or of Latinx or Spanish-speaking descent',
    middle_eastern_north_african:
      'Middle Eastern, North African, or of North African descent',
    native_american:
      'Native American, American Indian, Alaska Native, or Indigenous',
    pacific_islander: 'Pacific Islander or Native Hawaiian',
    white: 'White or of European descent',
    multi_racial_or_multi_ethnic: 'Multi-racial or multi-ethnic',
    other: 'Other',
    prefer_not_to_say: 'I prefer not to say'
  };

  const disabilityIdentityLabels = {
    A: 'Yes',
    B: 'No',
    C: 'I prefer not to say'
  };

  const disabilitiesLabels = {
    hearing_difficulty:
      'Hearing difficulty - Deaf or having serious difficulty hearing',
    vision_difficulty:
      'Vision difficulty - Blind or having serious difficulty seeing, even when wearing glasses',
    cognitive_difficulty:
      'Cognitive difficulty - Because of a physical, mental, or emotional problem, having difficulty remembering, concentrating, or making decisions',
    ambulatory_difficulty:
      'Ambulatory difficulty - Having serious difficulty walking or climbing stairs',
    self_care_difficulty:
      'Self-care difficulty - Having difficulty bathing or dressing',
    independent_living_difficulty:
      'Independent living difficulty - Because of a physical, mental, or emotional problem, having difficulty doing errands alone such as visiting a doctor’s office or shopping',
    prefer_not_to_say: 'I prefer not to say'
  };

  return (
    <div className="px-6">
      <p className="mb-4 text-xl font-bold text-purple-900">
        Diversity and Inclusion
      </p>

      <div className="mb-8">
        <p className="mb-4">
          How would you describe your gender identity? Select all that apply.{' '}
          <span className="font-bold text-themeSecondary">*</span>
        </p>

        {Object.keys(gender_identity).map(key => (
          <CheckboxInput
            key={key}
            name="gender_identity"
            value={genderIdentityLabels[key as keyof typeof genderIdentityLabels]}
            checked={
              formData.gender_identity?.includes(
                genderIdentityLabels[key as keyof typeof genderIdentityLabels] as gender_identity
              ) || false
            }
            onChange={handleChange}
            label={
              genderIdentityLabels[key as keyof typeof genderIdentityLabels]
            }
            error={errors.gender_identity}
          />
        ))}

        {formData.gender_identity?.includes(gender_identity.other) && (
          <TextInput
            name="gender_identity_other"
            placeholder="Please specify"
            type="text"
            value={formData.gender_identity_other || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.gender_identity_other}
            valid={!errors.gender_identity_other}
            other={true}
            required={true}
          />
        )}
      </div>

      <div className="mb-8">
        <p className="mb-4">
          What race or ethnic group do you belong to? Select all that apply.{' '}
          <span className="font-bold text-themeSecondary">*</span>
        </p>
        {Object.keys(race_ethnic_group).map(key => (
          <CheckboxInput
            key={key}
            name="race_ethnic_group"
            value={raceEthnicGroupLabels[key as keyof typeof raceEthnicGroupLabels]}
            checked={
              formData.race_ethnic_group?.includes(
                raceEthnicGroupLabels[key as keyof typeof raceEthnicGroupLabels] as race_ethnic_group
              ) || false
            }
            onChange={handleChange}
            label={
              raceEthnicGroupLabels[key as keyof typeof raceEthnicGroupLabels]
            }
            error={errors.race_ethnic_group}
          />
        ))}
        {formData.race_ethnic_group?.includes(race_ethnic_group.other) && (
          <TextInput
            name="race_ethnic_group_other"
            placeholder="Please specify"
            type="text"
            value={formData.race_ethnic_group_other || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.race_ethnic_group_other}
            valid={!errors.race_ethnic_group_other}
            other={true}
            required={true}
          />
        )}
      </div>

      <div className="mb-8">
        <p className="mb-4">
          Do you identify as a person with disability?{' '}
          <span className="font-bold text-themeSecondary">*</span>
        </p>
        {Object.entries(disabilityIdentityLabels).map(([key, label], index) => (
          <RadioInput
            key={key}
            name="disability_identity"
            value={key}
            checked={formData.disability_identity === key}
            label={label}
            onChange={handleChange}
          />
        ))}
      </div>
      {formData.disability_identity === disability_identity.yes && (
        <>
          <div className="mb-8">
            <p className="mb-4">
              What kind of disability do you experience? Select all that apply.{' '}
              <span className="font-bold text-themeSecondary">*</span>
            </p>
            {Object.entries(disabilitiesLabels).map(([key, label], index) => (
              <CheckboxInput
                key={key}
                name="disabilities"
                value={key}
                checked={
                  formData.disabilities?.includes(key as disabilities) ?? false
                }
                label={label}
                onChange={handleChange}
                error={errors.disabilities}
              />
            ))}
          </div>
          <TextAreaInput
            name="disability_accommodations"
            placeholder="Enter any accommodations required..."
            value={formData.disability_accommodations || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.disability_accommodations}
          >
            If you are accepted, what disability accommodations would enable you
            to attend the event? (Optional)
          </TextAreaInput>
        </>
      )}
    </div>
  );
};

export default DiversityInclusionForm;
