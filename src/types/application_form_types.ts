export enum status {
  accepted_in_person = 'AI',
  accepted_online = 'AO',
  waitlist_in_person = 'WI',
  waitlist_online = 'WO',
  declined = 'D'
}

export enum age_group {
  seventeen_or_younger = 'A',
  eighteen_to_twenty = 'B',
  twenty_one_to_twenty_nine = 'C',
  thirty_to_thirty_nine = 'D',
  forty_to_forty_nine = 'E',
  fifty_to_fifty_nine = 'F',
  sixty_or_older = 'G',
  prefer_not_to_say = 'H'
}

export enum gender_identity {
  cisgender_female = 'A',
  cisgender_male = 'B',
  transgender_female = 'C',
  transgender_male = 'D',
  gender_nonconforming_nonbinary_or_gender_queer = 'E',
  two_spirit = 'F',
  prefer_not_to_say = 'G',
  other = 'O'
}

export enum race_ethnic_group {
  asian = 'A',
  black = 'B',
  hispanic = 'C',
  middle_eastern_north_african = 'D',
  native_american = 'E',
  pacific_islander = 'F',
  white = 'G',
  multi_racial_or_multi_ethnic = 'H',
  prefer_not_to_say = 'I',
  other = 'O'
}

export enum disability_identity {
  yes = 'A',
  no = 'B',
  prefer_not_to_say = 'C'
}

export enum disabilities {
  hearing_difficulty = 'A',
  vision_difficulty = 'B',
  cognitive_difficulty = 'C',
  ambulatory_difficulty = 'D',
  self_care_difficulty = 'E',
  independent_living_difficulty = 'F',
  prefer_not_to_say = 'G',
  other = 'O'
}

export enum participation_capacity {
  student = 'S',
  professional = 'P',
  hobbyist = 'H'
}

export enum participation_class {
  hacker = 'H',
  mentor = 'M',
  judge = 'J'
}

export enum previous_participation {
  _2016 = 'A',
  _2017 = 'B',
  _2018 = 'C',
  _2019 = 'D',
  _2020 = 'E',
  _2022 = 'F',
  _2023 = 'G'
}

export enum participation_role {
  designer = 'A',
  developer = 'D',
  specialist = 'S',
  project_manager = 'P'
}

export enum digital_designer_skills {
  digital_art = 'A',
  animation = 'B',
  sound = 'C',
  ux_ui = 'D',
  video = 'E',
  other = 'F'
}

export enum hardware_hack_interest {
  not_interested = 'A',
  mild_interest = 'B',
  likely = 'C',
  certain = 'D'
}

export enum heard_about_us {
  friend = 'F',
  volunteer = 'V',
  network = 'N',
  social = 'S',
  campus = 'C',
  participated = 'P',
  other = 'O'
}

export const Enums = {
  ...status,
  ...age_group,
  ...gender_identity,
  ...race_ethnic_group,
  ...disability_identity,
  ...disabilities,
  ...participation_capacity,
  ...previous_participation,
  ...participation_role,
  ...digital_designer_skills,
  ...hardware_hack_interest,
  ...heard_about_us
};

export const exemptFields = [
  'age_group',
  'disability_identity',
  'participation_role',
  'participation_capacity'
];

export type uploaded_file_reference = string;

export type option_value = {
  value: string;
  display_name: string;
};

export interface form_data {
  disclaimer_groups: boolean | null;
  disclaimer_open_source: boolean | null;
  disclaimer_schedule: boolean | null;
  disclaimer_mindset: boolean | null;
  disclaimer_passion: boolean | null;
  id: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  pronouns?: string | null;
  email: string;
  communications_platform_username?: string | null;
  portfolio: string;
  phone_number: string;
  current_city: string;
  current_country: string;
  nationality: string;
  age_group: age_group | null;
  resume?: string | null;
  bio?: string | null;
  event_year: number;
  city: string;
  country: string;
  gender_identity: gender_identity[] | null;
  race_ethnic_group: race_ethnic_group[] | null;
  disability_identity: disability_identity | null;
  disabilities?: disabilities[] | null;
  disability_accommodations?: string | null;
  participation_capacity: participation_capacity | null;
  participation_class: participation_class | null;
  student_school?: string | null;
  student_field_of_study?: string | null;
  occupation?: string | null;
  qualification?: string | null;
  expertise?: string | null;
  walkthrough?: string | null;
  employer?: string | null;
  status?: status | null;
  experience_with_xr?: string | null;
  additional_skills: string | null;
  previously_participated?: string | null;
  previously_mentored?: string | null;
  previous_participation: previous_participation[] | null;
  proficient_languages: string | null;
  participation_role?: participation_role | null;
  theme_essay?: string | null;
  theme_essay_follow_up?: string | null;
  heard_about_us?: heard_about_us[] | '';
  digital_designer_skills?: digital_designer_skills[] | null;
  specialized_expertise?: string | null;
  industry: string[];
  hardware_hack_interest?: hardware_hack_interest[] | null;
  outreach_groups?: string | null;
  gender_identity_other?: string | null;
  race_ethnic_group_other?: string | null;
  disabilities_other?: string | null;
  digital_designer_skills_other?: string | null;
  heard_about_us_other?: string | null;
  submitted_at: Date;
  updated_at: Date;
  current_country_option: null;
  nationality_option: null;
  industry_option: null;
}
