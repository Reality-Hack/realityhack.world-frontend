import { useEvents } from '@/contexts/EventContext';
import { useHardwareList, useHardwaredevicesList, useSponsorsList } from '@/types/endpoints';
import HardwareForm from '@/components/admin/hardware/HardwareForm';
import HardwareDeviceCreateForm from '@/components/admin/hardware/HardwareDeviceCreateForm';
import HardwareDeviceEditForm from '@/components/admin/hardware/HardwareDeviceEditForm';
import HardwareCatalogDeviceSections from '@/components/admin/hardware/HardwareCatalogDeviceSections';
import { useHardwareCatalogDeviceAdmin } from '@/components/admin/hardware/useHardwareCatalogDeviceAdmin';
import {
  hardwareCountImageUrl,
  hardwareCountToHardwareCreate,
} from '@/components/admin/hardware/hardwareCountToHardwareCreate';
import type { HardwareDevice } from '@/types/models';

export default function AdminHardwareOverviewPage() {
  const { selectedEvent } = useEvents();
  const enabled = !!selectedEvent?.id;

  const {
    data: hardwareCatalog,
    isLoading: loadingCatalog,
    mutate: mutateHardware,
  } = useHardwareList({}, { swr: { enabled } });
  const {
    data: devices,
    isLoading: loadingDevices,
    mutate: mutateDevices,
  } = useHardwaredevicesList({}, { swr: { enabled } });
  const { data: sponsors } = useSponsorsList();

  const loading = loadingCatalog || loadingDevices;

  const {
    catalogSectionConfig,
    devicesSectionConfig,
    showHardwareForm,
    hardwareRowForForm,
    closeHardwareForm,
    showDeviceForm,
    deviceForForm,
    closeDeviceForm,
    deviceHardwareOptions,
    defaultHardwareId,
    deviceCreateLockedHardwareId,
  } = useHardwareCatalogDeviceAdmin({
    sponsors,
    hardwareCatalog,
    devices,
    loading,
  });

  return (
    <div className="flex flex-col gap-8">
      {!selectedEvent?.id && (
        <p className="text-sm text-gray-600">Select an event to load hardware data.</p>
      )}
      <HardwareCatalogDeviceSections
        catalog={catalogSectionConfig}
        devices={devicesSectionConfig}
      />

      {showHardwareForm && (
        <HardwareForm
          hardware={hardwareRowForForm ? hardwareCountToHardwareCreate(hardwareRowForForm) : null}
          existingImageUrl={hardwareRowForForm ? hardwareCountImageUrl(hardwareRowForForm) : null}
          sponsors={sponsors ?? []}
          showDialog={showHardwareForm}
          onClose={closeHardwareForm}
          onSuccess={() => {
            void mutateHardware();
            void mutateDevices();
          }}
        />
      )}
      {showDeviceForm && !deviceForForm ? (
        <HardwareDeviceCreateForm
          showDialog={showDeviceForm}
          hardwareOptions={deviceHardwareOptions}
          defaultHardwareId={defaultHardwareId}
          lockedHardwareId={deviceCreateLockedHardwareId}
          onClose={closeDeviceForm}
          onSuccess={() => {
            void mutateHardware();
            void mutateDevices();
          }}
        />
      ) : null}
      {showDeviceForm && deviceForForm ? (
        <HardwareDeviceEditForm
          showDialog={showDeviceForm}
          device={deviceForForm as HardwareDevice & { id: string }}
          hardwareOptions={deviceHardwareOptions}
          onClose={closeDeviceForm}
          onSuccess={() => {
            void mutateHardware();
            void mutateDevices();
          }}
        />
      ) : null}
    </div>
  );
}
