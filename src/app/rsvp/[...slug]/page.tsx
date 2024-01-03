'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  TextInput,
  CheckboxInput,
  RadioInput,
  validateField,
  SelectInput
} from '@/components/Inputs';
import {
  rsvp_data,
  shirt_size,
  dietary_restrictions,
  dietary_allergies
} from '@/types/application_form_types';
import { createRsvpForm, rsvpOptions } from '@/app/api/rsvp';
import { CircularProgress } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Alert from '@mui/material/Alert';

export default function RsvpForm({ params }: { params: { slug: string } }) {
  const [parentialConsentForms, setParentalConsent] = useState<string>();
  const [under18Disclaimer, setUnder18Disclaimer] = useState<string>();
  const [underEighteen, setUnderEighteen] = useState<string>();
  const [visaRequired, setVisaRequired] = useState<string>();
  const [letterOfSupport, setLetterOfSupport] = useState<string>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [citizenship, setCitizenship] = useState<any>(null);
  const [completed, setCompleted] = useState<boolean>(false);
  const [discordValidationLoading, setDiscordValidationLoading] =
    useState<boolean>(false);
  const [discordValidationResult, setDiscordValidationResult] = useState<
    string | null
  >(null);
  const [renderDiscordError, setRenderDiscordError] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const { slug } = params;
  const roles = ['mentor', 'judge', 'sponsor'];
  const isParticipant = !roles.includes(slug[0]);
  const applicationId = isParticipant ? slug[0] : slug[1];

  useEffect(() => {
    const getData = async () => {
      const options = await rsvpOptions(formData);
      setCitizenship(options.actions.POST.us_visa_support_citizenship.choices);
    };
    getData();
  }, []);

  const [formData, setFormData] = useState<Partial<rsvp_data>>({
    application: applicationId,
    dietary_restrictions: [],
    dietary_allergies: [],
    shirt_size: null,
    communications_platform_username: null,
    dietary_restrictions_other: null,
    allergies_other: null,
    additional_accommodations: null,
    us_visa_support_is_required: null,
    us_visa_support_full_name: null,
    us_visa_letter_of_invitation_required: null,
    us_visa_support_national_identification_document_type: 'P',
    us_visa_support_document_number: null,
    us_visa_support_citizenship: null,
    us_visa_support_address: null,
    agree_to_media_release: null,
    under_18_by_date: null,
    parential_consent_form_signed: null,
    agree_to_rules_code_of_conduct: false,
    personal_phone_number: '',
    emergency_contact_name: '',
    emergency_contact_phone_number: '',
    emergency_contact_email: '',
    emergency_contact_relationship: '',
    special_track_snapdragon_spaces_interest: null,
    special_track_future_constructors_interest: null,
    app_in_store: null,
    currently_build_for_xr: null,
    currently_use_xr: null,
    non_xr_talents: null,
    ar_vr_app_in_store: null,
    reality_hack_project_to_product: false,
    identify_as_native_american: false,
    participation_class: null,
    sponsor_company: null,
    us_visa_support_citizenship_option: null
  });

  const [requiredFields, setRequiredFields] = useState<Record<string, any>>([
    'shirt_size',
    'agree_to_rules_code_of_conduct',
    'agree_to_media_release',
    'us_visa_support_is_required'
  ]);

  useEffect(() => {
    if (!showAlert) {
      const timer = setTimeout(() => {
        setSubmissionError(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  useEffect(() => {
    setRequiredFields((prevFields: any) => {
      let updatedFields = [...prevFields];

      if (isParticipant) {
        [
          'under_18_by_date',
          'special_track_snapdragon_spaces_interest',
          'special_track_future_constructors_interest'
        ].forEach(field => {
          if (!updatedFields.includes(field)) {
            updatedFields.push(field);
          }
        });
      }

      if (slug[0] !== 'judge') {
        const field = 'communications_platform_username';
        if (!updatedFields.includes(field)) {
          updatedFields.push(field);
        }
      }

      if (slug[0] !== 'sponsor') {
        [
          'emergency_contact_name',
          'emergency_contact_phone_number',
          'emergency_contact_email',
          'emergency_contact_relationship',
          'personal_phone_number'
        ].forEach(field => {
          if (!updatedFields.includes(field)) {
            updatedFields.push(field);
          }
        });
      }

      if (slug[0] === 'sponsor') {
        const field = 'sponsor_company';
        if (!updatedFields.includes(field)) {
          updatedFields.push(field);
        }
      }

      return updatedFields;
    });
  }, [isParticipant, slug]);

  useEffect(() => {
    const visaRelatedFields = [
      'us_visa_support_full_name',
      'us_visa_letter_of_invitation_required',
      'us_visa_support_document_number',
      'us_visa_support_citizenship',
      'us_visa_support_address'
    ];

    setRequiredFields((prevFields: any) => {
      let updatedFields = [...prevFields];

      if (formData.us_visa_support_is_required) {
        visaRelatedFields.forEach(field => {
          if (!updatedFields.includes(field)) {
            updatedFields.push(field);
          }
        });
      } else {
        updatedFields = updatedFields.filter(
          field => !visaRelatedFields.includes(field)
        );
      }

      if (formData.under_18_by_date) {
        if (!updatedFields.includes('parential_consent_form_signed')) {
          updatedFields.push('parential_consent_form_signed');
        }
      } else {
        updatedFields = updatedFields.filter(
          field => field !== 'parential_consent_form_signed'
        );
      }

      return updatedFields;
    });
  }, [formData.us_visa_support_is_required, formData.under_18_by_date]);

  const getFormErrors = () => {
    const requiredFieldErrors = Object.keys(errors).filter(
      field => errors[field]
    );
    const hasSubmissionError = submissionError != null;

    if (requiredFieldErrors.length === 0 && !hasSubmissionError) {
      return null;
    }

    const formatSubmissionError = (error: string) => {
      const formattedError = error.replace(/Result:/, 'Result:\n');
      return formattedError
        .split('\n')
        .map((line: string, index: number) => <div key={index}>{line}</div>);
    };

    return (
      <div>
        {hasSubmissionError && (
          <div>
            <div className="font-bold">Submission error:</div>
            <div>{formatSubmissionError(submissionError)}</div>
          </div>
        )}
        {requiredFieldErrors.length > 0 && (
          <div className="font-bold">
            The following fields are missing or invalid:
          </div>
        )}
        <ul>
          {requiredFieldErrors.map(field => (
            <li key={field}>{field}</li>
          ))}
        </ul>
      </div>
    );
  };

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;

      setFormData(prev => {
        if (type === 'checkbox') {
          const currentValue = prev[name as keyof typeof prev];
          if (Array.isArray(currentValue)) {
            const arrayValue = currentValue as Array<any>;
            if (checked) {
              return {
                ...prev,
                [name]: [...arrayValue, value]
              };
            } else {
              return {
                ...prev,
                [name]: arrayValue.filter(item => item !== value)
              };
            }
          } else {
            return {
              ...prev,
              [name]: checked
            };
          }
        } else if (
          // RADIO
          type === 'radio' &&
          (value === 'true' || value === 'false')
        ) {
          return {
            ...prev,
            [name]: value
          };
        } else {
          // TEXT
          return {
            ...prev,
            [name]: value
          };
        }
      });

      if (errors[name]) {
        setErrors(prevErrors => ({
          ...prevErrors,
          [name]: ''
        }));
      }
    },
    [setFormData, errors]
  );

  const handleBlur = useCallback(
    (
      e: React.FocusEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      let fieldType = e.target.type.toLowerCase();

      const fieldName = e.target.name;
      const fieldTab = Object.entries(requiredFields).find(([_, fields]) =>
        fields.includes(fieldName)
      )?.[0];

      let isFieldRequired = false;

      if (fieldName === 'communications_platform_username') {
        setRenderDiscordError(false);
      }

      if (fieldTab !== undefined) {
        isFieldRequired = requiredFields[fieldTab].includes(fieldName);
      }

      const validationError = validateField(
        fieldType,
        e.target.value,
        isFieldRequired,
        false
      );

      if (validationError) {
        setErrors(prevErrors => ({
          ...prevErrors,
          [fieldName]: validationError
        }));
      } else {
        setErrors(prevErrors => {
          const newErrors = { ...prevErrors };
          delete newErrors[fieldName];
          return newErrors;
        });
      }

      const discordLookup = async () => {
        setDiscordValidationResult(null);
        if (
          fieldName === 'communications_platform_username' &&
          e.target.value
        ) {
          setRenderDiscordError(false);
          setDiscordValidationLoading(true);
          const url = `${process.env.NEXT_PUBLIC_DISCORD_LOOKUP_URL}${e.target.value}`;
          try {
            const resp = await fetch(url, {
              headers: {
                'Content-Type': 'application/json'
              }
            });

            if (!resp.ok) {
              throw new Error(`HTTP error! status: ${resp.status}`);
            }
            const data = await resp.json();
            if (data.data.check.status === 3) {
              setDiscordValidationResult('success');
            } else {
              setErrors(prevErrors => ({
                ...prevErrors,
                communications_platform_username: 'Invalid'
              }));
              setDiscordValidationResult('error');
              setRenderDiscordError(true);
            }
          } catch (error: any) {
            console.error('Error in creating application:', error);
            setShowAlert(true);
            setSubmissionError(`${error.message}. Please try again later.`);
            const timer = setTimeout(() => {
              setShowAlert(false);
            }, 4000);
            return () => clearTimeout(timer);
          } finally {
            setDiscordValidationLoading(false);
          }
        }
      };

      discordLookup();
    },
    [requiredFields]
  );

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

  const handleSubmit = async () => {
    let newErrors: { [key: string]: string } = {};
    let isValid = true;

    requiredFields.forEach((field: keyof rsvp_data) => {
      const value = formData[field] as any;

      if (field !== 'communications_platform_username') {
        let validationError = '';

        if (
          (Array.isArray(value) && value.length === 0) ||
          value === null ||
          value === '' ||
          (value === false &&
            field !== 'us_visa_support_is_required' &&
            field !== 'under_18_by_date')
        ) {
          validationError = 'This field is required.';
          isValid = false;
        }

        if (validationError) {
          newErrors = { ...newErrors, [field]: validationError };
        }
      } else {
        // const communicationsPlatformUsernameError = errors[
        //   'communications_platform_username'
        // ]
        //   ? errors['communications_platform_username']
        //   : 'This field is required.';
        // if (communicationsPlatformUsernameError) {
        //   newErrors['communications_platform_username'] =
        //     communicationsPlatformUsernameError;
        // }
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 4000);
      return () => clearTimeout(timer);
    }

    if (isValid) {
      try {
        await createRsvpForm(formData);
        console.log('Form submitted successfully');
        setCompleted(true);
      } catch (error: any) {
        console.error('Error in creating application:', error);
        setSubmissionError(error.message);
        setShowAlert(true);
      }
    } else {
      console.error('Form validation failed');
    }
  };

  const handleBooleanInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const isTrue = value === 'true';

    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: isTrue
    }));

    switch (name) {
      case 'under_18_by_date':
        setUnderEighteen(value);
        break;
      case 'parential_consent_form_signed':
        setParentalConsent(value);
        break;
      case 'under_eighteen_rules':
        setUnder18Disclaimer(value);
        break;
      case 'us_visa_support_is_required':
        setVisaRequired(value);
        break;
      case 'us_visa_letter_of_invitation_required':
        setLetterOfSupport(value);
        break;
      default:
        break;
    }

    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  useEffect(() => {
    if (parentialConsentForms === 'true' && under18Disclaimer === 'true')
      formData.parential_consent_form_signed = true;
  }, [parentialConsentForms, under18Disclaimer, underEighteen]);

  return (
    <>
      <div
        className="fixed w-full h-full overflow-y-scroll bg-center bg-cover"
        style={{ backgroundImage: `url('/images/starfield-grad.jpg')` }}
      />
      <div className="flex flex-col items-center justify-center py-8 pb-32 mx-4">
        <div className="relative z-10 items-center mx-auto">
          <div className="w-[250px] h-[250px] mt-8 mx-auto bg-logocolor dark:bg-logobw bg-contain bg-no-repeat bg-center" />
          <div className="pb-8">
            <h1 className="py-1 text-2xl leading-8 text-center text-themeSecondary drop-shadow-md font-ethnocentric">
              MIT Reality Hack 2024
            </h1>
            <h2 className="text-2xl font-bold leading-8 text-center text-themeYellow drop-shadow-md">
              RSVP Form
            </h2>
          </div>
        </div>
        <div className="flex flex-col px-2 md:px-4 py-2 bg-white rounded-lg shadow-md z-[10] mx-8 sm:mx-auto max-w-full md:w-[856px]">
          {!completed ? (
            <div className="p-8">
              <div className="mb-4 text-xl font-bold text-purple-900">
                Fill out this form to confirm your spot!
              </div>

              {slug[0] === 'sponsor' && (
                <div className="mb-8">
                  What sponsor company are you with?
                  <TextInput
                    name="sponsor_company"
                    placeholder="e.g. Meta"
                    value={formData.sponsor_company || ''}
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.sponsor_company}
                    valid={!errors.sponsor_company}
                  />
                </div>
              )}

              <div className="pb-8">
                <div>
                  What unisex t-shirt size do you wear?{' '}
                  <span className="text-red-700">*</span>
                </div>
                <div>
                  <RadioInput
                    name="shirt_size"
                    value={shirt_size.S}
                    onChange={handleChange}
                    label="S"
                    checked={formData.shirt_size === shirt_size.S}
                  />
                  <RadioInput
                    name="shirt_size"
                    value={shirt_size.M}
                    onChange={handleChange}
                    label="M"
                    checked={formData.shirt_size === shirt_size.M}
                  />
                  <RadioInput
                    name="shirt_size"
                    value={shirt_size.L}
                    onChange={handleChange}
                    label="L"
                    checked={formData.shirt_size === shirt_size.L}
                  />
                  <RadioInput
                    name="shirt_size"
                    value={shirt_size.XL}
                    onChange={handleChange}
                    label="XL"
                    checked={formData.shirt_size === shirt_size.XL}
                  />
                  <RadioInput
                    name="shirt_size"
                    value={shirt_size.XXL}
                    onChange={handleChange}
                    label="XXL"
                    checked={formData.shirt_size === shirt_size.XXL}
                  />
                </div>
                <p
                  className={`ml-1 text-xs text-themeSecondary ${
                    errors.shirt_size ? 'visible' : 'invisible'
                  }`}
                >
                  {errors.shirt_size || ''}
                </p>
              </div>

              {slug[0] !== 'judge' && (
                <div className="relative flex items-end">
                  <TextInput
                    name="communications_platform_username"
                    placeholder="e.g. Username1234"
                    type="text"
                    value={formData.communications_platform_username || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.communications_platform_username}
                    valid={!errors.communications_platform_username}
                  >
                    Discord will be our primary communications platform leading
                    up to and during the event. <br /> What is your Discord
                    username?
                    {/* <br /> */}
                    {/* <span className="text-xs"> */} You may need to migrate
                    your username. For more information on Discord’s new
                    usernames, go to:{' '}
                    <a
                      className="underline cursor-pointer text-themePrimary"
                      href="https://drive.google.com/file/d/1B9zAg7V2W2U1YsVcCQNxg1kW2sHf5lF1/view?usp=sharing"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      How to find your username.
                    </a>{' '}
                    <span className="text-red-700">*</span>
                    {/* </span> */}
                  </TextInput>
                  {renderDiscordError && (
                    <p className="absolute ml-1 text-xs text-themeSecondary bottom-2">
                      Invalid Discord username. for more information on
                      Discord’s new usernames, go to{' '}
                      <a
                        className="underline cursor-pointer"
                        href="https://support.discord.com/hc/en-us/articles/12620128861463-New-Usernames-Display-Names#h_01GZHKGNP2FYNFSAJB3DW2E4PN"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        this help article
                      </a>
                      .
                    </p>
                  )}
                  <div className="absolute right-[-24px] bottom-[32px]">
                    {discordValidationLoading && <CircularProgress size={12} />}
                    {!discordValidationLoading &&
                      discordValidationResult === 'success' && (
                        <CheckCircleOutlineIcon
                          style={{
                            color: 'green',
                            fontSize: '14px'
                          }}
                        />
                      )}
                    {!discordValidationLoading &&
                      discordValidationResult === 'error' && (
                        <ErrorOutlineIcon
                          style={{
                            color: '#dc4c88',
                            fontSize: '14px'
                          }}
                        />
                      )}
                  </div>
                </div>
              )}

              <div className="">
                Please describe any dietary restrcitions you have.
                <div className="pb-8">
                  <CheckboxInput
                    name="dietary_restrictions"
                    value="1"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Vegetarian"
                    checked={
                      formData.dietary_restrictions?.includes(
                        dietary_restrictions.vegetarian
                      ) === true
                    }
                  />
                  <CheckboxInput
                    name="dietary_restrictions"
                    value="2"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Vegan"
                    checked={
                      formData.dietary_restrictions?.includes(
                        dietary_restrictions.vegan
                      ) === true
                    }
                  />
                  <CheckboxInput
                    name="dietary_restrictions"
                    value="3"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Gluten free"
                    checked={
                      formData.dietary_restrictions?.includes(
                        dietary_restrictions.gluten_free
                      ) === true
                    }
                  />
                  <CheckboxInput
                    name="dietary_restrictions"
                    value="4"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Halal"
                    checked={
                      formData.dietary_restrictions?.includes(
                        dietary_restrictions.halal
                      ) === true
                    }
                  />
                  <CheckboxInput
                    name="dietary_restrictions"
                    value="5"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Lactose intolerant"
                    checked={
                      formData.dietary_restrictions?.includes(
                        dietary_restrictions.lactose_intolerant
                      ) === true
                    }
                  />
                  <CheckboxInput
                    name="dietary_restrictions"
                    value="6"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Kosher"
                    checked={
                      formData.dietary_restrictions?.includes(
                        dietary_restrictions.kosher
                      ) === true
                    }
                  />
                  <CheckboxInput
                    name="dietary_restrictions"
                    value="7"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Other"
                    checked={
                      formData.dietary_restrictions?.includes(
                        dietary_restrictions.other
                      ) === true
                    }
                  />
                  <div
                    className={`transition-all duration-300 ${
                      formData.dietary_restrictions?.includes(
                        dietary_restrictions.other
                      )
                        ? 'max-h-96'
                        : 'max-h-0'
                    } mb-0`}
                  >
                    {formData.dietary_restrictions?.includes(
                      dietary_restrictions.other
                    ) && (
                      <TextInput
                        name="dietary_restrictions_other"
                        placeholder="e.g. Pescatarian"
                        value={formData.dietary_restrictions_other || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.dietary_restrictions_other}
                        valid={!errors.dietary_restrictions_other}
                      />
                    )}
                  </div>
                </div>
                <p
                  className={`ml-1 text-xs mt-[-24px] text-themeSecondary ${
                    errors.dietary_restrictions ? 'visible' : 'invisible'
                  }`}
                >
                  {errors.dietary_restrictions || ''}
                </p>
              </div>

              <div className="">
                <div className="pb-8">
                  Do you have any allergies? Select all that apply.
                  <CheckboxInput
                    name="dietary_allergies"
                    value="1"
                    label="Nut allergy"
                    checked={
                      formData.dietary_allergies?.includes(
                        dietary_allergies.nut_allergy
                      ) === true
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <CheckboxInput
                    name="dietary_allergies"
                    value="2"
                    label="Shellfish allergy"
                    checked={
                      formData.dietary_allergies?.includes(
                        dietary_allergies.shellfish_allergy
                      ) === true
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <CheckboxInput
                    name="dietary_allergies"
                    value="3"
                    label="Soy allergy"
                    checked={
                      formData.dietary_allergies?.includes(
                        dietary_allergies.soy_allergy
                      ) === true
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <CheckboxInput
                    name="dietary_allergies"
                    value="4"
                    label="Dairy allergy"
                    checked={
                      formData.dietary_allergies?.includes(
                        dietary_allergies.dairy_allergy
                      ) === true
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <CheckboxInput
                    name="dietary_allergies"
                    value="5"
                    label="Other"
                    checked={
                      formData.dietary_allergies?.includes(
                        dietary_allergies.other_allergy
                      ) === true
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div
                    className={`transition-all duration-300 ${
                      formData.dietary_allergies?.includes(
                        dietary_allergies.other_allergy
                      ) === true
                        ? 'max-h-96'
                        : 'max-h-0'
                    } mb-0`}
                  >
                    {formData.dietary_allergies?.includes(
                      dietary_allergies.other_allergy
                    ) === true && (
                      <TextInput
                        name="allergies_other"
                        placeholder="e.g. Dust"
                        value={formData.allergies_other || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.allergies_other}
                        valid={!errors.allergies_other}
                      />
                    )}
                  </div>
                </div>
                <p
                  className={`ml-1 text-xs mt-[-24px] text-themeSecondary ${
                    errors.dietary_allergies ? 'visible' : 'invisible'
                  }`}
                >
                  {errors.dietary_allergies || ''}
                </p>
              </div>

              <TextInput
                name="additional_accommodations"
                placeholder="e.g. Epilipsy"
                type="text"
                value={formData.additional_accommodations || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.additional_accommodations}
                valid={!errors.additional_accommodations}
              >
                Tell us about any accommodations you may need in order to be
                able to attend our event. (Optional)
              </TextInput>
              {slug[0] !== 'sponsor' && (
                <>
                  <hr className="my-4" />
                  <div className="mb-4 text-xl font-bold text-purple-900">
                    In case of Emergencies
                  </div>
                  <div>
                    <TextInput
                      name="personal_phone_number"
                      type="text"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={formData.personal_phone_number || ''}
                      placeholder="e.g. 222-333-4444"
                      error={errors.personal_phone_number}
                      valid={!errors.personal_phone_number}
                    >
                      A mobile phone number we can reach you at during the MIT
                      Reality Hack event. <br /> (include country code if
                      non-US) <span className="text-red-700">*</span>
                    </TextInput>
                    <TextInput
                      name="emergency_contact_name"
                      type="text"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. Bill Nye"
                      value={formData.emergency_contact_name || ''}
                      error={errors.emergency_contact_name}
                      valid={!errors.emergency_contact_name}
                    >
                      Emergency Contact Name{' '}
                      <span className="text-red-700">*</span>
                    </TextInput>
                    <TextInput
                      name="emergency_contact_phone_number"
                      type="text"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. 222-333-4444"
                      value={formData.emergency_contact_phone_number || ''}
                      error={errors.emergency_contact_phone_number}
                      valid={!errors.emergency_contact_phone_number}
                    >
                      Emergency Contact Phone Number{' '}
                      <span className="text-red-700">*</span>
                    </TextInput>
                    <TextInput
                      name="emergency_contact_email"
                      type="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. albert@gmail.com"
                      value={formData.emergency_contact_email || ''}
                      error={errors.emergency_contact_email}
                      valid={!errors.emergency_contact_email}
                    >
                      Emergency Contact Email
                      <span className="font-bold text-themeSecondary">*</span>
                    </TextInput>
                    <TextInput
                      name="emergency_contact_relationship"
                      type="text"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. Mother, Father, Partner, etc."
                      value={formData.emergency_contact_relationship || ''}
                      error={errors.emergency_contact_relationship}
                      valid={!errors.emergency_contact_relationship}
                    >
                      Emergency Contact Relationship
                      <span className="text-red-700">*</span>
                    </TextInput>
                  </div>
                </>
              )}
              <hr className="my-4" />
              <div className="mb-4 text-xl font-bold text-purple-900">
                Rules and Code of Conduct
              </div>
              {isParticipant && (
                <>
                  <div className="pb-4">
                    Will you be under 18 on January 25, 2024?{' '}
                    <span className="text-red-700">*</span>
                    <div className="flex flex-col mt-[10px]">
                      <RadioInput
                        name="under_18_by_date"
                        value="true"
                        onChange={handleBooleanInputChange}
                        label="Yes"
                        checked={formData.under_18_by_date === true}
                      />
                      <RadioInput
                        name="under_18_by_date"
                        value="false"
                        onChange={handleBooleanInputChange}
                        label="No"
                        checked={formData.under_18_by_date === false}
                      />
                      <div
                        className={`transition-all duration-300 ${
                          formData.under_18_by_date === true
                            ? 'max-h-96'
                            : 'max-h-0'
                        }`}
                      >
                        {formData.under_18_by_date === true && (
                          <div className="relative flex flex-col mb-0 ml-4 cursor-default items-left">
                            <div>
                              As you will be under 18 when the event starts on
                              January 25, 2024, we require the completion of a
                              Parental Consent and Release Form. If your
                              parent/guardian has not already done so, please
                              have your parent/guardian{' '}
                              <a
                                href="https://na4.documents.adobe.com/public/esignWidget?wid=CBFCIBAA3AAABLblqZhD-XwHm6fxjR8TIMgcXkRfaqpDSzPoo8O6xNLa28V7V1ZoQ7FsQbbS1pFTaECUetkk"
                                target="_blank"
                                className="underline cursor-pointer text-themePrimary"
                              >
                                fill out this form
                              </a>
                              .
                              <div className="py-4 mb-3">
                                <CheckboxInput
                                  value="true"
                                  name="parential_consent_form_signed"
                                  label="Check this box when you have received an email confirmation from Adobe that the form was successfully signed."
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  checked={
                                    formData.parential_consent_form_signed ===
                                    true
                                  }
                                />
                                <p
                                  className={`ml-1 text-xs text-themeSecondary ${
                                    errors.parential_consent_form_signed
                                      ? 'visible'
                                      : 'invisible'
                                  }`}
                                >
                                  {errors.parential_consent_form_signed || ''}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <p
                      className={`ml-1 text-xs text-themeSecondary ${
                        errors.under_18_by_date ? 'visible' : 'invisible'
                      }`}
                    >
                      {errors.under_18_by_date || ''}
                    </p>
                  </div>
                </>
              )}
              <div>
                Please read over the{' '}
                <a
                  href="https://www.mitrealityhack.com/rules"
                  target="_blank"
                  className="underline cursor-pointer text-themePrimary"
                >
                  Rules
                </a>{' '}
                and{' '}
                <a
                  href="https://www.mitrealityhack.com/code-of-conduct"
                  target="_blank"
                  className="underline cursor-pointer text-themePrimary"
                >
                  Code of Conduct
                </a>
                . By participating in MIT Reality Hack, you agree to these Rules
                and our Code of Conduct.
                <div className="relative">
                  <CheckboxInput
                    value="accept"
                    name="agree_to_rules_code_of_conduct"
                    label={`By checking this box, I, certify I have read and agree with the above Rules and Code of Conduct.`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    checked={formData.agree_to_rules_code_of_conduct === true}
                    error={errors.agree_to_rules_code_of_conduct}
                  />
                </div>
              </div>
              {isParticipant && (
                <>
                  <hr className="my-4" />
                  <div className="mb-4 text-xl font-bold text-purple-900">
                    Special XR and non-XR expertise
                  </div>

                  <div>
                    Do you currently build for XR, and if so what platforms do
                    you build for? (optional)
                    <TextInput
                      name="currently_build_for_xr"
                      placeholder=""
                      value={formData.currently_build_for_xr || ''}
                      type="text"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    Do you currently use XR, and if so what platforms are you
                    using? (optional)
                    <TextInput
                      name="currently_use_xr"
                      placeholder=""
                      value={formData.currently_use_xr || ''}
                      type="text"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    Do you have any non-XR talents or expertise you&apos;d like
                    to share? (Example: teacher, musician, etc.) (optional)
                    <TextInput
                      name="non_xr_talents"
                      placeholder=""
                      value={formData.non_xr_talents || ''}
                      type="text"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    Do you already have an AR or VR app in any store? And if so,
                    which store(s)? (Optional)
                    <TextInput
                      name="ar_vr_app_in_store"
                      placeholder=""
                      value={formData.ar_vr_app_in_store || ''}
                      type="text"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  <hr className="my-4" />
                  <div className="mb-4 text-xl font-bold text-purple-900">
                    Special Interests
                  </div>
                  <div>
                    <div className="mb-4">
                      The RSVP email described a couple special tracks. Please
                      indicate your interest below.
                    </div>
                    <div className="pb-4">
                      Are you interested in Snapdragon Spaces hack?
                      <RadioInput
                        name="special_track_snapdragon_spaces_interest"
                        value="Y"
                        onChange={handleChange}
                        label="Yes"
                        checked={
                          formData.special_track_snapdragon_spaces_interest ===
                          'Y'
                        }
                      />
                      <RadioInput
                        name="special_track_snapdragon_spaces_interest"
                        value="N"
                        onChange={handleChange}
                        label="No"
                        checked={
                          formData.special_track_snapdragon_spaces_interest ===
                          'N'
                        }
                      />
                      <p
                        className={`ml-1 text-xs text-themeSecondary ${
                          errors.special_track_snapdragon_spaces_interest
                            ? 'visible'
                            : 'invisible'
                        }`}
                      >
                        {errors.special_track_snapdragon_spaces_interest || ''}
                      </p>
                    </div>
                    <div>
                      Are you interested in the Future Constructors hack?
                      <RadioInput
                        name="special_track_future_constructors_interest"
                        value="Y"
                        onChange={handleChange}
                        label="Yes"
                        checked={
                          formData.special_track_future_constructors_interest ===
                          'Y'
                        }
                      />
                      <RadioInput
                        name="special_track_future_constructors_interest"
                        value="N"
                        onChange={handleChange}
                        label="No"
                        checked={
                          formData.special_track_future_constructors_interest ===
                          'N'
                        }
                      />
                      <p
                        className={`ml-1 text-xs text-themeSecondary ${
                          errors.special_track_future_constructors_interest
                            ? 'visible'
                            : 'invisible'
                        }`}
                      >
                        {errors.special_track_future_constructors_interest ||
                          ''}
                      </p>
                    </div>
                  </div>
                </>
              )}
              <hr className="my-4" />
              <div className="mb-4 text-xl font-bold text-purple-900">
                International Visitors
              </div>

              <div>
                <div className="pb-3">
                  Do you require a visa to attend the event? (If you have
                  already recieved a visa support letter from us, please select
                  &quot;No&quot;)
                  <RadioInput
                    name="us_visa_support_is_required"
                    value="true"
                    checked={visaRequired === 'true'}
                    onChange={handleBooleanInputChange}
                    label="Yes"
                  />
                  <RadioInput
                    name="us_visa_support_is_required"
                    value="false"
                    checked={visaRequired === 'false'}
                    onChange={handleBooleanInputChange}
                    label="No"
                  />
                  <p
                    className={`ml-1 text-xs text-themeSecondary ${
                      errors.us_visa_support_is_required
                        ? 'visible'
                        : 'invisible'
                    }`}
                  >
                    {errors.us_visa_support_is_required || ''}
                  </p>
                </div>
                <div
                  className={`transition-all duration-300 ${
                    formData.us_visa_support_is_required === true
                      ? 'max-h-96'
                      : 'max-h-0'
                  }`}
                ></div>
                {formData.us_visa_support_is_required === true && (
                  <div>
                    <div className="pb-3">
                      Do you require a visa as a supplementary circumstance to
                      enter the US?
                      <RadioInput
                        name="us_visa_letter_of_invitation_required"
                        value="true"
                        checked={letterOfSupport === 'true'}
                        onChange={handleBooleanInputChange}
                        label="I need a supplementary invitation letter for my US tourist visa application."
                      />
                      <RadioInput
                        name="us_visa_letter_of_invitation_required"
                        value="false"
                        checked={letterOfSupport === 'false'}
                        onChange={handleBooleanInputChange}
                        label="I do not need a supplementary invitation letter for my US tourist visa application."
                      />
                      <p
                        className={`ml-1 text-xs text-themeSecondary ${
                          errors.us_visa_letter_of_invitation_required
                            ? 'visible'
                            : 'invisible'
                        }`}
                      >
                        {errors.us_visa_letter_of_invitation_required || ''}
                      </p>
                    </div>
                    <div>
                      <SelectInput
                        name="us_visa_support_citizenship"
                        placeholder="Select your citizenship"
                        options={citizenship}
                        value={
                          formData.us_visa_support_citizenship_option || ''
                        }
                        onChange={handleSelectChange}
                        onBlur={handleBlur}
                        error={errors.us_visa_support_citizenship}
                        required={true}
                        valid={!errors.us_visa_support_citizenship}
                      >
                        Citizenship (Country issuing your passport){' '}
                        <span className="font-bold text-themeSecondary">*</span>
                      </SelectInput>
                    </div>
                    <div className="pb-3">
                      What document type would you prefer to use?
                      <RadioInput
                        name="us_visa_support_national_identification_document_type"
                        label="Passport"
                        value="P"
                        checked={
                          formData.us_visa_support_national_identification_document_type ===
                          'P'
                        }
                        onChange={handleChange}
                      />
                      <RadioInput
                        name="us_visa_support_national_identification_document_type"
                        label="Identification number"
                        value="N"
                        checked={
                          formData.us_visa_support_national_identification_document_type ===
                          'N'
                        }
                        onChange={handleChange}
                      />
                      {/* <p
                        className={`ml-1 mt-[-24px] text-xs text-themeSecondary ${
                          errors.us_visa_support_national_identification_document_type
                            ? 'visible'
                            : 'invisible'
                        }`}
                      >
                        {errors.us_visa_support_national_identification_document_type ||
                          ''}
                      </p> */}
                    </div>
                    <div
                      className={`transition-all duration-300 ${
                        formData.us_visa_support_national_identification_document_type ===
                          'P' || 'N'
                          ? 'max-h-96'
                          : 'max-h-0'
                      } mb-4`}
                    >
                      {(formData.us_visa_support_national_identification_document_type ===
                        'P' ||
                        formData.us_visa_support_national_identification_document_type ===
                          'N') && (
                        <div>
                          <TextInput
                            value={
                              formData.us_visa_support_document_number || ''
                            }
                            placeholder="e.g. 84757UIH97GG"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="us_visa_support_document_number"
                            error={errors.us_visa_support_document_number}
                            valid={!errors.us_visa_support_document_number}
                          >
                            Enter your{' '}
                            {formData.us_visa_support_national_identification_document_type ===
                            'P'
                              ? 'passport'
                              : 'identification'}{' '}
                            number here
                            <span className="font-bold text-themeSecondary">
                              *
                            </span>
                          </TextInput>
                          <p
                            className={`ml-1 text-xs mt-[-24px] text-themeSecondary ${
                              errors.us_visa_support_document_number
                                ? 'visible'
                                : 'invisible'
                            }`}
                          >
                            {errors.us_visa_support_document_number || ''}
                          </p>
                        </div>
                      )}
                    </div>
                    <div>
                      <TextInput
                        value={formData.us_visa_support_full_name || ''}
                        placeholder="e.g. Alan Turing"
                        type="text"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="us_visa_support_full_name"
                        error={errors.us_visa_support_full_name}
                        valid={!errors.us_visa_support_full_name}
                      >
                        Full name as it appears on the document above
                        <span className="font-bold text-themeSecondary">*</span>
                      </TextInput>
                      <p
                        className={`ml-1 text-xs mt-[-24px] text-themeSecondary ${
                          errors.us_visa_support_full_name
                            ? 'visible'
                            : 'invisible'
                        }`}
                      >
                        {errors.us_visa_support_full_name || ''}
                      </p>
                    </div>
                    <div>
                      <TextInput
                        value={formData.us_visa_support_address || ''}
                        placeholder="e.g. 1 North Drive, Montreal, Quebec, H4W, Canada"
                        type="text"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="us_visa_support_address"
                        error={errors.us_visa_support_address}
                        valid={!errors.us_visa_support_address}
                      >
                        Full address (include all the information including
                        street number, street name, city, state/province, postal
                        code, country etc.)
                        <span className="font-bold text-themeSecondary">*</span>
                      </TextInput>
                      <p
                        className={`ml-1 text-xs mt-[-24px] text-themeSecondary ${
                          errors.us_visa_support_address
                            ? 'visible'
                            : 'invisible'
                        }`}
                      >
                        {errors.us_visa_support_address || ''}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <hr className="my-4" />
              <div className="mb-4 text-xl font-bold text-purple-900">
                Attendee liability release form
              </div>
              <div>
                As an attendee in the &quot;MIT Reality Hack,&quot; organized by
                Reality Hack, Inc., a Massachusetts 501(c)(3) nonprofit, and
                VR/AR MIT, an MIT student group, I hereby agree to the following
                terms:
                <br></br>
                <br></br>
                <span className="w-full h-px mt-8 text-lg font-semibold leading-normal text-purple-900 underline mb-9 ">
                  Definition of &apos;Attendee&apos;
                </span>
                <br></br>
                For the purposes of this Agreement, the term
                &apos;Attendee&apos; shall refer to any individual who
                registers, enrolls, or participates in any capacity in the
                event, activity, or program specified in this Agreement. This
                includes, but is not limited to, sponsors, mentors,
                participants, judges, guests, presenters, volunteers, staff
                members, and any other persons present at the event venue or
                participating in any event-related activities. An
                &apos;Attendee&apos; is recognized as such upon their entry to
                the event location or participation in any event-related
                activity, regardless of whether a formal registration or
                enrollment process has been completed.
                <br></br>
                <br></br>
                <span className="w-full h-px mt-8 text-lg font-semibold leading-normal text-purple-900 underline mb-9 ">
                  Hackathon Rules and Code of Conduct Compliance
                </span>
                <br></br>I affirm that I have reviewed, understand, and agree to
                adhere to the Rules and Code of Conduct for the MIT Reality
                Hack, available at{' '}
                <a
                  href="https://mitrealityhack.com/rules"
                  target="_blank"
                  className="underline cursor-pointer text-themePrimary"
                >
                  https://mitrealityhack.com/rules
                </a>{' '}
                and{' '}
                <a
                  href="https://www.mitrealityhack.com/code-of-conduct "
                  target="_blank"
                  className="underline cursor-pointer text-themePrimary"
                >
                  https://www.mitrealityhack.com/code-of-conduct
                </a>
                . I acknowledge that non-compliance may lead to
                disqualification, forfeiture of prizes, and potential exclusion
                from future events.
                <br></br>
                <br></br>
                <span className="w-full h-px mt-8 text-lg font-semibold leading-normal text-purple-900 underline mb-9 ">
                  Intellectual Property
                </span>
                <br></br>I understand that any intellectual property I develop
                or contribute to during the Reality Hack event, scheduled for
                January 24 - 29th, 2024, at Massachusetts Institute of
                Technology in Cambridge, MA, will be subject to specific
                licensing agreements. All code developed during the hackathon
                must adhere to open-source licensing, ensuring its source code
                is publicly accessible and can be freely inspected, modified,
                and enhanced. This encompasses, but is not limited to,
                inventions, software, and designs specifically related to coding
                and programming. It is my responsibility to ensure proper
                licensing of my work. For guidance on open-source licenses,
                refer to{' '}
                <a
                  href="https://opensource.org/licenses"
                  target="_blank"
                  className="underline cursor-pointer text-themePrimary"
                >
                  https://opensource.org/licenses
                </a>{' '}
                and{' '}
                <a
                  href="https://choosealicense.com"
                  target="_blank"
                  className="underline cursor-pointer text-themePrimary"
                >
                  https://choosealicense.com
                </a>{' '}
                for assistance in selecting an appropriate license. Other forms
                of work, such as artwork and non-software creations, will be
                shared under a Creative Commons license, promoting creative
                freedom while allowing creators to maintain some rights. For
                more information about Creative Commons licensing, please visit{' '}
                <a
                  href="https://creativecommons.org/licenses/"
                  target="_blank"
                  className="underline cursor-pointer text-themePrimary"
                >
                  https://creativecommons.org/licenses/
                </a>
                .<br></br>
                <br></br>
                <span className="w-full h-px mt-8 text-lg font-semibold leading-normal text-purple-900 underline mb-9 ">
                  Discrimination
                </span>
                <br></br>I acknowledge that harassment or discrimination based
                on an individual’s race, color, sex, sexual orientation, gender
                identity, pregnancy, religion, disability, age, genetic
                information, veteran status, or national or ethnic origin is not
                only a violation of MIT policy but may also violate federal and
                state law, including Title IX of the Education Amendments of
                1972, Title VII of the Civil Rights Act of 1964, and Mass.
                General Laws Chapter 151B.
                <br></br>
                <br></br>
                <span className="w-full h-px mt-8 text-lg font-semibold leading-normal text-purple-900 underline mb-9 ">
                  Gender-based and Sexual Harassment
                </span>
                <br></br>I duly acknowledge that gender-based and sexual
                harassment will not be tolerated in this community. Gender-based
                harassment is unwelcome verbal or nonverbal conduct based on
                gender, sex, sex-stereotyping, sexual orientation, gender
                identity, or pregnancy. Sexual harassment is unwelcome conduct
                of a sexual nature, such as unwelcome sexual advances, requests
                for sexual favors, or other verbal, nonverbal, or physical
                conduct of a sexual nature, when:
                <br></br>
                <li className="ml-3">
                  Submission to such conduct is made either explicitly or
                  implicitly a term or condition of an individual’s
                  participation at the event.
                </li>
                <li className="ml-3">
                  Submission to or rejection of such conduct by an individual is
                  used as the basis for significant participation decisions
                  (such as team formation) at the event.
                </li>
                <li className="ml-3">
                  The conduct is sufficiently severe or pervasive that a
                  reasonable person would consider it intimidating, hostile, or
                  abusive and it adversely affects an individual’s educational,
                  work, or living environment.
                </li>
                <br></br>
                Examples of sexual harassment include, but are not limited to:
                <br></br>
                <li className="ml-3">
                  Verbal: Unwelcome sexual flirtation, advances, requests for
                  sexual activity or dates; discussing sexual activities,
                  fantasies, preferences, or history; suggestive comments;
                  sexually explicit jokes.
                </li>
                <li className="ml-3">
                  Nonverbal: Displaying sexual objects, pictures, or images;
                  inappropriate personal space invasion; making sexual gestures;
                  delivering unwanted letters, gifts, or items of a sexual
                  nature.
                </li>
                <br></br>
                <span className="w-full h-px mt-8 text-lg font-semibold leading-normal text-purple-900 underline mb-9 ">
                  Release of Information/Photography/Display
                </span>
                <br></br>I grant permission to release my application
                information to Reality Hack sponsors and acknowledge that I have
                no control over its subsequent use by the sponsors. I also grant
                Reality Hack, Inc., and VR/AR MIT the right to record, use, and
                display my participation, appearance, name, likeness, voice, and
                biographical information in connection with the event. This
                includes the right to reproduce, distribute, display, and
                perform the recordings in any medium, without compensation, for
                the purposes of the event and its related publications,
                including web and social media platforms.
                <br></br>
                <br></br>
                <span className="w-full h-px mt-8 text-lg font-semibold leading-normal text-purple-900 underline mb-9 ">
                  Liability and Injury
                </span>
                <br></br>I acknowledge the inherent risks associated with
                participation in this event, including potential personal injury
                or property damage. By agreeing to this waiver, I release MIT,
                Reality Hack, Inc., VR/AR MIT, their employees, agents,
                sponsors, and volunteers from any claims or liabilities arising
                from my participation. Furthermore, I agree to indemnify and
                hold harmless the aforementioned parties from any claims,
                including related costs, legal fees, liabilities, settlements,
                and judgments.
                <br></br>
                <br></br>
                <span className="w-full h-px mt-8 text-lg font-semibold leading-normal text-purple-900 underline mb-9 ">
                  Off-Campus and After Hours
                </span>
                <br></br>
                Reality Hack, Inc., and VR/AR MIT shall not be held liable or
                responsible for any accidents, injuries, theft, acts of sexual
                harassment, instances of self-harm, or any other incidents that
                occur off the event&apos;s official premises, including but not
                limited to areas around, near, or after the conclusion of the
                event. Participants should exercise caution and common sense
                when navigating Boston and the City of Cambridge. I hereby
                release Reality Hack, Inc. and VR/AR MIT from any claims,
                damages, injuries, losses, or liabilities arising in connection
                with the event, including those that may occur during the
                event&apos;s closed hours (12AM-7AM) and after the event&apos;s
                conclusion. This release encompasses, but is not limited to,
                personal injury, property damage, theft, and any other loss,
                whether foreseen or unforeseen, associated with their
                participation in the event.
                <br></br>
                <br></br>
                <span className="w-full h-px mt-8 text-lg font-semibold leading-normal text-purple-900 underline mb-9 ">
                  Emergency Medical Treatment
                </span>
                <br></br>
                In case of an emergency where I am unable to express my wishes,
                I consent to receive necessary medical treatment and/or
                transportation. I accept all financial responsibilities for such
                medical services.
                <br></br>
                <br></br>
                <span className="w-full h-px mt-8 text-lg font-semibold leading-normal text-purple-900 underline mb-9 ">
                  Responsibility for Equipment
                </span>
                <br></br>I accept full responsibility for any personal equipment
                I bring to the Hackathon and will not hold the aforementioned
                parties liable for any loss, theft, or damage. If borrowing
                equipment from the Hackathon, I agree to maintain it in good
                condition and accept full financial responsibility for any
                damage or loss, authorizing the Hackathon to charge me for such
                occurrences.
                <br></br>
                <br></br>
                <span className="w-full h-px mt-8 text-lg font-semibold leading-normal text-purple-900 underline mb-9">
                  Alcohol Consumption Policy
                </span>
                <br></br>
                This event may include the serving of alcoholic beverages at
                networking events and at the closing celebration. By signing
                this form, I acknowledge that I am aware of the presence of
                alcohol at the event. All attendees are required to comply with
                applicable laws and regulations regarding alcohol consumption.
                Specifically, no individual under the age of 21 years shall be
                permitted to consume alcoholic beverages under any
                circumstances. It is the responsibility of each attendee to
                ensure they are legally eligible to responsibly consume alcohol
                and to abide by this policy. Failure to comply with these terms
                may result in immediate removal from the event and potential
                legal consequences.
              </div>
              <div className="flex flex-col justify-center align-center">
                <div className="flex flex-col justify-center my-8 align-center">
                  <CheckboxInput
                    name="agree_to_media_release"
                    value="true"
                    label="By checking this box, I confirm that I have read, understood, and voluntarily agree to the terms of this Consent and Release for the 2023-24 MIT Reality Hack."
                    checked={formData.agree_to_media_release === true}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.agree_to_media_release}
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="cursor-pointer text-white w-20 bg-[#493B8A] px-4 py-2 rounded-lg disabled:opacity-50 transition-all"
              >
                Submit
              </button>
              <div
                className={` fixed top-0 left-0 m-4 z-50 transition-opacity w-[500px] ${
                  showAlert ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
              >
                <Alert
                  severity="error"
                  onClose={() => {
                    setShowAlert(false);
                  }}
                >
                  {getFormErrors()}
                </Alert>
              </div>
            </div>
          ) : (
            <div className="px-6 py-6 h-[256px]">
              <p>{`Thank you for submitting your RSVP to MIT Reality Hack 2024! You should receive an email to log in to our platform shortly.`}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
