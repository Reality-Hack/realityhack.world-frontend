import React from 'react';
import { TextInput, RadioInput, SelectInput } from '../Inputs';
import {
  form_data,
  age_group,
  option_value
} from '@/types/application_form_types';
import Dropzone, { AcceptedFileTypes } from '../Dropzone';

interface FormProps {
  formData: Partial<form_data>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<form_data>>>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleBlur: (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  errors: Record<string, string>;
  acceptedFiles: File[];
  setAcceptedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  rejectedFiles: File[];
  setRejectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  countries: option_value[];
  nationalities: option_value[];
  acceptedFileTypes: AcceptedFileTypes;
}

export const ageGroupLabels = {
  seventeen_or_younger: '17 or younger',
  eighteen_to_twenty: '18-20',
  twenty_one_to_twenty_nine: '21-29',
  thirty_to_thirty_nine: '30-39',
  forty_to_forty_nine: '40-49',
  fifty_to_fifty_nine: '50-59',
  sixty_or_older: '60 or older',
  prefer_not_to_say: 'I prefer not to say'
};

const PersonalInformationForm: React.FC<FormProps> = ({
  formData,
  setFormData,
  handleChange,
  handleBlur,
  errors,
  acceptedFiles,
  setAcceptedFiles,
  rejectedFiles,
  setRejectedFiles,
  countries,
  nationalities,
  acceptedFileTypes
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
        First Name<span className="font-bold text-themeSecondary">*</span>
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
      <p>
        Upload your resume{' '}
        <span className="font-bold text-themeSecondary">*</span>
      </p>

      <Dropzone
        setFormData={setFormData}
        acceptedFiles={acceptedFiles}
        setAcceptedFiles={setAcceptedFiles}
        rejectedFiles={rejectedFiles}
        setRejectedFiles={setRejectedFiles}
        acceptedFileTypes={acceptedFileTypes}
      />
      <SelectInput
        name="nationality"
        placeholder="Select your nationality"
        options={nationalities}
        value={formData.nationality_option || ''}
        onChange={handleSelectChange}
        onBlur={handleBlur}
        error={errors.nationality}
        required={true}
        valid={!errors.nationality}
      >
        What is your nationality?{' '}
        <span className="font-bold text-themeSecondary">*</span>
      </SelectInput>
      <SelectInput
        name="current_country"
        placeholder="Select your country"
        options={countries}
        value={formData.current_country_option || ''}
        onChange={handleSelectChange}
        onBlur={handleBlur}
        error={errors.current_country}
        required={true}
        valid={!errors.current_country}
      >
        What country do you currently reside in?{' '}
        <span className="font-bold text-themeSecondary">*</span>
      </SelectInput>
      <TextInput
        name="current_city"
        placeholder="e.g. Cambridge, MA."
        type="text"
        value={formData.current_city || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.current_city}
        valid={!errors.current_city}
      >
        What city are you based in?{' '}
        <span className="font-bold text-themeSecondary">*</span>
      </TextInput>
      <label className="mb-2">
        As of January 25, 2024, I will fall under this age group:{' '}
      </label>
      <span className="font-bold text-themeSecondary">*</span>
      <div className="mb-8">
        <RadioInput
          name="age_group"
          value={age_group.seventeen_or_younger}
          onChange={handleChange}
          label="17 or younger"
          checked={formData.age_group === age_group.seventeen_or_younger}
        />
        <RadioInput
          name="age_group"
          value={age_group.eighteen_to_twenty}
          onChange={handleChange}
          label="18-20"
          checked={formData.age_group === age_group.eighteen_to_twenty}
        />
        <RadioInput
          name="age_group"
          value={age_group.twenty_one_to_twenty_nine}
          onChange={handleChange}
          label="21-29"
          checked={formData.age_group === age_group.twenty_one_to_twenty_nine}
        />
        <RadioInput
          name="age_group"
          value={age_group.thirty_to_thirty_nine}
          onChange={handleChange}
          label="30-39"
          checked={formData.age_group === age_group.thirty_to_thirty_nine}
        />
        <RadioInput
          name="age_group"
          value={age_group.forty_to_forty_nine}
          onChange={handleChange}
          label="40-49"
          checked={formData.age_group === age_group.forty_to_forty_nine}
        />
        <RadioInput
          name="age_group"
          value={age_group.fifty_to_fifty_nine}
          onChange={handleChange}
          label="50-59"
          checked={formData.age_group === age_group.fifty_to_fifty_nine}
        />
        <RadioInput
          name="age_group"
          value={age_group.sixty_or_older}
          onChange={handleChange}
          label="60 or older"
          checked={formData.age_group === age_group.sixty_or_older}
        />
        <RadioInput
          name="age_group"
          value={age_group.prefer_not_to_say}
          onChange={handleChange}
          label="I prefer not to say"
          checked={formData.age_group === age_group.prefer_not_to_say}
        />
      </div>
    </div>
  );
};

export default PersonalInformationForm;
