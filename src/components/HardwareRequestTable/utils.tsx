import { HardwareRequestList, HardwareRequestStatusEnum } from "@/types/models";
import { HardwareWithType } from "@/types/types2";

// Types and Constants
export type HardwareRequestStatusOption = {
  label: string;
  value: HardwareRequestStatusEnum;
}

export type HardwareRequestTableRow = HardwareRequestList & {
  teamName: string;
  requesterName: string;
  hardwareName: string;
  hardware_in_stock: number;
  hardware_total: number;
}

export const HardwareRequestStatusOptionsCheckedOut: HardwareRequestStatusOption = {
  label: 'Checked Out',
  value: HardwareRequestStatusEnum.C
}

export const HardwareRequestStatusOptionsFull: HardwareRequestStatusOption[] = [
  {
    label: 'Pending',
    value: HardwareRequestStatusEnum.P
  },
  {
    label: 'Rejected',
    value: HardwareRequestStatusEnum.R
  },
];

export const HardwareRequestStatusOptions: HardwareRequestStatusOption[] = [
  {
    label: 'Approved',
    value: HardwareRequestStatusEnum.A
  },
  HardwareRequestStatusOptionsCheckedOut,
  ...HardwareRequestStatusOptionsFull
];

/**
 * Checks if a hardware device is available (not checked out to anyone)
 */
const isHardwareDeviceAvailable = (device: HardwareWithType | null): boolean => {
  return device?.checked_out_to == null;
};

/**
 * Checks if the selected hardware device matches the hardware request's assigned device
 */
const isSameHardwareDevice = (
  device: HardwareWithType | null,
  hardwareRequest: HardwareRequestList
): boolean => {
  return !!(device?.id && hardwareRequest.hardware_device === device.id);
};

/**
 * Checks if the selected hardware device type matches the hardware request's hardware type
 */
const isSameHardwareDeviceType = (
  device: HardwareWithType | null,
  hardwareRequest: HardwareRequestList
): boolean => {
  return !!(device?.hardwareType?.id && device.hardware === hardwareRequest.hardware);
};

/**
 * Checks if the hardware request status is approved
 */
const isRequestApproved = (hardwareRequest: HardwareRequestList): boolean => {
  return hardwareRequest.status === HardwareRequestStatusEnum.A;
};

/**
 * Checks if the hardware request status is checked out
 */
const isDeviceCheckedOut = (hardwareRequest: HardwareRequestList): boolean => {
  return hardwareRequest.status === HardwareRequestStatusEnum.C;
};

/**
 * Determines if a checkout operation is valid
 */
export const isValidCheckout = (
  device: HardwareWithType | null,
  hardwareRequest: HardwareRequestList
): boolean => {
  return (
    isSameHardwareDeviceType(device, hardwareRequest) &&
    isHardwareDeviceAvailable(device) &&
    isRequestApproved(hardwareRequest)
  );
};

/**
 * Determines if a return operation is valid
 */
export const isValidReturn = (
  device: HardwareWithType | null,
  hardwareRequest: HardwareRequestList
): boolean => {
  return isDeviceCheckedOut(hardwareRequest) && isSameHardwareDevice(device, hardwareRequest);
};

/**
 * Determines if either a checkout or return operation is valid
 */
export const isValidRequest = (
  device: HardwareWithType | null,
  hardwareRequest: HardwareRequestList
): boolean => {
  return isValidCheckout(device, hardwareRequest) || isValidReturn(device, hardwareRequest);
};