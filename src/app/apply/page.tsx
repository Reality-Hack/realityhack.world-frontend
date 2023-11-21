/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CheckboxInput, validateField } from '@/components/Inputs';
import ClosingForm from '@/components/applications/ClosingForm';
import DiversityInclusionForm from '@/components/applications/DiversityInclusionForm';
import ExperienceInterestForm from '@/components/applications/ExperienceInterestForm';
import PersonalInformationForm from '@/components/applications/PersonalInformationForm';
import ThematicForm from '@/components/applications/ThematicForm';
import AnyApp from '@/components/applications/applicationAny';
import {
  digital_designer_skills,
  disabilities,
  disability_identity,
  form_data,
  gender_identity,
  participation_capacity,
  participation_role,
  race_ethnic_group
} from '@/types/application_form_types';
import type { NextPage } from 'next';
import Link from 'next/link';
import { getSkills } from '../api/skills';
import { applicationOptions } from '../api/application';
import ReviewPage from '@/components/admin/ReviewPage';

const Application: NextPage = ({}: any) => {
  const [acceptedFiles, setAcceptedFiles] = useState<any>(null);
  const [rejectedFiles, setRejectedFiles] = useState<any>(null);
  const [skills, setSkills] = useState<any>(null);
  const [countries, setCountries] = useState<any>(null);
  const [nationalities, setNationalities] = useState<any>(null);
  const [industries, setIndustries] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [options, setOptions] = useState<any>(null);
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
      'communications_platform_username',
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
    CLOSING: [''],
    'REVIEW & SUBMIT': ['']
  });

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
    industry: [],
    previously_participated: null,
    previous_participation: [],
    participation_role: null,
    proficient_languages: '',
    experience_with_xr: '',
    additional_skills: '',
    theme_essay: '',
    theme_essay_follow_up: '',
    hardware_hack_interest: null,
    heard_about_us: [],
    outreach_groups: null,
    gender_identity_other: null,
    race_ethnic_group_other: null,
    disabilities_other: null,
    digital_designer_skills_other: null,
    heard_about_us_other: null,
    current_country_option: null,
    nationality_option: null,
    industry_option: null
  });
  useEffect(() => {
    let updatedFormData = { ...formData };

    if (formData.previously_participated === 'false') {
      updatedFormData.previous_participation = [];
    }

    setFormData(updatedFormData);
  }, [formData.previously_participated]);

  useEffect(() => {
    let updatedFormData = { ...formData };

    if (formData.participation_role === participation_role.designer) {
      updatedFormData.digital_designer_skills = [];
    } else if (formData.participation_role === participation_role.developer) {
      updatedFormData.proficient_languages = '';
    } else if (formData.participation_role === participation_role.specialist) {
      updatedFormData.specialized_expertise = null;
    } else if (
      formData.participation_role === participation_role.project_manager
    ) {
      updatedFormData.additional_skills = '';
    }

    setFormData(updatedFormData);
  }, [formData.participation_role]);

  useEffect(() => {
    let updatedFormData = { ...formData };

    if (
      formData.participation_capacity === participation_capacity.student ||
      formData.participation_capacity === participation_capacity.professional ||
      formData.participation_capacity === participation_capacity.hobbyist
    ) {
      updatedFormData = {
        ...updatedFormData,
        student_school: null,
        student_field_of_study: null,
        occupation: null,
        employer: null,
        industry: [],
        industry_option: null
      };
    }

    setFormData(updatedFormData);
  }, [formData.participation_capacity]);

  useEffect(() => {
    const getData = async () => {
      const data = await getSkills();
      const options = await applicationOptions(formData);
      setOptions(options);
      setCountries(options.actions.POST.current_country.choices);
      setNationalities(options.actions.POST.nationality.choices);
      setIndustries(options.actions.POST.industry.choices);
      setSkills(data);
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

    if (tabName === 'PERSONAL INFO' && !acceptedFiles) {
      return false;
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

  useEffect(() => {
    const updatedExperience: string[] = [
      'participation_capacity',
      'participation_role',
      'previously_participated',
      ...(formData.participation_capacity === participation_capacity.student
        ? ['student_school', 'student_field_of_study']
        : formData.participation_capacity
        ? ['occupation', 'employer', 'industry']
        : []),
      ...(formData.previously_participated === 'true'
        ? ['previous_participation']
        : []),
      ...(formData.participation_role === participation_role.designer
        ? ['digital_designer_skills']
        : []),
      ...(formData.participation_role === participation_role.specialist
        ? ['specialized_expertise']
        : []),
      ...(formData.digital_designer_skills &&
      formData.digital_designer_skills.includes(digital_designer_skills.other)
        ? ['digital_designer_skills_other']
        : [])
    ];

    const updatedDiversityInclusion = [
      ...(formData.gender_identity &&
      formData.gender_identity.includes(gender_identity.other)
        ? ['gender_identity_other']
        : []),
      ...(formData.race_ethnic_group &&
      formData.race_ethnic_group.includes(race_ethnic_group.other)
        ? ['race_ethnic_group_other']
        : []),
      ...(formData.disability_identity &&
      formData.disability_identity === disability_identity.yes
        ? ['disabilities']
        : []),
      ...(formData.disabilities &&
      formData.disabilities.includes(disabilities.other)
        ? ['disabilities_other']
        : []),
      'gender_identity',
      'race_ethnic_group',
      'disability_identity'
    ];

    setRequiredFields(current => ({
      ...current,
      'DIVERSITY & INCLUSION': updatedDiversityInclusion,
      EXPERIENCE: updatedExperience
    }));
  }, [
    formData.participation_capacity,
    formData.previously_participated,
    formData.participation_role,
    formData.gender_identity,
    formData.race_ethnic_group,
    formData.heard_about_us,
    formData.disability_identity
  ]);

  const WelcomeTab = () => (
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

  const ReviewTab = () => (
    <div className="px-6">
      <p>Submit form</p>
    </div>
  );

  const ConfirmationTab = () => (
    <div className="px-6 h-[256px]">
      <p>{`Thank you for applying to MIT Reality Hack 2024, ${formData.first_name}! You should receive a confirmation email from us shortly.`}</p>
    </div>
  );

  // Define your tabs as an array of components or elements
  const tabs = [
    <WelcomeTab key={0} />,
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
    <DiversityInclusionForm
      key={3}
      formData={formData}
      handleBlur={handleBlur}
      handleChange={handleChange}
      errors={errors}
    />,
    <ExperienceInterestForm
      key={4}
      formData={formData}
      setFormData={setFormData}
      handleBlur={handleBlur}
      handleChange={handleChange}
      errors={errors}
      industries={industries}
    />,
    <ThematicForm
      key={5}
      formData={formData}
      handleBlur={handleBlur}
      handleChange={handleChange}
      errors={errors}
    />,
    <ClosingForm
      key={6}
      formData={formData}
      handleBlur={handleBlur}
      handleChange={handleChange}
      errors={errors}
    />,
    <ReviewPage key={7} allInfo={formData} acceptedFiles={acceptedFiles} />,
    <ConfirmationTab key={8} />
  ];
  const tabNames = [
    'WELCOME',
    'DISCLAIMERS',
    'PERSONAL INFO',
    'DIVERSITY & INCLUSION',
    'EXPERIENCE',
    'THEMATIC',
    'CLOSING',
    'REVIEW & SUBMIT'
  ];

  return (
    <AnyApp
      key="1"
      tabs={tabs}
      tabNames={tabNames}
      AppType="Hacker"
      formData={formData}
      isTabValid={isTabValid}
      acceptedFiles={acceptedFiles}
    />
  );
};

export default Application;
