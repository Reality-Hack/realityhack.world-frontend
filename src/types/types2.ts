import {
    HardwareDevice,
    Hardware,
    HardwareCount,
    FileUpload, 
    TagsEnum,
    HardwareCountDetail
} from '@/types/models'

export interface HardwareWithType extends HardwareDevice {
  hardwareType: Hardware | HardwareCountDetail;
}


export   interface CreateHardware extends Omit<Hardware, 'image'> {
  image?: FileUpload | null;
  total?: number;
  available?: number;
  checked_out?: number;
}

// should have a signle type/interface instead of this and HardwareTag
export interface HardwareCategory {
  value: TagsEnum;
  display_name: string;
}

export const hardware_categories: { [key in TagsEnum]: string } = {
  [TagsEnum.AC]: "Accessory",
  [TagsEnum.SE]: "Sensor",
  [TagsEnum.VR]: "Virtual Reality",
  [TagsEnum.AR]: "Augmented Reality",
  [TagsEnum.MR]: "Mixed Reality",
  [TagsEnum.CO]: "Computer",
  [TagsEnum.HA]: "Haptics",
  [TagsEnum.CA]: "Camera",
  [TagsEnum.TA]: "Tablet",
  [TagsEnum.HD]: "Holographic Display"
}


export type TaggedHardware = HardwareCount & { mappedTags: HardwareCategory[] };