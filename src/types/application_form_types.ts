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

// asian = 'A',
export enum race_ethnic_group {
  black = 'B',
  hispanic = 'C',
  middle_eastern_north_african = 'D',
  native_american = 'E',
  pacific_islander = 'F',
  white = 'G',
  east_asian = 'J',
  south_asian = 'K',
  southeast_asian = 'L',
  central_asian = 'M',
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
  participant = 'P',
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
  _2023 = 'G',
  _2024 = 'H'
}

export enum participation_role {
  digital_creative_designer = 'A',
  developer = 'D',
  specialist = 'S',
  project_manager = 'P'
}

export const participation_role_display_name: Record<
  keyof typeof participation_role,
  string
> = {
  digital_creative_designer: 'Digital/Creative Designer',
  developer: 'Developer',
  specialist: 'Domain or other Specialized Skill Expert',
  project_manager: 'Project Manager'
};

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

export enum hardware_hack_detail {
  _3d__printing = 'A',
  soldering = 'B',
  circuits = 'C',
  arduino = 'D',
  esp32 = 'E',
  unity = 'F',
  physical__prototyping = 'G',
  no__experience = 'H',
  other = 'O'
}

export enum theme_interest_track_choice {
  yes = 'Y',
  no = 'N'
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

// TODO: move to RSVP
// ...disabilities,
export const Enums = {
  ...status,
  ...age_group,
  ...gender_identity,
  ...race_ethnic_group,
  ...disability_identity,
  ...participation_capacity,
  ...previous_participation,
  ...participation_role,
  ...digital_designer_skills,
  ...hardware_hack_interest,
  ...hardware_hack_detail,
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

// TODO: move to RSVP
// disabilities?: disabilities[] | null;
// disability_accommodations?: string | null;
// disabilities_other?: string | null;
export interface form_data {
  disclaimer_groups: boolean | null;
  disclaimer_open_source: boolean | null;
  disclaimer_schedule: boolean | null;
  disclaimer_mindset: boolean | null;
  disclaimer_passion: boolean | null;
  mentor_mentoring_steps: string | null;
  mentor_previously_mentored?: string | null;
  mentor_qualified_fields: string | null;
  judge_invited_by: string | null;
  judge_judging_steps: string | null;
  judge_previously_judged: string | null;
  id: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  pronouns?: string | null;
  email: string;
  communications_platform_username?: string | null;
  portfolio: string;
  current_city: string | null;
  current_country: string | null | [];
  nationality: string | null | [];
  age_group: age_group | null;
  resume?: string | null;
  bio?: string | null;
  event_year: number;
  city: string;
  country: string;
  gender_identity: gender_identity[] | null;
  race_ethnic_group: race_ethnic_group[] | null;
  disability_identity: disability_identity | null;
  participation_capacity: participation_capacity | null;
  participation_class: string | null;
  student_school?: string | null;
  student_field_of_study?: string | null;
  occupation?: string | null;
  qualification?: string | null;
  expertise?: string | null;
  walkthrough?: string | null;
  employer?: string | null;
  status?: status | null;
  experience_with_xr?: string | null;
  experience_contribution?: string | null;
  additional_skills: string | null;
  previously_participated?: string | null;
  previous_participation: previous_participation[] | null;
  proficient_languages: string | null;
  participation_role?: participation_role | null;
  theme_essay?: string | null;
  // theme_essay_follow_up?: string | null;
  theme_interest_track_one?: theme_interest_track_choice | null;
  theme_interest_track_two?: theme_interest_track_choice | null;
  theme_detail_one?: theme_interest_track_choice | null;
  theme_detail_two?: theme_interest_track_choice | null;
  theme_detail_three?: theme_interest_track_choice | null;
  heard_about_us?: heard_about_us[] | '';
  digital_designer_skills?: digital_designer_skills[] | null;
  specialized_expertise?: string | null;
  industry: string[];
  hardware_hack_interest?: hardware_hack_interest[] | null;
  hardware_hack_detail?: hardware_hack_detail[] | null;
  outreach_groups?: string | null;
  gender_identity_other?: string | null;
  race_ethnic_group_other?: string | null;
  digital_designer_skills_other?: string | null;
  heard_about_us_other?: string | null;
  submitted_at: Date;
  updated_at: Date;
  current_country_option: null;
  nationality_option: null;
  industry_option: null;
}

export interface rsvp_data {
  application: string;
  id: string;
  bio: string | null;
  shirt_size: shirt_size | null;
  communications_platform_username: string | null;
  dietary_restrictions?: dietary_restrictions[] | null;
  dietary_restrictions_other?: string | null;
  dietary_allergies: dietary_allergies[] | null;
  allergies_other?: string | null;
  additional_accommodations?: string | null;
  us_visa_support_is_required: boolean | null;
  us_visa_support_full_name?: string | null;
  us_visa_letter_of_invitation_required: boolean | null;
  us_visa_support_national_identification_document_type:
    | us_visa_support_national_identification_document_type
    | null
    | string;
  us_visa_support_document_number?: string | null;
  us_visa_support_citizenship?: string | null;
  us_visa_support_address?: string | null;
  under_18_by_date: boolean | null;
  parential_consent_form_signed?: boolean | null;
  under_eighteen_rules_conduct?: boolean | null;
  agree_to_media_release: boolean | null;
  agree_to_liability_realease: boolean;
  agree_to_rules_code_of_conduct: boolean;
  emergency_contact_name: string;
  personal_phone_number: string;
  emergency_contact_phone_number: string;
  emergency_contact_email: string;
  emergency_contact_relationship: string;
  special_track_snapdragon_spaces_interest?: string | null;
  special_track_future_constructors_interest: string | null;
  app_in_store: string | null;
  currently_build_for_xr: string | null;
  currently_use_xr: string | null;
  non_xr_talents: string | null;
  ar_vr_app_in_store: string | null;
  reality_hack_project_to_product: boolean;
  identify_as_native_american: boolean;
  participation_class: string | null;
  sponsor_company: string | null;
  us_visa_support_citizenship_option?: null;
}

export enum shirt_size {
  XS = '1',
  S = '2',
  M = '3',
  L = '4',
  XL = '5',
  XXL = '6'
}

export enum dietary_restrictions {
  vegetarian = '1',
  vegan = '2',
  gluten_free = '3',
  halal = '4',
  lactose_intolerant = '5',
  kosher = '6',
  other = '7'
}

export enum dietary_allergies {
  nut_allergy = '1',
  shellfish_allergy = '2',
  soy_allergy = '3',
  dairy_allergy = '4',
  other_allergy = '5'
}

export enum us_visa_support_national_identification_document_type {
  passport_number = 'P',
  identification_number = 'N'
}
