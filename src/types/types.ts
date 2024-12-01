import { hardware_hack_detail } from './application_form_types';

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

//   asian = 'A',
export enum race_ethnic_groups {
  black = 'B',
  hispanic = 'C',
  middle_eastern_north_african = 'D',
  native_american = 'E',
  pacific_islander = 'F',
  white = 'G',
  multi_racial_or_multi_ethnic = 'H',
  east_asian = 'J',
  south_asian = 'K',
  southeast_asian = 'L',
  central_asian = 'M',
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
  _2023 = 'G',
  _2024 = 'H'
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

export enum theme_interest_track_choice {
  yes = 'Y',
  no = 'N'
}

// TODO: move to RSVP
//   disabilities?: disabilities[] | null;
//   disability_accommodations?: string | null;
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
  participation_capacity: participation_capacity | null;
  student_school?: string | null;
  student_field_of_study?: string | null;
  occupation?: string | null;
  employer?: string | null;
  status?: status | null;
  experience_with_xr?: string | null;
  experience_contribution?: string | null;
  additional_skills: string | null;
  previously_participated?: boolean | null;
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
  hardware_hack_detail?: hardware_hack_detail[] | null;
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

export enum MentorTopics {
  Development_and_Programming = '1',
  Unity_Timeline_Animations = '2',
  Embedded_Systems_C = '3',
  Embedded_Systems_Python = '4',
  Cpp_Android_JavaScript = '5',
  Backend_Development = '6',
  Unreal_App_Development = '7',
  Unreal_Blueprints = '8',
  Unity_AR_Foundation = '9',
  WebXR = '10',
  Lens_Studio = '11',
  Meta_Spark = '12',
  Virtual_Reality = '13',
  Augmented_Reality = '14',
  Mixed_Reality = '15',
  Mixed_Reality_Toolkit = '16',
  Meta_XR_SDK = '17',
  C_Sharp = '18',
  Regression_Testing = '19',
  OOP_Design_Patterns = '20',
  Distributed_Computing = '21',
  Cybersecurity = '22',
  Swift_SwiftUI_ARKit = '23',
  Software_Builds = '24',
  Containers = '25',
  Deployment_Automation = '26',
  Site_reliability_engineering_SRE_Work = '27',
  Python_Shell_Scripting = '28',
  Search_Implementation = '29',
  Generative_AI = '30',
  IoT = '31',
  ThreeD_Rendering = '32',
  Video_Encoding = '33',
  Linux_OS_Configuration = '34',
  Cross_platform_Work = '35',
  Web_Frontend_Backend = '36',
  Project_Scope = '37',
  Technical_Approach = '38',
  App_driven_Architecture = '39',
  Problem_solving = '40',
  Design_and_Prototyping = '41',
  ShapesXR = '42',
  Figma = '43',
  Miro = '44',
  Adobe_Creative_Suite = '45',
  Mocap = '46',
  ThreeD_Stereoscopic_Recording = '47',
  Mobile_AR = '48',
  ThreeD_Modeling = '49',
  Animation = '50',
  Motion_Capture = '51',
  XR_Design_Execution = '52',
  Interactive_Learning_Programs = '53',
  Computer_Vision = '54',
  Graphics_Shaders = '55',
  Git = '56',
  XR_AR_VR_Expert = '57',
  Storytelling = '58',
  Visual_Design = '59',
  Prototyping = '60',
  Analog_Painting = '61',
  Drawing = '62',
  Sculpture = '63',
  Project_Management_and_Leadership = '64',
  Producer = '65',
  Peace_maker_Conflict_Resolution = '66',
  Storyteller = '67',
  Project_Management = '68',
  Agile_Scrum = '69',
  Conflict_Resolution = '70',
  Communication = '71',
  Digital_Experience_Production = '72',
  User_Flow_Design = '73',
  Hardware_Development_Arduino = '74',
  Hardware_Development_Esp32 = '75',
  Hardware_Development_Raspberry_Pi = '76',
  Innovation_and_Specialized_Expertise = '77',
  Biometrics_in_VR = '78',
  Brain_Computer_Interface_BCI = '79',
  Game_Design = '80',
  Lens_Studio_Projects = '81',
  Snap_Lens = '82',
  Eighth_Wall_Expertise = '83',
  Web_Development = '84',
  Blockchain = '85',
  Networking = '86',
  Dot_NET = '87',
  Other = 'O'
}

export function getKeyByValue(enumObj: any, value: string): string | null {
  for (const [key, val] of Object.entries(enumObj)) {
    if (val === value) {
      return key;
    }
  }
  return null; // return null if no matching key is found
}


export enum mentor_help_status {
  REQUESTED = 'R',
  ACKNOWLEDGED = 'A',
  EN_ROUTE = 'E',
  RESOLVED = 'F'
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
