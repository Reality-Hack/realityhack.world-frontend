import { type ReactNode } from 'react';
import EventAdminSection from '@/components/admin/events/EventAdminSection';
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
      <EventAdminSection
        title={catalog.title}
        description={catalog.description}
        addLabel={catalog.addLabel}
        onAdd={catalog.onAdd}
        className={['gap-2', catalogSectionClassName].filter(Boolean).join(' ')}
      >
        <HardwareTable {...catalog.tableProps} />
      </EventAdminSection>
      <EventAdminSection
        title={devices.title}
        description={devices.description}
        addLabel={devices.addLabel}
        onAdd={devices.onAdd}
        className={['gap-2', devicesSectionClassName].filter(Boolean).join(' ')}
      >
        <HardwareDeviceTable {...devices.tableProps} />
      </EventAdminSection>
    </div>
  );
}
