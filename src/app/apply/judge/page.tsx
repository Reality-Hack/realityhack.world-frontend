/* eslint-disable no-console */
'use client';

import { applicationOptions } from '@/app/api/application';
import { CheckboxInput, validateField } from '@/components/Inputs';
import ReviewPage from '@/components/admin/ReviewPage';
import AdditionalPersonalInformationForm from '@/components/applications/AdditionalPersonalInformationForm';
import ClosingForm from '@/components/applications/ClosingForm';
import DiversityInclusionForm from '@/components/applications/DiversityInclusionForm';
import MentorSkillsExpertiseForm from '@/components/applications/MentorSkillsExpertiseForm';
import AnyApp from '@/components/applications/applicationAny';
import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { form_data } from '../../../types/application_form_types';

const JudgeApp: NextPage = ({}: any) => {
  const [formData, setFormData] = useState<Partial<form_data>>({
    disclaimer_schedule: null,
    disclaimer_mindset: null,
    disclaimer_passion: null,
    judge_invited_by: null,
    judge_judging_steps: null,
    judge_previously_judged: null,
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
    participation_capacity: null,
    student_school: null,
    student_field_of_study: null,
    digital_designer_skills: [],
    specialized_expertise: null,
    occupation: null,
    qualification: null,
    expertise: null,
    walkthrough: null,
    employer: null,
    industry: [],
    previously_participated: null,
    previous_participation: [],
    participation_role: null,
    proficient_languages: '',
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
  const [requiredFields, setRequiredFields] = useState<
    Record<string, string[]>
  >({
    WELCOME: [''],
    DISCLAIMERS: ['disclaimer_schedule', 'disclaimer_mindset'],
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
    'DIVERSITY & INCLUSION': ['gender_identity', 'race_ethnic_group'],
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
  const [options, setOptions] = useState<any>(null);

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace('/');
    }
  }, []);

  useEffect(() => {
    const getData = async () => {
      const options = await applicationOptions(formData);
      setOptions(options);
      setIndustries(options.actions.POST.industry.choices);
    };
    getData();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue =
        'You have unsaved changes. Are you sure you want to leave?';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
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

      if (fieldTab !== undefined) {
        isFieldRequired = requiredFields[fieldTab].includes(fieldName);
      }

      const fieldOptions = options?.actions?.POST[fieldName];
      const maxLength = fieldOptions?.max_length;

      const validationError = validateField(
        fieldType,
        e.target.value,
        isFieldRequired,
        false,
        maxLength
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
    },
    [requiredFields, options]
  );

  const isTabValid = (tabName: string): boolean => {
    const required_fields = requiredFields[tabName];

    if (!required_fields) return false;

    if (required_fields.every(field => field === '')) {
      return true;
    }

    for (let field of required_fields) {
      const fieldValue = formData[field as keyof typeof formData];
      const fieldOptions = options?.actions?.POST[field];
      const maxLength = fieldOptions?.max_length || 0;

      const fieldType = fieldOptions?.type || 'text';
      const validationError = validateField(
        fieldType,
        fieldValue,
        true,
        false,
        maxLength
      );

      if (validationError) {
        return false;
      }

      if (typeof fieldValue === 'string' && fieldValue.trim().length < 1) {
        return false;
      } else if (Array.isArray(fieldValue) && fieldValue.length === 0) {
        return false;
      } else if (typeof fieldValue === 'boolean' && fieldValue === null) {
        return false;
      } else if (!fieldValue) {
        return false;
      }
    }

    return true;
  };

  // TABS
  const JudgeWelcomeTab = () => (
    <div className="px-4 overflow-y-auto min-h-[496px]">
      <div className="text-xl font-bold text-purple-900">Welcome</div>
      <div className="flex flex-col gap-4">
        <div className="pt-8">
          Welcome to the Reality Hack 2024 judge application form. Please fill
          out this form to apply for a spot at Reality Hack 2024. For all
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
          We&apos;d like to make sure you understand our expectations for
          mentors. We are looking for someone who:
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
            name="disclaimer_schedule"
            value={formData.disclaimer_schedule?.toString() || ''}
            checked={!!formData.disclaimer_schedule}
            label="Is willing to work on a hackers schedule. Our participants are so committed XR
            innovation, that they often work well into the night. We'd love mentors to be with
            them on that journey - especially the evening before the deadline."
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.disclaimer_schedule}
          />
        </div>
        <div className="pt-4">
          <CheckboxInput
            name="disclaimer_mindset"
            value={formData.disclaimer_mindset?.toString() || ''}
            checked={!!formData.disclaimer_mindset}
            label="Has a solutions-driven mindset. Our participants are literally building the future
            in 5 days. They need all the help they can get."
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.disclaimer_mindset}
          />
        </div>
        <div className="pt-4">
          <CheckboxInput
            name="disclaimer_passion"
            value={formData.disclaimer_passion?.toString() || ''}
            checked={!!formData.disclaimer_passion}
            label="Has a contagious passion for spatial computing."
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.disclaimer_passion}
          />
        </div>
      </div>
    </div>
  );

  const tabs = [
    <JudgeWelcomeTab key={0} />,
    <AdditionalPersonalInformationForm
      key={2}
      formData={formData}
      handleBlur={handleBlur}
      handleChange={handleChange}
      errors={errors}
    />,
    <DiversityInclusionForm
      key={3}
      formData={formData}
      handleBlur={handleBlur}
      handleChange={handleChange}
      errors={errors}
    />,
    <MentorSkillsExpertiseForm
      key={4}
      formData={formData}
      setFormData={setFormData}
      handleChange={handleChange}
      handleBlur={handleBlur}
      errors={errors}
      industries={industries}
    />,
    <ClosingForm
      key={6}
      formData={formData}
      handleBlur={handleBlur}
      handleChange={handleChange}
      errors={errors}
    />,
    <ReviewPage allInfo={formData} acceptedFiles={acceptedFiles} />
  ];
  const tabNames = [
    'WELCOME',
    'DISCLAIMERS',
    'PERSONAL INFO',
    'DIVERSITY & INCLUSION',
    'SKILLS & EXPERTISE',
    'MENTOR EXPERIENCE',
    'CLOSING',
    'REVIEW & SUBMIT'
  ];

  return (
    <AnyApp
      key="1"
      tabs={tabs}
      tabNames={tabNames}
      AppType="Judge"
      formData={formData}
      isTabValid={isTabValid}
      acceptedFiles={acceptedFiles}
    />
  );
};

export default JudgeApp;
