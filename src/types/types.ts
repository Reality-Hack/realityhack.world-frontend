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
  AI_CHAT = 'AI_CHAT', // AI - Chat
  AI_GENAI = 'AI_GENAI', // AI - GenAI
  AI_OTHER = 'AI_OTHER', // AI - Other
  AI_VISION_SENSING = 'AI_VISION_SENSING', // AI - Vision and Sensing
  AUDIO_MUSIC = 'AUDIO_MUSIC', // Audio - Music
  AUDIO_OTHER = 'AUDIO_OTHER', // Audio - Other
  AUDIO_SPATIAL = 'AUDIO_SPATIAL', // Audio - Spatial Audio
  AVP_ARKIT = 'AVP_ARKIT', // AVP - ARKit
  AVP_OTHER = 'AVP_OTHER', // AVP - Other
  AVP_REALITY_COMPOSER = 'AVP_REALITY_COMPOSER', // AVP - Reality Composer
  AVP_SHAREPLAY = 'AVP_SHAREPLAY', // AVP - SharePlay
  AVP_SWIFTUI = 'AVP_SWIFTUI', // AVP - SwiftUI
  AVP_UIKIT = 'AVP_UIKIT', // AVP - UIKit
  AVP_UNITY_POLYSPATIAL = 'AVP_UNITY_POLYSPATIAL', // AVP - Unity PolySpatial
  BACKEND_API = 'BACKEND_API', // Backend - API Design
  BACKEND_DATABASE = 'BACKEND_DATABASE', // Backend - Database
  BLOCKCHAIN = 'BLOCKCHAIN', // Blockchain
  COGNITIVE3D = 'COGNITIVE3D', // Cognitive3D
  DESIGN_3DS_MAX = 'DESIGN_3DS_MAX', // Design - 3DS Max
  DESIGN_BLENDER = 'DESIGN_BLENDER', // Design - Blender
  DESIGN_FIGMA = 'DESIGN_FIGMA', // Design - Figma
  DESIGN_GIMP = 'DESIGN_GIMP', // Design - GIMP
  DESIGN_ILLUSTRATOR = 'DESIGN_ILLUSTRATOR', // Design - Illustrator
  DESIGN_MAYA = 'DESIGN_MAYA', // Design - Maya
  DESIGN_OTHER = 'DESIGN_OTHER', // Design - Other
  DESIGN_PHOTOSHOP = 'DESIGN_PHOTOSHOP', // Design - Photoshop
  DESIGN_SHAPESXR = 'DESIGN_SHAPESXR', // Design - ShapesXR
  FOUNDERS_LAB = 'FOUNDERS_LAB', // Founders Lab
  GODOT_CSHARP = 'GODOT_CSHARP', // Godot - C# Script
  GODOT_GDSCRIPT = 'GODOT_GDSCRIPT', // Godot - GDScript
  GODOT_OTHER = 'GODOT_OTHER', // Godot - Other
  GODOT_SHADERS = 'GODOT_SHADERS', // Godot - Shaders
  HARDWARE_ARDUINO = 'HARDWARE_ARDUINO', // Hardware - Arduino
  HARDWARE_ESP32 = 'HARDWARE_ESP32', // Hardware - Esp32
  HARDWARE_GPIO = 'HARDWARE_GPIO', // Hardware - GPIO
  HARDWARE_RASPBERRY_PI = 'HARDWARE_RASPBERRY_PI', // Hardware - Raspberry Pi
  HARDWARE_SENSORS = 'HARDWARE_SENSORS', // Hardware - Sensors
  LANG_JAVASCRIPT = 'LANG_JAVASCRIPT', // Language - JavaScript
  LANG_CPP = 'LANG_CPP', // Language - C and C++
  LANG_CSHARP = 'LANG_CSHARP', // Language - C#
  LANG_JAVA = 'LANG_JAVA', // Language - Java
  LANG_OTHER = 'LANG_OTHER', // Language - Other
  LANG_PYTHON = 'LANG_PYTHON', // Language - Python
  META_ANCHORS = 'META_ANCHORS', // Meta - Anchors
  META_AVATARS = 'META_AVATARS', // Meta - Avatars
  META_DEVICES = 'META_DEVICES', // Meta - Devices
  META_INTERACTIONS = 'META_INTERACTIONS', // Meta - Interactions
  META_MRUK = 'META_MRUK', // Meta - MRUK
  META_OTHER = 'META_OTHER', // Meta - Other
  META_SCENE = 'META_SCENE', // Meta - Scene
  MRTK = 'MRTK', // Mixed Reality Toolkit (MRTK)
  NETWORKING = 'NETWORKING', // Networking
  OS_ANDROID = 'OS_ANDROID', // OS - Android
  OS_IOS = 'OS_IOS', // OS - iOS
  OS_LINUX = 'OS_LINUX', // OS - Linux Unix
  OS_MAC = 'OS_MAC', // OS - Mac
  OS_OTHER = 'OS_OTHER', // OS - Other
  OS_WINDOWS = 'OS_WINDOWS', // OS - Windows
  PICO_DEVICES = 'PICO_DEVICES', // PICO - Devices
  PICO_SDKS = 'PICO_SDKS', // PICO - SDKs
  PRESENTATION_OTHER = 'PRESENTATION_OTHER', // Presentation - Other
  PRESENTATION_PITCH = 'PRESENTATION_PITCH', // Presentation - Pitch
  PRESENTATION_RESEARCH = 'PRESENTATION_RESEARCH', // Presentation - Research
  PRESENTATION_STORYTELLING = 'PRESENTATION_STORYTELLING', // Presentation - Storytelling
  PROJECT_ADVICE = 'PROJECT_ADVICE', // Project - Advice
  PROJECT_MANAGEMENT = 'PROJECT_MANAGEMENT', // Project - Management
  PROJECT_OTHER = 'PROJECT_OTHER', // Project - Other
  PROJECT_SCOPE = 'PROJECT_SCOPE', // Project - Scope
  QUALCOMM_DEVICES = 'QUALCOMM_DEVICES', // Qualcomm - Devices
  QUALCOMM_ROBOTICS = 'QUALCOMM_ROBOTICS', // Qualcomm - Robotics
  QUALCOMM_SDKS = 'QUALCOMM_SDKS', // Qualcomm - SDKs
  SNAP_AI = 'SNAP_AI', // Snap - AI
  SNAP_LENS_STUDIO = 'SNAP_LENS_STUDIO', // Snap - Lens Studio
  SNAP_OTHER = 'SNAP_OTHER', // Snap - Other
  SNAP_SPECTACLES = 'SNAP_SPECTACLES', // Snap - Spectacles
  SOURCE_CONTROL_CODEBERG = 'SOURCE_CONTROL_CODEBERG', // Source Control - Codeberg
  SOURCE_CONTROL_GIT = 'SOURCE_CONTROL_GIT', // Source Control - Git
  SOURCE_CONTROL_OTHER = 'SOURCE_CONTROL_OTHER', // Source Control - Other
  STYLY = 'STYLY', // STYLY
  UNITY_ANIMATIONS = 'UNITY_ANIMATIONS', // Unity - Animations
  UNITY_AR_FOUNDATION = 'UNITY_AR_FOUNDATION', // Unity - AR Foundation
  UNITY_CSHARP = 'UNITY_CSHARP', // Unity - C# Scripting
  UNITY_OTHER = 'UNITY_OTHER', // Unity - Other
  UNITY_SHADERS = 'UNITY_SHADERS', // Unity - Shaders
  UNITY_VISUAL_SCRIPTING = 'UNITY_VISUAL_SCRIPTING', // Unity - Visual Scripting
  UNITY_XRI = 'UNITY_XRI', // Unity - XRI
  UNREAL_ANIMATIONS = 'UNREAL_ANIMATIONS', // Unreal - Animations
  UNREAL_BLUEPRINTS = 'UNREAL_BLUEPRINTS', // Unreal - Blueprints
  UNREAL_CPP = 'UNREAL_CPP', // Unreal - C++
  UNREAL_OTHER = 'UNREAL_OTHER', // Unreal - Other
  UNREAL_SHADERS = 'UNREAL_SHADERS', // Unreal - Shaders
  VIDEO_AFTER_EFFECTS = 'VIDEO_AFTER_EFFECTS', // Video Editing - After Effects
  VIDEO_DAVINCI = 'VIDEO_DAVINCI', // Video Editing - DaVinci
  VIDEO_OTHER = 'VIDEO_OTHER', // Video Editing - Other
  VIDEO_PREMIERE = 'VIDEO_PREMIERE', // Video Editing - Premiere
  WEB_HTML = 'WEB_HTML', // Web - HTML
  WEB_LIBRARIES = 'WEB_LIBRARIES', // Web - Libraries
  WEB_OTHER = 'WEB_OTHER', // Web - Other
  WEBXR = 'WEBXR', // WebXR
  OTHER = 'OTHER' // Other
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

export type hardware_requester = string | 'me' | null;
