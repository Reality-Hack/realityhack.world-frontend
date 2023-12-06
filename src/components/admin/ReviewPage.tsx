import {
  age_group,
  digital_designer_skills,
  disabilities,
  gender_identity,
  hardware_hack_interest,
  heard_about_us,
  participation_capacity,
  previous_participation,
  race_ethnic_group
} from '@/types/application_form_types';
import { participation_role } from '@/types/types';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { CheckboxInput } from '../Inputs';
import { heardAboutUsLabels } from '../applications/ClosingForm';
import {
  disabilitiesLabels,
  genderIdentityLabels,
  raceEthnicGroupLabels
} from '../applications/DiversityInclusionForm';
import {
  DesignSkillsLabels,
  previousParticipationLabels
} from '../applications/ExperienceInterestForm';
import { ageGroupLabels } from '../applications/PersonalInformationForm';
import { hardwareHackLabels } from '../applications/ThematicForm';
import { useSession } from 'next-auth/react';

export default function ReviewPage({
  allInfo,
  acceptedFiles
}: {
  allInfo: any;
  acceptedFiles?: File[];
}) {
  const { data: session, status } = useSession();

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
    label: string;
    value: string | string[];
  }) => {
    const labelToEnumKeyMap: any = {
      'What race or ethnic group(s) do you identify with?': 'race_ethnic_group',
      'How would you describe your gender identity?': 'gender_identity',
      'Disability Status': 'disabilities',
      'What design skills are you proficient in?': 'digital_designer_skills',
      'Have you participated in the MIT RH Hack before?':
        'previous_participation',
      'How did you hear about Reality Hack?': 'heard_about_us'
    };

    const renderValue = (val: string | string[]) => {
      if (
        (Array.isArray(val) && val.length === 0) ||
        (!Array.isArray(val) && val === '')
      ) {
        return <div>[none]</div>;
      }

      const otherValues: JSX.Element[] = [];
      const listItems = Array.isArray(val)
        ? val
            .map((item, index) => {
              if (item === 'Other') {
                const enumKey = labelToEnumKeyMap[label];
                const otherValueKey = `${enumKey}_other`;
                const otherValue = allInfo[otherValueKey];
                if (otherValue) {
                  otherValues.push(
                    <div key={`other-${index}`}>Other: {otherValue}</div>
                  );
                  return null;
                }
              }
              return <div key={index}> {item}</div>;
            })
            .filter(Boolean)
        : [<div key="single-value">{val}</div>];

      return (
        <>
          {listItems}
          {otherValues.length > 0 ? otherValues : null}
        </>
      );
    };

    return (
      <div>
        <div className="text-md">{label}</div>
        <div className="text-sm text-gray-500 break-words">
          {renderValue(value)}
        </div>
      </div>
    );
  };

  const getLabelFromEnumValue = (
    enumValue: string,
    enumObject: any,
    labelsObject: any
  ) => {
    const enumKey = Object.keys(enumObject).find(
      key => enumObject[key] === enumValue
    );
    return enumKey ? labelsObject[enumKey] : enumValue;
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
            onChange={() => {}}
            label={'I understand and accept the above disclaimer'}
          />
        </div>

        <div className="flex flex-col gap-4 py-2 border-t-2 border-gray-200">
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
              onChange={() => {}}
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
          value={`${allInfo.first_name} ${
            allInfo.middle_name ? allInfo.middle_name + ' ' : ''
          }${allInfo.last_name}`}
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
          value={allInfo.nationality_option || allInfo.nationality}
        />
        <LabelAndValue
          label={'Which country do you reside in?'}
          value={allInfo.current_country_option || allInfo.current_country}
        />
        <LabelAndValue
          label={'What city are you based in?'}
          value={allInfo.current_city}
        />
        <LabelAndValue
          label={'What age will you be as of January 25, 2024?'}
          value={
            allInfo.age_group
              ? getLabelFromEnumValue(
                  allInfo.age_group,
                  age_group,
                  ageGroupLabels
                )
              : '[none]'
          }
        />
      </div>
    );
  };

  const DEIInfoSection = () => {
    return (
      <div className="flex flex-col gap-4">
        <LabelAndValue
          label={'How would you describe your gender identity?'}
          value={
            Array.isArray(allInfo.gender_identity)
              ? allInfo.gender_identity.map((enumValue: string) =>
                  getLabelFromEnumValue(
                    enumValue,
                    gender_identity,
                    genderIdentityLabels
                  )
                )
              : allInfo.gender_identity
          }
        />

        <LabelAndValue
          label={'What race or ethnic group(s) do you identify with?'}
          value={
            Array.isArray(allInfo.race_ethnic_group)
              ? allInfo.race_ethnic_group.map((enumValue: string) =>
                  getLabelFromEnumValue(
                    enumValue,
                    race_ethnic_group,
                    raceEthnicGroupLabels
                  )
                )
              : allInfo.race_ethnic_group
          }
        />

        <LabelAndValue
          label={'Disability Status'}
          value={
            Array.isArray(allInfo.disabilities)
              ? allInfo.disabilities.map((enumValue: string) =>
                  getLabelFromEnumValue(
                    enumValue,
                    disabilities,
                    disabilitiesLabels
                  )
                )
              : allInfo.disabilities
          }
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
          value={
            (formatParticipation(allInfo.participation_capacity) as string) ||
            allInfo.participation_capacity
          }
        />

        <div>
          {allInfo.participation_capacity == participation_capacity.student ||
            (allInfo.participation_capacity == 'Student' && (
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
            ))}
          {allInfo.participation_capacity == participation_capacity.hobbyist ||
            allInfo.participation_capacity ==
              participation_capacity.professional ||
            ((allInfo.participation_capacity == 'Hobbist' ||
              allInfo.participation_capacity == 'Professional') && (
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
                  value={allInfo.industry}
                />
              </div>
            ))}
        </div>
        <div>
          <LabelAndValue
            label={'Have you participated in the MIT RH Hack before?'}
            value={allInfo.previously_participated === 'true' ? 'Yes' : 'No'}
          />
          {allInfo.previously_participated && (
            <>
              <br />
              <LabelAndValue
                label={'What years did you previously participate?'}
                value={
                  Array.isArray(allInfo.previous_participation)
                    ? allInfo.previous_participation.map((enumValue: string) =>
                        getLabelFromEnumValue(
                          enumValue,
                          previous_participation,
                          previousParticipationLabels
                        )
                      )
                    : allInfo.previous_participation
                }
              />
            </>
          )}
        </div>
        <div>
          {allInfo.participation_role === participation_role.designer && (
            <LabelAndValue
              label={'What design skills are you proficient in?'}
              value={
                Array.isArray(allInfo.digital_designer_skills)
                  ? allInfo.digital_designer_skills.map((enumValue: string) =>
                      getLabelFromEnumValue(
                        enumValue,
                        digital_designer_skills,
                        DesignSkillsLabels
                      )
                    )
                  : allInfo.digital_designer_skills
              }
            />
          )}
          <br />
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
              value={allInfo.experience_with_xr}
            />
            <br />
            <br />
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
          value={
            allInfo.hardware_hack_interest
              ? getLabelFromEnumValue(
                  allInfo.hardware_hack_interest,
                  hardware_hack_interest,
                  hardwareHackLabels
                )
              : '[none]'
          }
        />
      </div>
    );
  };

  const Closing = () => {
    return (
      <div className="flex flex-col gap-4">
        <LabelAndValue
          label={'How did you hear about Reality Hack?'}
          value={
            Array.isArray(allInfo.heard_about_us)
              ? allInfo.heard_about_us.map((enumValue: string) =>
                  getLabelFromEnumValue(
                    enumValue,
                    heard_about_us,
                    heardAboutUsLabels
                  )
                )
              : allInfo.heard_about_us
          }
        />

        <LabelAndValue
          label={'What are your favorite online groups?'}
          value={allInfo.outreach_groups || '[none]'}
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
        {session ? (
          <div className="mb-4 text-2xl">Review Application</div>
        ) : (
          <>
            <div className="text-3xl font-bold text-purple-900">
              Review & Submit
            </div>
            <div className="mb-8 text-sm">
              Before submitting your application, please review your responses.
            </div>
          </>
        )}
        <div className="relative flex flex-col gap-4">
          {sections.map(section => (
            <div
              key={section.label}
              className="flex flex-col gap-2 pb-4 border-b-2 border-gray-400"
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
