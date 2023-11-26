'use client';
import AnyApp from '@/components/applications/applicationAny';
import { CheckboxInput, validateField } from '@/components/Inputs';
import PersonalInformationForm from '@/components/applications/PersonalInformationForm';
import React, { useState, useCallback, useEffect } from 'react';
import type { NextPage } from 'next';
import { getSkills } from "@/app/api/skills";
import { applicationOptions } from '@/app/api/application';



import Link from 'next/link';
import {
  Enums,
  digital_designer_skills,
  exemptFields,
  form_data,
  gender_identity,
  heard_about_us,
  participation_capacity,
  participation_role,
  race_ethnic_group
} from '@/application_form_types';
import ReviewPage from '@/components/admin/ReviewPage';

const MentorApp: NextPage = ({}: any) => {
  const [formData, setFormData] = useState<Partial<form_data>>({
    disclaimer_groups: null,
    disclaimer_open_source: null,
    first_name: '',
    middle_name: null,
    last_name: '',
    pronouns: '',
    email: '',
    communications_platform_username: '',
    portfolio: '',
    nationality: '',
    current_country: '',
    current_city: '',
    age_group: null,
    resume: null,
    gender_identity: [],
    race_ethnic_group: [],
    disability_identity: null,
    disabilities: [],
    disability_accommodations: '',
    participation_capacity: null,
    student_school: null,
    student_field_of_study: null,
    digital_designer_skills: [],
    specialized_expertise: null,
    occupation: null,
    employer: null,
    industry: null,
    previously_participated: null,
    previous_participation: [],
    participation_role: null,
    proficient_languages: '',
    xr_familiarity_tools: '',
    additional_skills: '',
    theme_essay: '',
    theme_essay_follow_up: '',
    hardware_hack_interest: [],
    heard_about_us: [],
    outreach_groups: null,
    gender_identity_other: null,
    digital_designer_skills_other: null,
    heard_about_us_other: null,
    current_country_option: null,
    nationality_option: null,
    industry_option: null
  });
  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;

      setFormData(prev => {
        // CHECKBOX
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
    },
    [setFormData]
  );
  const [requiredFields, setRequiredFields] = useState<
    Record<string, string[]>
  >({
    WELCOME: [''],
    DISCLAIMERS: ['disclaimer_groups', 'disclaimer_open_source'],
    'PERSONAL INFO': [
      'first_name',
      'last_name',
      'email',
      'pronouns',
      'communications_platfgsorm_username',
      'portfolio',
      'current_city',
      'current_country',
      'nationality',
      'age_group'
    ],
    'DIVERSITY & INCLUSION': [
      'gender_identity',
      'race_ethnic_group',
      'disability_identity'
    ],
    EXPERIENCE: [
      'participation_capacity',
      'participation_role',
      'previously_participated'
    ],
    THEMATIC: ['theme_essay', 'theme_essay_follow_up'],
    CLOSING: ['heard_about_us'],
    'REVIEW & SUBMIT': ['']
  });

  const [acceptedFiles, setAcceptedFiles] = useState<any>(null);
  const [rejectedFiles, setRejectedFiles] = useState<any>(null);
  const [countries, setCountries] = useState<any>(null);
  const [nationalities, setNationalities] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [skills, setSkills] = useState<any>(null);
  const [industries, setIndustries] = useState<any>(null);


  useEffect(() => {
    const getData = async () => {
      const data = await getSkills();
      const options = await applicationOptions(formData);
      console.log('options: ', options);
      setCountries(options.actions.POST.current_country.choices);
      setNationalities(options.actions.POST.nationality.choices);
      setIndustries(options.actions.POST.industry.choices);
      setSkills(data);
    };
    getData();
  }, []);

  const handleBlur = useCallback(
    (
      e: React.FocusEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      let fieldType = e.target.tagName.toLowerCase();
      if (fieldType === 'textarea') {
        fieldType = 'text';
      } else {
        fieldType = e.target.type;
      }

      console.log('validate field type:', fieldType);

      const fieldTab = Object.entries(requiredFields).find(([_, fields]) =>
        fields.includes(e.target.name)
      )?.[0];

      if (!fieldTab) return;

      const isFieldRequired = requiredFields[fieldTab].includes(e.target.name);
      console.log(isFieldRequired);
      const validationError = validateField(
        fieldType,
        e.target.value,
        isFieldRequired
      );

      if (validationError) {
        setErrors(prevErrors => ({
          ...prevErrors,
          [e.target.name]: validationError
        }));
      } else {
        setErrors(prevErrors => {
          const newErrors = { ...prevErrors };
          delete newErrors[e.target.name];
          return newErrors;
        });
      }
    },
    [requiredFields]
  );

  const isTabValid = (tabName: string): boolean => {
    const required_fields = requiredFields[tabName];

    if (!required_fields) return false;

    if (required_fields.every(field => field === '')) {
      return true;
    }

    if (tabName === `PERSONAL INFO` && !acceptedFiles) {
      console.log(`file upload is invalid: `, acceptedFiles);
      return false;
    }

    for (let field of required_fields) {
      const fieldValue = formData[field as keyof typeof formData];

      if (
        typeof fieldValue === 'string' &&
        !(fieldValue in Enums) &&
        !exemptFields.includes(field) &&
        fieldValue.trim().length < 3
      ) {
        console.log(`field ${field} is invalid (string): `, fieldValue);
        return false;
      }

      if (typeof fieldValue === 'boolean' && fieldValue === null) {
        console.log(`field ${field} is invalid (boolean): `, fieldValue);
        return false;
      }

      if (!fieldValue) {
        return false;
      } else if (typeof fieldValue === 'string' && !fieldValue.trim()) {
        console.log(`field ${field} is invalid (empty string): `, fieldValue);
        return false;
      } else if (Array.isArray(fieldValue) && fieldValue.length === 0) {
        console.log(`field ${field} is invalid (empty array): `, fieldValue);
        return false;
      }

      const validationError = validateField(field, fieldValue, true);
      if (validationError) {
        console.log(`validationError for field ${field}: `, validationError);
        return false;
      }
    }

    return true;
  };
  

  // TABS
  const MentorWelcomeTab = () => (
    <div className="px-4 overflow-y-auto min-h-[496px]">
      <div className="text-xl font-bold text-purple-900">Welcome</div>
      <div className="flex flex-col gap-4">
        <div className="pt-8">
          Welcome to the Reality Hack 2024 participant application form. Please
          fill out this form to apply for a spot at Reality Hack 2024. For all
          applications-related questions, contact{' '}
          <Link href="mailto:apply@mitrealityhack.com">
            <span className="text-themePrimary">apply@mitrealityhack.com</span>
          </Link>
          .
        </div>

        <div className="py-4">
          For general inquiries, contact{' '}
          <Link href="team@mitrealityhack.com">
            <span className="text-themePrimary">team@mitrealityhack.com</span>
          </Link>
          .
        </div>
        <div className="pb-4">
          Please note that this form is not a commitment to attend Reality Hack
          2024. You will be notified of your acceptance status by email.
        </div>
        <div>
          You will receive a confirmation email when you complete the
          application submission.
        </div>

        <div className="py-4">
          All fields are required unless marked as optional.
        </div>
      </div>
    </div>
  );

  const DisclaimerTab = () => (
    <div className="px-4 overflow-y-auto min-h-[496px]">
      <div className="text-xl font-bold text-purple-900">Disclaimers</div>
      <div className="flex flex-col gap-4">
        <div className="pt-8">
          We encourage all participants to form new connections with cool
          creative people that they&apos;ve never worked with before.
        </div>
        <div>
          Please do not apply as a representative for a group, or plan to attend
          with the condition that your friends or co-workers are accepted.
        </div>

        <div>
          More information will be announced in the Rules as we get closer to
          the event.
        </div>

        <div className="pt-4">
          <CheckboxInput
            name="disclaimer_groups"
            value={formData.disclaimer_groups?.toString() || ''}
            checked={!!formData.disclaimer_groups}
            label="I understand and accept the above disclaimer."
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.disclaimer_groups}
          />
        </div>
        <div className="border border-gray-200 border-1"></div>
        <div>
          Our participants are literally building the future by making their
          work available for further development.
        </div>

        <div>
          Therefore, all projects built during the hackathon will be released
          under an open source license (see opensource.org).
        </div>

        <div className="pt-4 pb-6">
          <CheckboxInput
            name="disclaimer_open_source"
            value={formData.disclaimer_open_source?.toString() || ''}
            checked={!!formData.disclaimer_open_source}
            label="I understand and accept the above disclaimer."
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.disclaimer_open_source}
          />
        </div>
      </div>
    </div>
  );

  const MentorExperienceTab = () => (
    <div>Have you mentored a hackathon before? Please note that this is not a requirement to become a mentor.</div>
  )

  const Closing = () => (
    <div>
      <div>How did you hear about Reality Hack? Select all that apply. (Optional)</div>
      <div>Help us reach more communities that matter! What are your favorite online groups (LinkedIn, Discord, etc.) 
        related to XR, creative technology, or social justice and accessibility? All languages welcome! 
        [Optional, Long answer box]</div>
    </div>
  )

  

  const tabs = [
    <MentorWelcomeTab key={0} />,
    <DisclaimerTab key={1} />,
    <PersonalInformationForm
      key={2}
      formData={formData}
      setFormData={setFormData}
      handleBlur={handleBlur}
      handleChange={handleChange}
      errors={errors}
      acceptedFiles={acceptedFiles}
      setAcceptedFiles={setAcceptedFiles}
      rejectedFiles={rejectedFiles}
      setRejectedFiles={setRejectedFiles}
      countries={countries}
      nationalities={nationalities}
    />,
    <MentorExperienceTab />,
    <Closing />,
    <ReviewPage allInfo={formData} acceptedFiles={acceptedFiles}/>,
  ];
  const tabNames = [
    'WELCOME',
    'DISCLAIMERS',
    'PERSONAL INFO',
    'DIVERSITY & INCLUSION',
    'EXPERIENCE',
    'CLOSING',
    'REVIEW & SUBMIT'
  ];

  return (
    <AnyApp
      key="1"
      tabs={tabs}
      tabNames={tabNames}
      AppType="Mentor"
      formData={formData}
      isTabValid={isTabValid}
      acceptedFiles={acceptedFiles}
    />
  );
};

export default MentorApp;
