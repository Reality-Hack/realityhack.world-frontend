import React from 'react';
import { SelectChangeEvent } from '@mui/material';
import { CheckboxInput } from '../Inputs';
import { participation_capacity } from '@/application_form_types';
import { participation_role } from '@/types';
import AttachFileIcon from '@mui/icons-material/AttachFile';

export default function ReviewPage({
  allInfo,
  acceptedFiles
}: {
  allInfo: any;
  acceptedFiles?: File[];
}) {
  const formatParticipation = (participationType: string) => {
    switch (participationType) {
      case participation_capacity.professional:
        return 'Professional';
      case participation_capacity.student:
        return 'Student';
      case participation_capacity.hobbyist:
        return 'Hobbyist';
    }
  };
  const LabelAndValue = ({
    label,
    value = ''
  }: {
    label: String;
    value: String;
  }) => {
    return (
      <div>
        <div className="text-md">{label}</div>
        <div className="text-sm text-gray-500">{value}</div>
      </div>
    );
  };

  const Disclaimers = () => {
    return (
      <div className="flex flex-col gap-4 mb-4">
        <div>
          We encourage all participants to form new connections with cool
          creative people that they&apos;ve never worked with before.
        </div>
        <div>
          Please do not apply as a representative for a group, or plan to attend
          with the condition that your friends or co-workers are accepted.
        </div>
        <div>
          More information will be announced in the Rules as we get closers to
          the event.
        </div>

        <div className="flex flex-row items-center gap-4 p-1 bg-blue-50 w-fit">
          <CheckboxInput
            checked={true}
            name={'name'}
            value=""
            onChange={() => console.log('nothing')}
            label={'I understand and accept the above disclaimer'}
          />
        </div>

        <div className="flex flex-col gap-4 border-t-2 border-gray-200 py-2">
          <div>
            Our participants are literally building the future by making their
            work available for further development.
          </div>
          <div>
            Therefore, all projects build during the hackathon will be released
            under an open source license (see{' '}
            <span className="text-blue-500 hover:cursor-pointer hover:underline">
              <a href="https://opensource.org" target="_blank">
                opensource.org
              </a>
            </span>
            )
          </div>
          <div className="flex flex-row items-center gap-2 p-1 bg-blue-50 w-fit">
            <CheckboxInput
              checked={true}
              name={'name'}
              value=""
              onChange={() => console.log('nothing')}
              label={'I understand and accept the above disclaimer'}
            />
          </div>
        </div>
      </div>
    );
  };

  const BasicInfoAndDem = () => {
    return (
      <div className="flex flex-col gap-4">
        <LabelAndValue label="Email Address" value={allInfo.email} />
        <LabelAndValue
          label="Full Name"
          value={`${allInfo.first_name} ${allInfo.middle_name} ${allInfo.last_name}`}
        />
        <LabelAndValue
          label="What should we call you?"
          value={allInfo.first_name}
        />
        <LabelAndValue label="Pronouns to use" value={allInfo.pronouns} />
        <LabelAndValue
          label="Link to portfolio or personal website"
          value={allInfo.communications_platform_username}
        />
        <LabelAndValue
          label="Link to your porfolio"
          value={allInfo.portfolio}
        />
        <div>
          <div>Resume</div>
          <div className="flex flex-row items-center ml-2">
            <AttachFileIcon className="w-4 text-gray-400" />
            <div>{acceptedFiles && acceptedFiles[0].name}</div>
          </div>
        </div>
      </div>
    );
  };

  const Demographics = () => {
    return (
      <div className="flex flex-col gap-4">
        <LabelAndValue
          label={'What is your nationality?'}
          value={allInfo.nationality_option}
        />
        <LabelAndValue
          label={'Which country do you reside in?'}
          value={allInfo.current_country_option}
        />
        <LabelAndValue
          label={'What city are you based in?'}
          value={allInfo.current_city}
        />
        <LabelAndValue
          label={'What age will you be as of January 25, 2024?'}
          value={allInfo.age_group} //FIX THIS
        />
      </div>
    );
  };

  const DEIInfoSection = () => {
    return (
      <div className="flex flex-col gap-4">
        <LabelAndValue
          label={'How would you describe your gender identity?'}
          value={Object.values(allInfo.gender_identity).join(' , ')}
        />
        <LabelAndValue
          label={'What race or ethnic group(s) do you identify with?'}
          value={Object.values(allInfo.race_ethnic_group).join(' , ')}
        />
        <LabelAndValue
          label={'Disabiliy Status'}
          value={Object.values(allInfo.disabilities).join(' , ')}
        />
      </div>
    );
  };

  const ExperienceAndInterestSection = () => {
    return (
      <div className="flex flex-col gap-4">
        {/* Experience and Interest content */}
        <LabelAndValue
          label={'Which of the following best describes you?'}
          value={formatParticipation(allInfo.participation_capacity) as string}
        />

        <div>
          {allInfo.participation_capacity == participation_capacity.student && (
            <div className="flex flex-col gap-4">
              <LabelAndValue
                label={'What is the name of your school?'}
                value={allInfo.student_school}
              />
              <LabelAndValue
                label={
                  'If you are attending a higher education institution, what is your field of study?'
                }
                value={allInfo.student_field_of_study}
              />
            </div>
          )}
          {allInfo.participation_capacity == participation_capacity.hobbyist ||
            (allInfo.participation_capacity ==
              participation_capacity.professional && (
              <div className="flex flex-col gap-4">
                <LabelAndValue
                  label={'What is your current occupation?'}
                  value={allInfo.occupation}
                />
                <LabelAndValue
                  label={'What company do you currently work for?'}
                  value={allInfo.employer}
                />
                <LabelAndValue
                  label={'What industry represents your expertise?'}
                  value={allInfo.industry_option}
                />
              </div>
            ))}
        </div>
        <div>
          <LabelAndValue
            label={'Have you participated in the MIT RH Hack before?'}
            value={allInfo.previously_participated ? 'Yes' : 'No'}
          />
          {allInfo.previously_participated && (
            <LabelAndValue
              label={'What years did you previously participate?'}
              value={Object.values(allInfo.previous_participation).join(' , ')}
            />
          )}
        </div>
        <div>
          {allInfo.participation_role === participation_role.designer && (
            <LabelAndValue
              label={'What design skills are you proficient in?'}
              value={allInfo.digital_designer_skills}
            />
          )}
          {allInfo.participation_role === participation_role.developer && (
            <LabelAndValue
              label={
                'What platforms and programming languages are you already proficient with?'
              }
              value={allInfo.proficient_languages}
            />
          )}
          {allInfo.participation_role === participation_role.specialist && (
            <LabelAndValue
              label={'What are your areas or skills of expertise?'}
              value={allInfo.specialized_expertise}
            />
          )}
          <div className="flex flex-col gap-2">
            <LabelAndValue
              label={
                'Can you demonstrate familiarity with any tools related to design or development for XR? If so, please list.'
              }
              value={allInfo.xr_familiarity_tools}
            />
            <LabelAndValue
              label={
                "Do you have any other skills or experiences that you'd like to tell us about?"
              }
              value={allInfo.additional_skills}
            />
          </div>
        </div>
      </div>
    );
  };

  const ThematicSection = () => {
    return (
      <div className="flex flex-col gap-4">
        <LabelAndValue
          label={
            'Our theme for 2024 is “Connection”. From letting people embody avatars that they connect with or even giving people the ability to feel closer to friends and family at great distance, Connection can mean different things to different people. What does Connection mean to you?'
          }
          value={allInfo.theme_essay}
        />
        <LabelAndValue
          label={
            'How do you think XR technologies can help us with “Connection”? (Long answer)'
          }
          value={allInfo.theme_essay_follow_up}
        />
        <LabelAndValue
          label={
            'Would you be interested in participating in the hardware hack this year?'
          }
          value={allInfo.hardware_hack_interest}
        />
      </div>
    );
  };

  const Closing = () => {
    return (
      <div className="flex flex-col gap-4">
        <LabelAndValue
          label={'How did you hear about Reality Hack?'}
          value={`${allInfo.heard_about_us.join(' , ')} ${
            allInfo.heard_about_us_other
              ? `${allInfo.heard_about_us} ${allInfo.heard_about_us_other}`
              : ''
          }`}
        />
        <LabelAndValue
          label={'What are your favorite online groups?'}
          value={allInfo.outreach_groups}
        />
      </div>
    );
  };

  const RSVP = () => {
    return (
      <div>
        <LabelAndValue
          label={'What unisex t-shirt size do you wear?'}
          value={''}
        />
        <LabelAndValue
          label={
            'Discord will be our primary communications platform before and during the event. What is your Discord username?'
          }
          value={'e'}
        />
        <LabelAndValue
          label={'List any dietary restrictions you may have. (Optional)'}
          value={'d'}
        />
        <LabelAndValue
          label={
            'Tell us about any accommodations you may need in order to be able to attend our event. (Optional)'
          }
          value={'c'}
        />
        <LabelAndValue
          label={
            'A phone number we can reach you at during the MIT Reality Hack event:'
          }
          value={'b'}
        />
        <LabelAndValue
          label={'Please provide an emergency contact:'}
          value={'a'}
        />
        <LabelAndValue
          label={
            '(For those under 18, file upload) As you will be under 18 when the event starts on January 12, 2023, we require the completion of a Parental Consent and Release Form. Please download this form, complete it, and upload it here.'
          }
          value={'ues'}
        />
        <LabelAndValue
          label={
            'Do you require a letter of support for a US visa application?'
          }
          value={'Yes'}
        />
        <LabelAndValue
          label={
            'Please fill out the following information for your US visa application support letter. A member of our team will email you a letter to support your visa application.'
          }
          value={'Yes'}
        />
      </div>
    );
  };

  const sections = [
    { label: 'Disclaimers', component: <Disclaimers /> },
    { label: 'Contact and Personal Info ', component: <BasicInfoAndDem /> },
    { label: 'Demographics', component: <Demographics /> },
    {
      label: 'Diversity and Inclusion Information',
      component: <DEIInfoSection />
    },
    {
      label: 'Experience and Interest',
      component: <ExperienceAndInterestSection />
    },
    { label: 'Thematic', component: <ThematicSection /> },
    { label: 'Closing', component: <Closing /> }
    // { label: 'RSVP', component: <RSVP /> }
  ];

  return (
    <div>
      <div className="flex flex-col gap-2 p-4">
        <div className="text-3xl text-purple-900 font-bold">
          Review & Submit
        </div>
        <div className="text-sm mb-8">
          Before submitting your application, please review your responses.
        </div>
        <div className="flex flex-col gap-4">
          {sections.map(section => (
            <div
              key={section.label}
              className="border-b-2 border-gray-400 pb-4 flex flex-col gap-2"
            >
              <div className="text-xl font-bold">{section.label}</div>
              {section.component}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// components/CustomSelect.tsx
