import { type ReactNode } from 'react';
import AppButton from '@/components/common/AppButton';
import HardwareTable, { type HardwareTableProps } from '@/components/admin/hardware/HardwareTable';
import HardwareDeviceTable, {
  type HardwareDeviceTableProps,
} from '@/components/admin/hardware/HardwareDeviceTable';
import { Sponsor } from '@/types/models';

export const HARDWARE_CATALOG_DESCRIPTION =
  'Hardware types for the current event with availability counts.';

export const HARDWARE_DEVICES_DESCRIPTION =
  'Individual devices (serials) linked to catalog types.';

export type HardwareCatalogSectionConfig = {
  title: string;
  description: ReactNode;
  addLabel: string;
  onAdd: () => void;
  tableProps: HardwareTableProps;
};

export type HardwareDevicesSectionConfig = {
  title: string;
  description: ReactNode;
  addLabel: string;
  onAdd: () => void;
  tableProps: HardwareDeviceTableProps;
};

export type HardwareCatalogDeviceSectionsProps = {
  catalog: HardwareCatalogSectionConfig;
  devices: HardwareDevicesSectionConfig;
  className?: string;
  catalogSectionClassName?: string;
  devicesSectionClassName?: string;
};

export function SponsorNameById(sponsors: Sponsor[]): Record<string, string> {
  const sponsorMap: Record<string, string> = {};
  for (const sponsor of sponsors ?? []) {
    if (sponsor.id) sponsorMap[sponsor.id] = sponsor.name ?? sponsor.id;
  }
  return sponsorMap;
}

export default function HardwareCatalogDeviceSections({
  catalog,
  devices,
  className = 'flex flex-col gap-8',
  catalogSectionClassName,
  devicesSectionClassName,
}: HardwareCatalogDeviceSectionsProps): JSX.Element {

  return (
    <div className={className}>
      <section
        className={['flex flex-col gap-2', catalogSectionClassName].filter(Boolean).join(' ')}
      >
        <div className="flex flex-row justify-between items-start gap-4">
          <div>
            <h2 className="text-xl font-semibold">{catalog.title}</h2>
            <p className="text-sm text-gray-600">{catalog.description}</p>
          </div>
          <AppButton onClick={catalog.onAdd}>{catalog.addLabel}</AppButton>
        </div>
        <HardwareTable {...catalog.tableProps} />
      </section>
      <section
        className={['flex flex-col gap-2', devicesSectionClassName].filter(Boolean).join(' ')}
      >
        <div className="flex flex-row justify-between items-start gap-4">
          <div>
            <h2 className="text-xl font-semibold">{devices.title}</h2>
            <p className="text-sm text-gray-600">{devices.description}</p>
          </div>
          <AppButton onClick={devices.onAdd}>{devices.addLabel}</AppButton>
        </div>
        <HardwareDeviceTable {...devices.tableProps} />
      </section>
    </div>
  );
}
