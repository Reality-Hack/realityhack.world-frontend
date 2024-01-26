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

export enum gender_identities {
  cisgender_female = 'A',
  cisgender_male = 'B',
  transgender_female = 'C',
  transgender_male = 'D',
  gender_nonconforming_nonbinary_or_gender_queer = 'E',
  two_spirit = 'F',
  other = 'G',
  prefer_not_to_say = 'H'
}

export enum race_ethnic_groups {
  asian = 'A',
  black = 'B',
  hispanic = 'C',
  middle_eastern_north_african = 'D',
  native_american = 'E',
  pacific_islander = 'F',
  white = 'G',
  multi_racial_or_multi_ethnic = 'H',
  other = 'I',
  prefer_not_to_say = 'J'
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
  prefer_not_to_say = 'G'
}

export enum participation_capacity {
  student = 'S',
  professional = 'P',
  hobbyist = 'H'
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
  project_manager = 'PM'
}

export enum digital_designer_skills {
  digital_art = 'A',
  animation = 'B',
  sound = 'C',
  ux_ui = 'D',
  video = 'E',
  other = 'F'
}

export enum specialized_expertise {
  expertise_domain = 'A',
  project_management = 'B',
  creative_guidance = 'C',
  storytelling = 'D',
  other = 'E'
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

export type uploaded_file_reference = string;

export interface Application {
  disclaimer_groups: boolean | null;
  disclaimer_open_source: boolean | null;
  id: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  pronouns?: string | null;
  email: string;
  communications_platform_username?: string | null;
  portfolio: string;
  current_city: string;
  current_country: string;
  nationality: string;
  age_group: age_group | null;
  resume?: string | null;
  bio?: string | null;
  event_year: number;
  city: string;
  country: string;
  gender_identity: gender_identities[] | null;
  race_ethnic_group: race_ethnic_groups[];
  disability_identity: disability_identity | null;
  disabilities?: disabilities[] | null;
  disability_accommodations?: string | null;
  participation_capacity: participation_capacity | null;
  student_school?: string | null;
  student_field_of_study?: string | null;
  occupation?: string | null;
  employer?: string | null;
  status?: status | null;
  experience_with_xr?: string | null;
  additional_skills: string | null;
  previously_participated?: boolean | null;
  previous_participation: previous_participation[] | null;
  proficient_languages: string | null;
  participation_role?: participation_role | null;
  theme_essay?: string | null;
  theme_essay_follow_up?: string | null;
  heard_about_us?: heard_about_us[] | null;
  shirt_size?: string | null;
  dietary_restrictions?: string | null;
  additional_accommodations?: string | null;
  phone_number_country_alpha_2_options?: string | null;
  phone_number: string;
  digital_designer_skills?: digital_designer_skills[] | null;
  specialized_expertise?: specialized_expertise[] | null;
  emergency_contact_name: string;
  emergency_contact_phone_number: string;
  emergency_contact_email: string;
  emergency_contact_relationship: string;
  parental_consent_form?: uploaded_file_reference | null;
  us_visa_support_is_required?: boolean;
  us_visa_support_full_name?: string | null;
  us_visa_support_passport_number?: string | null;
  us_visa_support_national_identification_document_information?: string | null;
  us_visa_support_citizenship?: string | null;
  us_visa_support_address_line_1?: string | null;
  us_visa_support_address_line_2?: string | null;
  media_release?: uploaded_file_reference | null;
  liability_release?: uploaded_file_reference | null;
  submitted_at: Date;
  updated_at: Date;
}

export enum hardware_request_status {
  pending = 'P',
  approved = 'A',
  rejected = 'R',
  checked_out = 'C'
}

export interface Attendee {
  id: string;
  first_name: string;
  last_name: string;
  checked_in_at: Date | null;
}

export interface HardwareTag {
  value: string;
  display_name: string;
}

export interface Hardware {
  id: string;
  name: string;
  description: string;
  image: UploadedFile | null;
  available: number;
  checked_out: number;
  total: number;
  tags: HardwareTag[];
}

export interface HardwareForSending {
  id: string;
  name: string;
  description: string;
  image: string | null;
  total: number;
  tags: string[];
}

export interface HardwareRequest {
  id: string;
  hardware: Hardware;
  hardware_device: HardwareDevice | null;
  requester: Attendee;
  team: string | null;
  status: hardware_request_status;
  reason: string;
  submitted_at: Date;
  updated_at: Date;
}

export interface HardwareRequestBrief {
  id: string;
  hardware: string;
  hardware_device: HardwareDevice | null;
  requester: Attendee;
  team: string | null;
  status: hardware_request_status;
  reason: string;
  submitted_at: Date;
  updated_at: Date;
}

export interface IncompleteHardwareRequest {
  hardware: string;
  requester: string;
  reason: string;
}

export interface HardwareDevice {
  id: string;
  serial: string;
  created_at: Date;
  updated_at: Date;
  checked_out_to: HardwareRequest | HardwareRequestBrief | null;
  hardware: Hardware;
}

export interface HardwareDeviceForSending {
  id?: string;
  serial: string;
  hardware: string;
  checked_out_to?: string | null;
}

export type hardware_requester = string | 'me' | null;

export interface HardwareCategory {
  value: string;
  display_name: string;
}

export const hardware_categories: { [key: string]: string } = {
  AC: "Accessory",
  SE: "Sensor",
  VR: "Virtual Reality",
  AR: "Augmented Reality",
  MR: "Mixed Reality",
  CO: "Computer",
  HA: "Haptics",
  CA: "Camera",
  TA: "Tablet",
  HD: "Holographic Display"
}

export interface UploadedFile {
  id: string;
  file: string;
  created_at: Date | null;
  updated_at: Date | null;
}
