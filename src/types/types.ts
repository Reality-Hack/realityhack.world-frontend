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
  AI_Chat = '1', // AI - Chat
  AI_GenAI = '2', // AI - GenAI
  AI_Other = '3', // AI - Other
  AI_Vision_and_Sensing = '4', // AI - Vision and Sensing
  Audio_Music = '5', // Audio - Music
  Audio_Other = '6', // Audio - Other
  Audio_Spatial_Audio = '7', // Audio - Spatial Audio
  AVP_ARKit = '8', // AVP - ARKit
  AVP_Other = '9', // AVP - Other
  AVP_Reality_Composer = '10', // AVP - Reality Composer
  AVP_SharePlay = '11', // AVP - SharePlay
  AVP_SwiftUI = '12', // AVP - SwiftUI
  AVP_UIKit = '13', // AVP - UIKit
  AVP_Unity_PolySpatial = '14', // AVP - Unity PolySpatial
  Backend_API_Design = '15', // Backend - API Design
  Backend_Database = '16', // Backend - Database
  Blockchain = '17', // Blockchain
  Cognitive3D = '18', // Cognitive3D
  Design_3DS_Max = '19', // Design - 3DS Max
  Design_Blender = '20', // Design - Blender
  Design_Figma = '21', // Design - Figma
  Design_GIMP = '22', // Design - GIMP
  Design_Illustrator = '23', // Design - Illustrator
  Design_Maya = '24', // Design - Maya
  Design_Other = '25', // Design - Other
  Design_Photoshop = '26', // Design - Photoshop
  Design_ShapesXR = '27', // Design - ShapesXR
  Founders_Lab = '28', // Founders Lab
  Godot_CSharp_Script = '29', // Godot - C# Script
  Godot_GDScript = '30', // Godot - GDScript
  Godot_Other = '31', // Godot - Other
  Godot_Shaders = '32', // Godot - Shaders
  Hardware_Arduino = '33', // Hardware - Arduino
  Hardware_Esp32 = '34', // Hardware - Esp32
  Hardware_GPIO = '35', // Hardware - GPIO
  Hardware_Raspberry_Pi = '36', // Hardware - Raspberry Pi
  Hardware_Sensors = '37', // Hardware - Sensors
  Language_JavaScript = '38', // Language - JavaScript
  Language_C_and_CPlusPlus = '39', // Language - C and C++
  Language_CSharp = '40', // Language - C#
  Language_Java = '41', // Language - Java
  Language_Other = '42', // Language - Other
  Language_Python = '43', // Language - Python
  Meta_Anchors = '44', // Meta - Anchors
  Meta_Avatars = '45', // Meta - Avatars
  Meta_Devices = '46', // Meta - Devices
  Meta_Interactions = '47', // Meta - Interactions
  Meta_MRUK = '48', // Meta - MRUK
  Meta_Other = '49', // Meta - Other
  Meta_Scene = '50', // Meta - Scene
  Mixed_Reality_Toolkit = '51', // Mixed Reality Toolkit (MRTK)
  Networking = '52', // Networking
  OS_Android = '53', // OS - Android
  OS_iOS = '54', // OS - iOS
  OS_Linux_Unix = '55', // OS - Linux Unix
  OS_Mac = '56', // OS - Mac
  OS_Other = '57', // OS - Other
  OS_Windows = '58', // OS - Windows
  PICO_Devices = '60', // PICO - Devices
  PICO_SDKs = '61', // PICO - SDKs
  Presentation_Other = '62', // Presentation - Other
  Presentation_Pitch = '63', // Presentation - Pitch
  Presentation_Research = '64', // Presentation - Research
  Presentation_Storytelling = '65', // Presentation - Storytelling
  Project_Advice = '66', // Project - Advice
  Project_Management = '67', // Project - Management
  Project_Other = '68', // Project - Other
  Project_Scope = '69', // Project - Scope
  Qualcomm_Devices = '70', // Qualcomm - Devices
  Qualcomm_Robotics = '71', // Qualcomm - Robotics
  Qualcomm_SDKs = '72', // Qualcomm - SDKs
  Snap_AI = '73', // Snap - AI
  Snap_Lens_Studio = '74', // Snap - Lens Studio
  Snap_Other = '75', // Snap - Other
  Snap_Spectacles = '76', // Snap - Spectacles
  Source_Control_Codeberg = '77', // Source Control - Codeberg
  Source_Control_Git = '78', // Source Control - Git
  Source_Control_Other = '79', // Source Control - Other
  STYLY = '80', // STYLY
  Unity_Animations = '81', // Unity - Animations
  Unity_AR_Foundation = '82', // Unity - AR Foundation
  Unity_CSharp_Scripting = '83', // Unity - C# Scripting
  Unity_Other = '84', // Unity - Other
  Unity_Shaders = '85', // Unity - Shaders
  Unity_Visual_Scripting = '86', // Unity - Visual Scripting
  Unity_XRI = '87', // Unity - XRI
  Unreal_Animations = '88', // Unreal - Animations
  Unreal_Blueprints = '89', // Unreal - Blueprints
  Unreal_CPlusPlus = '90', // Unreal - C++
  Unreal_Other = '91', // Unreal - Other
  Unreal_Shaders = '92', // Unreal - Shaders
  Video_Editing_After_Effects = '93', // Video Editing - After Effects
  Video_Editing_DaVinci = '94', // Video Editing - DaVinci
  Video_Editing_Other = '95', // Video Editing - Other
  Video_Editing_Premiere = '96', // Video Editing - Premiere
  Web_HTML = '97', // Web - HTML
  Web_Libraries = '98', // Web - Libraries
  Web_Other = '99', // Web - Other
  WebXR = '100', // WebXR
  Other = 'O' // Other
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
  hardware_in_stock: number;
  hardware_total: number;
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
