/* eslint-disable no-console */
'use client';

import { CheckboxInput, validateField, RadioInput } from '@/components/Inputs';
import ClosingForm from '@/components/applications/ClosingForm';
import DiversityInclusionForm from '@/components/applications/DiversityInclusionForm';
import MentorSkillsExpertiseForm from '@/components/applications/MentorSkillsExpertiseForm';
import MentorPersonalInformationForm from '@/components/applications/MentorPersonalInformationForm';
import ThematicForm from '@/components/applications/ThematicForm';
import AnyApp from '@/components/applications/applicationAny';
import type { NextPage } from 'next';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
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
} from '../../../application_form_types';
import { applicationOptions } from '@/app/api/application';
import { getSkills } from "@/app/api/skills";
import ReviewPage from '@/components/admin/ReviewPage';

const JudgeApp: NextPage = ({ }: any) => {
  const [formData, setFormData] = useState<Partial<form_data>>({
    disclaimer_schedule: null,
    disclaimer_mindset: null,
    disclaimer_passion: null,
    first_name: '',
    middle_name: null,
    last_name: '',
    pronouns: '',
    email: '',
    communications_platform_username: '',
    portfolio: '',
    phone_number: '',
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
    industry: null,
    previously_participated: null,
    previously_mentored: null,
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
    'DIVERSITY & INCLUSION': [
      'gender_identity',
      'race_ethnic_group'
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
          We&apos;d like to make sure you understand our expectations for mentors.
          We are looking for someone who:
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

  const MentorExperienceTab = () => (
    <div className="px-4 overflow-y-auto min-h-[496px]">
      <div className="text-xl font-bold text-purple-900">Mentor Experience</div>
      <div className="flex flex-col gap-4">
        <p className="py-4">
          Have you mentored a hackathon before? Please note that this is not a requirement
          to become a mentor.
          <span className="font-bold text-themeSecondary">*</span>
        </p>
        <RadioInput
          name="previously_mentored"
          value="true"
          checked={formData.previously_mentored === 'true'}
          onChange={handleChange}
          label="Yes"
        />
        <RadioInput
          name="previously_mentored"
          value="false"
          checked={formData.previously_mentored === 'false'}
          onChange={handleChange}
          label="No"
        />
      </div>
    </div>
  );

  const tabs = [
    <MentorWelcomeTab key={0} />,
    <DisclaimerTab key={1} />,
    <MentorPersonalInformationForm
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
      showQuestion1={true}
      showQuestion2={true}
      showQuestion3={false}
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
    <MentorExperienceTab key={5} />,
    <ClosingForm
      key={6}
      formData={formData}
      handleBlur={handleBlur}
      handleChange={handleChange}
      errors={errors}
    />,
    <ReviewPage allInfo={formData} acceptedFiles={acceptedFiles} />,
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
      AppType="Mentor"
      formData={formData}
      isTabValid={isTabValid}
      acceptedFiles={acceptedFiles}
    />
  );
};

export default JudgeApp;