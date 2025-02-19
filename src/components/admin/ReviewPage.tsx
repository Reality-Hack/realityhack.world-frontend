import {
  age_group,
  digital_designer_skills,
  theme_interest_track_choice,
  gender_identity,
  hardware_hack_interest,
  hardware_hack_detail,
  heard_about_us,
  participation_capacity,
  previous_participation,
  race_ethnic_group
} from '@/types/application_form_types';
import { participation_role } from '@/types/types';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useSession } from 'next-auth/react';
import { CheckboxInput } from '../Inputs';
import { heardAboutUsLabels } from '../applications/ClosingForm';
import {
  genderIdentityLabels,
  raceEthnicGroupLabels
} from '../applications/DiversityInclusionForm';
import {
  DesignSkillsLabels,
  previousParticipationLabels,
} from '../applications/ExperienceInterestForm';
import { ageGroupLabels } from '../applications/PersonalInformationForm';
import {
  hardwareHackDetailLabels,
  hardwareHackLabels
} from '../applications/ThematicForm';
// TODO: move to RSVP
//   disabilitiesLabels,

export default function ReviewPage({
  allInfo,
  acceptedFiles
}: {
  allInfo: any;
  acceptedFiles?: File[];
}) {
  const { data: session } = useSession();

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
    if (
      allInfo.participation_class === 'P' ||
      allInfo.participation_class === 'Participant' ||
      !allInfo.participation_class
    ) {
      return (
        <div className="flex flex-col gap-4 mb-4">
          <div>
            We encourage all participants to form new connections with cool
            creative people that they&apos;ve never worked with before.
          </div>
          <div>
            Please do not apply as a representative for a group, or plan to
            attend with the condition that your friends or co-workers are
            accepted.
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
              Therefore, all projects build during the hackathon will be
              released under an open source license (see{' '}
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
    } else if (
      allInfo.participation_class === 'M' ||
      allInfo.participation_class === 'Mentor'
    ) {
      return (
        <div className="flex flex-col gap-4 mb-4">
          <div>
            We&apos;d like to make sure you understand our expectations for
            mentors. We are looking for someone who:
          </div>

          <div className="border border-gray-200 border-1"></div>
          <div className="flex flex-row items-center gap-4 p-1">
            <CheckboxInput
              checked={true}
              name={'name'}
              value=""
              onChange={() => {}}
              label="Is willing to work on a hackers schedule and is available 
              to attend from January 23-26, 2025 (attending on January 27 is 
              optional for mentors). Our participants are so committed to 
              experiential technology innovation, that they often work well 
              into the night. We&apos;d love mentors to be with them on that journey 
              - especially the evening before the deadline."
            />
          </div>
          <div className="border border-gray-200 border-1"></div>
          <div className="flex flex-row items-center gap-2 p-1">
            <CheckboxInput
              checked={true}
              name={'name'}
              value=""
              onChange={() => {}}
              label="Has a solutions-driven mindset. Our participants are literally
                building the future in 5 days. They need all the help they can get."
            />
          </div>
          <div className="border border-gray-200 border-1"></div>
          <div className="flex flex-row items-center gap-2 p-1">
            <CheckboxInput
              checked={true}
              name={'name'}
              value=""
              onChange={() => {}}
              label="Has a contagious passion for experiential technology, including 
             spatial computing, AI, ML, edge computing, etc."
            />
          </div>
        </div>
      );
    }
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
        {allInfo.participation_class === 'P' ||
          allInfo.participation_class === 'Participant' ||
          (!allInfo.participation_class && (
            <div>
              <div>Resume</div>
              <div className="flex flex-row items-center ml-2">
                <AttachFileIcon className="w-4 text-gray-400" />
                <div>{acceptedFiles && acceptedFiles[0].name}</div>
              </div>
            </div>
          ))}
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
          label={'What age will you be as of January 23, 2025?'}
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
        {/* {(allInfo.participation_class === 'P' ||
          allInfo.participation_class === 'Participant' ||
          !allInfo.participation_class) && (
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
        )} */}
      </div>
    );
  };

  const ExperienceAndInterestSection = () => {
    if (
      allInfo.participation_class === 'P' ||
      allInfo.participation_class === 'Participant' ||
      !allInfo.participation_class
    ) {
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
            {allInfo.participation_capacity ==
              participation_capacity.hobbyist ||
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
                      ? allInfo.previous_participation.map(
                          (enumValue: string) =>
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
            {(allInfo.participation_role === participation_role.specialist ||
              allInfo.participation_role === participation_role.developer) && (
              <LabelAndValue
                label={
                  allInfo.participation_role === participation_role.specialist
                    ? 'What are your areas or skills of expertise?'
                    : 'List what programming languages and platforms you are proficient with.'
                }
                value={allInfo.specialized_expertise}
              />
            )}
            <br />
            <div className="flex flex-col gap-2">
              <LabelAndValue
                label={
                  'Can you demonstrate familiarity with any tools related to design or development for XR? If so, please list.'
                }
                value={allInfo.experience_with_xr}
              />
              <br />
              <LabelAndValue
                label={
                  'MIT Reality Hack is a fast-paced event that harness a variety of talents from participants to create something entirely new in a very short period of time. How do you envision your role in this environment and how will you contribute to your team?'
                }
                value={allInfo.experience_contribution}
              />
              <br />
              <br />
            </div>
          </div>
        </div>
      );
    } else if (
      allInfo.participation_class === 'M' ||
      allInfo.participation_class === 'Mentor'
    ) {
      return (
        <div className="flex flex-col gap-4">
          <div>
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
          </div>
          <div>
            <LabelAndValue
              label={'List the areas you are most qualified to mentor in.'}
              value={allInfo.mentor_qualified_fields}
            />
          </div>
          <div>
            <LabelAndValue
              label={'Any related hardware that you may be willing to bring?'}
              value={allInfo.theme_essay_follow_up}
            />
          </div>
          <div>
            <LabelAndValue
              label={
                'Walk us through the steps you would take to help someone debug an issue.'
              }
              value={allInfo.mentor_mentoring_steps}
            />
          </div>
          <div>
            <LabelAndValue
              label={
                'Have you mentored a hackathon before? Please note that this is not a requirement to become a mentor.'
              }
              value={
                allInfo.mentor_previously_mentored === 'true' ? 'Yes' : 'No'
              }
            />
          </div>
        </div>
      );
    } else if (
      allInfo.participation_class === 'J' ||
      allInfo.participation_class === 'Judge'
    ) {
      return (
        <div className="flex flex-col gap-4">
          <div>
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
          </div>
          <div>
            <LabelAndValue
              label={'Please describe your expertise with the above areas.'}
              value={allInfo.mentor_qualified_fields}
            />
          </div>
          <div>
            <LabelAndValue
              label={'Walk us through how you would judge a hackathon project.'}
              value={allInfo.judge_judging_steps}
            />
          </div>
          <div>
            <LabelAndValue
              label={
                'If you were invited to be a judge by someone from MIT Reality Hack, please enter their name:'
              }
              value={allInfo.judge_invited_by}
            />
          </div>
          <div>
            <LabelAndValue
              label={
                'Have you judged a hackathon before? Please note that this is not a requirement to become a judge.'
              }
              value={allInfo.judge_previously_judged === 'true' ? 'Yes' : 'No'}
            />
          </div>
        </div>
      );
    }
  };

  const ThematicSection = () => {
    return (
      <div className="flex flex-col gap-4">
        <LabelAndValue
          label={
            'At MIT Reality Hack, teamwork and communication are critical to success. How do you see yourself supporting your team in this respect?'
          }
          value={allInfo.theme_essay}
        />
        {/* <LabelAndValue
          label={
            'How do you think XR technologies can help us with “Connection”? (Long answer)'
          }
          value={allInfo.theme_essay_follow_up}
        /> */}
        <LabelAndValue
          label={
            'Are you interested in participating in programming focused on startups and entrepreneurship? Please indicate your interest here and we will follow up.'
          }
          value={allInfo.theme_interest_track_one === 'Y' ? 'Yes' : 'No'}
        />
        <LabelAndValue
          label={'Are you interested in hacking on Apple Vision Pro?'}
          value={allInfo.theme_interest_track_two === 'Y' ? 'Yes' : 'No'}
        />
        {allInfo.theme_interest_track_two === 'Y' && (
          <>
            <LabelAndValue
              label={
                "Do you meet all of the minimum system requirements? This means you MUST have an Apple silicon Mac (M1, M2, etc.) to develop for visionOS. Please note that this is a hard requirement for being on a Vision Pro team. These requirements are set by Apple and we unfortunately won't have Mac hardware to check out."
              }
              value={allInfo.theme_detail_one === 'Y' ? 'Yes' : 'No'}
            />
            <LabelAndValue
              label={
                'If your team decides to develop using Unity, are you willing to sign up for a 30-Day Unity Pro Trial? CRITICAL: You MUST cancel the trial before the 30 days is up or you will be charged $2,040 USD. This is true even if you choose the monthly payment plan, since the subscription is for one year and the payment plan just spreads the cost over one year. The 30 day trial can be cancelled the moment you activate it and you will still have access for 30 days. Unity allows only one 30 day trial per account. Please ensure your trial period will cover the event days from January 23 - 27, 2025. Unity Pro is required to develop for Apple Vision Pro.'
              }
              value={allInfo.theme_detail_two === 'Y' ? 'Yes' : 'No'}
            />
            <LabelAndValue
              label={
                'Do you own a Vision Pro that you are willing to bring to support your team? You will not be expected to allow your teammates to use your device if you are uncomfortable doing so. We will set this expectation during opening ceremony.'
              }
              value={allInfo.theme_detail_three === 'Y' ? 'Yes' : 'No'}
            />
          </>
        )}
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
        <LabelAndValue
          label={
            'If you are interested in the hardware hack, please list the areas in which you have experience.'
          }
          value={
            Array.isArray(allInfo.hardware_hack_detail)
              ? allInfo.hardware_hack_detail.map((enumValue: string) =>
                  getLabelFromEnumValue(
                    enumValue,
                    hardware_hack_detail,
                    hardwareHackDetailLabels
                  )
                )
              : allInfo.hardware_hack_detail
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
              Before submitting{' '}
              {allInfo.participation_class === 'P'
                ? 'your application, '
                : 'the form, '}
              please review your responses.
            </div>
          </>
        )}
        <div className="relative flex flex-col gap-4">
          {sections.map(section => {
            // Check if the section is either 'Thematic' or 'Demographics'
            if (
              section.label === 'Thematic' ||
              section.label === 'Demographics'
            ) {
              // Check if 'participation_class' is 'P', 'Participant', or undefined
              if (
                allInfo.participation_class === 'P' ||
                allInfo.participation_class === 'Participant' ||
                typeof allInfo.participation_class === 'undefined'
              ) {
                // Render the section if the condition is met
                return (
                  <div
                    key={section.label}
                    className="flex flex-col gap-2 pb-4 border-b-2 border-gray-400"
                  >
                    <div className="text-xl font-bold">{section.label}</div>
                    {section.component}
                  </div>
                );
              } else {
                // Skip rendering if the condition is not met
                return null;
              }
            }

            // Render other sections as usual
            return (
              <div
                key={section.label}
                className="flex flex-col gap-2 pb-4 border-b-2 border-gray-400"
              >
                <div className="text-xl font-bold">{section.label}</div>
                {section.component}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
