import React from 'react';
import { TextAreaInput, RadioInput, CheckboxInput } from '../Inputs';
import {
  form_data,
  hardware_hack_interest,
  hardware_hack_detail,
  theme_interest_track_choice
} from '@/types/application_form_types';

interface FormProps {
  formData: Partial<form_data>;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  handleBlur: (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  errors: Record<string, string>;
}

export const hardwareHackDetailLabels = {
  _3d__printing: '3D Printing',
  soldering: 'Soldering',
  circuits: 'Circuits',
  arduino: 'Arduino',
  esp32: 'ESP32',
  unity: 'Unity',
  physical__prototyping: 'Physical Prototyping',
  no__experience: 'No Experience',
  other: 'Other'
};

export const hardwareHackLabels = {
  not_interested: 'Not at all interested, I’ll pass',
  mild_interest: 'Some mild interest',
  likely: 'Most likely',
  certain: '100% I want to join'
};

const themeInterestTrackLabels = {
  yes: 'Yes',
  no: 'No'
};

const ThematicForm: React.FC<FormProps> = ({
  formData,
  handleChange,
  handleBlur,
  errors
}) => {
  return (
    <div className="px-6">
      <p className="mb-4 text-xl font-bold text-purple-900">Thematic</p>

      <TextAreaInput
        name="theme_essay"
        placeholder="Enter your response here."
        value={formData.theme_essay || ''}
        onChange={handleChange}
        error={errors.theme_essay}
        valid={!errors.theme_essay}
        onBlur={handleBlur}
      >
        At MIT Reality Hack, teamwork and communication are critical to success.
        How do you see yourself supporting your team in this respect?
        <span className="font-bold text-themeSecondary">*</span>
      </TextAreaInput>

      <p className="pt-4 ">
        Are you interested in participating in programming focused on startups
        and entrepreneurship? Please indicate your interest here and we will
        follow up.
        <span className="font-bold text-themeSecondary">*</span>
      </p>
      <div className="pb-4">
        {Object.keys(theme_interest_track_choice).map(key => (
          <RadioInput
            key={key}
            name="theme_interest_track_one"
            value={
              theme_interest_track_choice[
              key as keyof typeof theme_interest_track_choice
              ]
            }
            checked={
              formData.theme_interest_track_one?.includes(
                theme_interest_track_choice[
                key as keyof typeof theme_interest_track_choice
                ]
              ) || false
            }
            onChange={handleChange}
            label={
              themeInterestTrackLabels[
              key as keyof typeof themeInterestTrackLabels
              ]
            }
            onBlur={handleBlur}
          />
        ))}
      </div>

      <p className="pb-2">
        Are you interested in hacking on Apple Vision Pro?
        <span className="font-bold text-themeSecondary">*</span>
      </p>
      <div className="pb-4">
        {Object.keys(theme_interest_track_choice).map(key => (
          <RadioInput
            key={key}
            name="theme_interest_track_two"
            value={
              theme_interest_track_choice[
              key as keyof typeof theme_interest_track_choice
              ]
            }
            checked={
              formData.theme_interest_track_two?.includes(
                theme_interest_track_choice[
                key as keyof typeof theme_interest_track_choice
                ]
              ) || false
            }
            onChange={handleChange}
            onBlur={handleBlur}
            label={
              themeInterestTrackLabels[
              key as keyof typeof themeInterestTrackLabels
              ]
            }
          />
        ))}
      </div>
      {formData.theme_interest_track_two === 'Y' && (
        <>
          <p className="pb-2">
            Do you meet all of the minimum system requirements? This means you
            MUST have an Apple silicon Mac (M1, M2, etc.) to develop for
            visionOS. Please note that this is a hard requirement for being on a
            Vision Pro team. These requirements are set by Apple and we
            unfortunately won&apos;t have Mac hardware to check out.
            <span className="font-bold text-themeSecondary">*</span>
          </p>
          <div className="pb-6">
            {Object.keys(theme_interest_track_choice).map(key => (
              <RadioInput
                key={key}
                name="theme_detail_one"
                onBlur={handleBlur}
                value={
                  theme_interest_track_choice[
                  key as keyof typeof theme_interest_track_choice
                  ]
                }
                checked={
                  formData.theme_detail_one?.includes(
                    theme_interest_track_choice[
                    key as keyof typeof theme_interest_track_choice
                    ]
                  ) || false
                }
                onChange={handleChange}
                label={
                  themeInterestTrackLabels[
                  key as keyof typeof themeInterestTrackLabels
                  ]
                }
              />
            ))}
          </div>

          <p className="pb-2">
            {`If your team decides to develop using Unity, are you willing to sign
            up for a `}
            <a
              href="https://unity.com/products/unity-pro"
              className="text-themeSecondary underline"
              target="_blank"
            >
              30-Day Unity Pro Trial?
            </a>
            {` CRITICAL: You MUST cancel the trial
            before the 30 days is up or you will be charged $2,040 USD. This is
            true even if you choose the monthly payment plan, since the
            subscription is for one year and the payment plan just spreads the
            cost over one year. The 30 day trial can be `}
            <a
              href="https://support.unity.com/hc/en-us/articles/29937615908372-How-can-I-stop-my-Unity-Pro-30-day-free-trial"
              target="_blank"
              className="text-themeSecondary underline"
            >
              cancelled
            </a>
            {` the moment you activate it and you will still have access for 30 days. Unity allows
            only one 30 day trial per account. Please ensure your trial period
            will cover the event days from January 23 - 27, 2025. Unity Pro is
            required to develop for Apple Vision Pro.`}
            <span className="font-bold text-themeSecondary">*</span>
          </p>
          <div className="pb-6">
            {Object.keys(theme_interest_track_choice).map(key => (
              <RadioInput
                key={key}
                name="theme_detail_two"
                onBlur={handleBlur}
                value={
                  theme_interest_track_choice[
                  key as keyof typeof theme_interest_track_choice
                  ]
                }
                checked={
                  formData.theme_detail_two?.includes(
                    theme_interest_track_choice[
                    key as keyof typeof theme_interest_track_choice
                    ]
                  ) || false
                }
                onChange={handleChange}
                label={
                  themeInterestTrackLabels[
                  key as keyof typeof themeInterestTrackLabels
                  ]
                }
              />
            ))}
          </div>

          <p className="pb-2">
            Do you own a Vision Pro that you are willing to bring to support
            your team? You will not be expected to allow your teammates to use
            your device if you are uncomfortable doing so. We will set this
            expectation during opening ceremony.
            <span className="font-bold text-themeSecondary">*</span>
          </p>
          <div className="pb-6">
            {Object.keys(theme_interest_track_choice).map(key => (
              <RadioInput
                key={key}
                name="theme_detail_three"
                onBlur={handleBlur}
                value={
                  theme_interest_track_choice[
                  key as keyof typeof theme_interest_track_choice
                  ]
                }
                checked={
                  formData.theme_detail_three?.includes(
                    theme_interest_track_choice[
                    key as keyof typeof theme_interest_track_choice
                    ]
                  ) || false
                }
                onChange={handleChange}
                label={
                  themeInterestTrackLabels[
                  key as keyof typeof themeInterestTrackLabels
                  ]
                }
              />
            ))}
          </div>
        </>
      )}

      <p className="mb-4">
        How interested would you be in participating in The Hardware Hack this
        year? The Hardware Hack is a special hand-on track where participants
        use hardware kits to design XR devices that interface with our bodies
        and with our surroundings. (optional)
      </p>
      <div className="">
        {Object.keys(hardware_hack_interest).map(key => (
          <RadioInput
            key={key}
            name="hardware_hack_interest"
            value={
              hardware_hack_interest[key as keyof typeof hardware_hack_interest]
            }
            checked={
              formData.hardware_hack_interest?.includes(
                hardware_hack_interest[
                key as keyof typeof hardware_hack_interest
                ]
              ) || false
            }
            onChange={handleChange}
            label={hardwareHackLabels[key as keyof typeof hardwareHackLabels]}
          // error={errors.specialized_expertise}
          />
        ))}
      </div>
      {/* Why? Because we're treating this as a checkbox, not a radio, throughout the application form. TODO: Fix this. */}
      {formData.hardware_hack_interest &&
        ['B', 'C', 'D'].includes(formData.hardware_hack_interest[0]) && (
          <>
            <p className="pb-2">
              Do you have any prior experience building custom hardware in these
              areas?
            </p>
            <div className="pl-4 pb-4">
              {Object.keys(hardware_hack_detail).map(key => (
                <CheckboxInput
                  key={key}
                  name="hardware_hack_detail"
                  value={
                    hardware_hack_detail[
                    key as keyof typeof hardware_hack_detail
                    ]
                  }
                  checked={
                    (formData.hardware_hack_detail &&
                      formData.hardware_hack_detail?.includes(
                        hardware_hack_detail[
                        key as keyof typeof hardware_hack_detail
                        ]
                      )) ||
                    false
                  }
                  onChange={handleChange}
                  label={
                    hardwareHackDetailLabels[
                    key as keyof typeof hardwareHackDetailLabels
                    ]
                  }
                  error={errors.previous_participation}
                />
              ))}
            </div>
          </>
        )}
    </div>
  );
};

export default ThematicForm;
