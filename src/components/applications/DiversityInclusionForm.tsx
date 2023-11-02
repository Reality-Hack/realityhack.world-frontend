import React from 'react';
import { TextAreaInput, CheckboxInput, RadioInput } from '../Inputs';
import {
  form_data,
  gender_identities,
  race_ethnic_groups,
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
  // handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, string>;
}

const DiversityInclusionForm: React.FC<FormProps> = ({
  formData,
  handleChange,
  handleBlur,
  errors
}) => {
  const genderIdentityLabels = {
    [gender_identities.cisgender_female]: 'Cisgender female',
    [gender_identities.cisgender_male]: 'Cisgender male',
    [gender_identities.transgender_female]: 'Transgender female',
    [gender_identities.transgender_male]: 'Transgender male',
    [gender_identities.gender_nonconforming_nonbinary_or_gender_queer]:
      'Gender non-conforming, non-binary, or gender queer',
    [gender_identities.two_spirit]: 'Two-spirit',
    [gender_identities.other]: ' Other',
    [gender_identities.prefer_not_to_say]: 'I prefer not to say'
  };

  const raceEthnicGroupLabels = {
    [race_ethnic_groups.asian]: 'Asian, Asian American, or of Asian descent',
    [race_ethnic_groups.black]:
      'Black, African American, or of African descent',
    [race_ethnic_groups.hispanic]:
      'Hispanic, Latino, Latina, Latinx, or of Latinx or Spanish-speaking descent',
    [race_ethnic_groups.middle_eastern_north_african]:
      'Middle Eastern, North African, or of North African descent',
    [race_ethnic_groups.native_american]:
      'Native American, American Indian, Alaska Native, or Indigenous',
    [race_ethnic_groups.pacific_islander]:
      'Pacific Islander or Native Hawaiian',
    [race_ethnic_groups.white]: 'White or of European descent',
    [race_ethnic_groups.multi_racial_or_multi_ethnic]:
      'Multi-racial or multi-ethnic',
    [race_ethnic_groups.other]: 'Other',
    [race_ethnic_groups.prefer_not_to_say]: 'I prefer not to say'
  };

  const disabilityIdentityLabels = {
    [disability_identity.yes]: 'Yes',
    [disability_identity.no]: 'No',
    [disability_identity.prefer_not_to_say]: 'I prefer not to say'
  };

  const disabilitiesLabels = {
    [disabilities.hearing_difficulty]:
      'Hearing difficulty - Deaf or having serious difficulty hearing (DEAR)',
    [disabilities.vision_difficulty]:
      'Vision difficulty - Blind or having serious difficulty seeing, even when wearing glasses (DEYE)',
    [disabilities.cognitive_difficulty]:
      'Cognitive difficulty - Because of a physical, mental, or emotional problem, having difficulty remembering, concentrating, or making decisions (DREM)',
    [disabilities.ambulatory_difficulty]:
      'Ambulatory difficulty - Having serious difficulty walking or climbing stairs (DPHY)',
    [disabilities.self_care_difficulty]:
      'Self-care difficulty - Having difficulty bathing or dressing (DDRS)',
    [disabilities.independent_living_difficulty]:
      'Independent living difficulty - Because of a physical, mental, or emotional problem, having difficulty doing errands alone such as visiting a doctor’s office or shopping (DOUT)',
    [disabilities.prefer_not_to_say]: 'I prefer not to say'
  };

  return (
    <div className="px-6">
      <p className="mb-4 text-xl font-bold text-purple-900">
        Diversity and Inclusion
      </p>

      <div className="mb-8">
        <p className="mb-4">
          How would you describe your gender identity? Select all that apply.
        </p>
        {Object.entries(genderIdentityLabels).map(([key, label], index) => (
          <CheckboxInput
            key={key}
            name="gender_identity"
            value={key}
            checked={
              formData.gender_identity?.includes(key as gender_identities) ??
              false
            }
            label={`${index + 1}. ${label}`}
            onChange={handleChange}
            error={errors.gender_identity}
          />
        ))}
      </div>

      <div className="mb-8">
        <p className="mb-4">
          What race or ethnic group do you belong to? Select all that apply.
        </p>
        {Object.entries(raceEthnicGroupLabels).map(([key, label], index) => (
          <CheckboxInput
            key={key}
            name="race_ethnic_group"
            value={key}
            checked={
              formData.race_ethnic_group?.includes(key as race_ethnic_groups) ??
              false
            }
            label={`${index + 1}. ${label}`}
            onChange={handleChange}
            error={errors.race_ethnic_group}
          />
        ))}
      </div>

      <div className="mb-8">
        <p className="mb-4">Do you identify as a person with disability?</p>
        {Object.entries(disabilityIdentityLabels).map(([key, label], index) => (
          <RadioInput
            key={key}
            name="disability_identity"
            value={key}
            checked={formData.disability_identity === key}
            label={`${index + 1}. ${label}`}
            onChange={handleChange}
          />
        ))}
      </div>
      {formData.disability_identity === disability_identity.yes && (
        <div className="mb-8">
          <p className="mb-4">
            What kind of disability do you experience? Select all that apply.
          </p>
          {Object.entries(disabilitiesLabels).map(([key, label], index) => (
            <CheckboxInput
              key={key}
              name="disabilities"
              value={key}
              checked={
                formData.disabilities?.includes(key as disabilities) ?? false
              }
              label={`${index + 1}. ${label}`}
              onChange={handleChange}
              error={errors.disabilities}
            />
          ))}
        </div>
      )}

      <TextAreaInput
        name="disability_accommodations"
        placeholder="Enter any accommodations required..."
        value={formData.disability_accommodations || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.disability_accommodations}
      >
        5. If you are accepted, what disability accommodations would enable you
        to attend the event? (Optional)
      </TextAreaInput>
    </div>
  );
};

export default DiversityInclusionForm;
