/* eslint-disable no-console */
'use client';

import { validateField } from '@/components/Inputs';
import ClosingForm from '@/components/applications/ClosingForm';
import DiversityInclusionForm from '@/components/applications/DiversityInclusionForm';
import SkillsExpertiseForm from '@/components/applications/SkillsExpertiseForm';
import AdditionalPersonalInformationForm from '@/components/applications/AdditionalPersonalInformationForm';
import AnyApp from '@/components/applications/applicationAny';
import type { NextPage } from 'next';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import { form_data } from '../../../types/application_form_types';
import { applicationOptions } from '@/app/api/application';
import ReviewPage from '@/components/admin/ReviewPage';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const JudgeApp: NextPage = ({}: any) => {
  const [formData, setFormData] = useState<Partial<form_data>>({
    participation_class: 'J',
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
    gender_identity: [],
    race_ethnic_group: [],
    participation_capacity: null,
    specialized_expertise: null,
    occupation: null,
    qualification: null,
    expertise: null,
    employer: null,
    industry: [],
    previously_participated: null,
    previous_participation: [],
    participation_role: null,
    proficient_languages: '',
    additional_skills: '',
    heard_about_us: [],
    outreach_groups: null,
    gender_identity_other: null,
    digital_designer_skills_other: null,
    heard_about_us_other: null,
    industry_option: null,
    hardware_hack_interest: null,
    current_country: [],
    nationality: [],
    digital_designer_skills: [],
  });
  // TODO: move to RSVP
  // disabilities: []

  const [requiredFields, _setRequiredFields] = useState<
    Record<string, string[]>
  >({
    WELCOME: [''],
    'PERSONAL INFO': [
      'first_name',
      'last_name',
      'email',
      'pronouns',
      'communications_platform_username',
      'portfolio'
    ],
    'DIVERSITY & INCLUSION': ['gender_identity', 'race_ethnic_group'],
    'SKILLS & EXPERTISE': [
      'occupation',
      'employer',
      'industry',
      'judge_judging_steps',
      'judge_previously_judged'
    ],
    CLOSING: [''],
    'REVIEW & SUBMIT': ['']
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
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
          Thank you for your interest to be a Judge at MIT Reality Hack 2024.
          For all judge-related questions, contact{' '}
          <Link href="mailto:catherine@mitrealityhack.com">
            <span className="text-themePrimary">
              catherine@mitrealityhack.com
            </span>
          </Link>
          .
        </div>

        <div className="pb-4">
          Please note that this form is not a commitment to attend MIT Reality
          Hack 2024 as a judge. Our team will reach out to you about your
          interest to confirm your participation.
        </div>
        <div>
          You will receive a confirmation email when you complete the Interest
          Form submission.
        </div>

        <div className="py-4">
          All fields are required unless marked as optional.
        </div>
      </div>
    </div>
  );

  const ConfirmationTab = () => (
    <div className="px-6 h-[256px]">
      <p>{`Thank you for submitting your interest to be a Judge at MIT Reality Hack 2024, ${formData.first_name}! You should receive a confirmation email from us shortly.`}</p>
    </div>
  );

  const tabs = [
    <JudgeWelcomeTab key={0} />,
    <AdditionalPersonalInformationForm
      key={1}
      formData={formData}
      handleBlur={handleBlur}
      handleChange={handleChange}
      errors={errors}
    />,
    <DiversityInclusionForm
      key={2}
      formData={formData}
      handleBlur={handleBlur}
      handleChange={handleChange}
      errors={errors}
    />,
    <SkillsExpertiseForm
      key={3}
      formData={formData}
      setFormData={setFormData}
      handleChange={handleChange}
      handleBlur={handleBlur}
      errors={errors}
      industries={industries}
    />,
    <ClosingForm
      key={4}
      formData={formData}
      handleBlur={handleBlur}
      handleChange={handleChange}
      errors={errors}
    />,
    <ReviewPage key={5} allInfo={formData} />,
    <ConfirmationTab key={6} />
  ];
  const tabNames = [
    'WELCOME',
    'PERSONAL INFO',
    'DIVERSITY & INCLUSION',
    'SKILLS & EXPERTISE',
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
    />
  );
};

export default JudgeApp;
