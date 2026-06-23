import { useCallback, useMemo, useState } from 'react';
import { useAdminFormDialog } from '@/components/admin/events/useAdminFormDialog';
import type { HardwareCount, HardwareDevice, Sponsor } from '@/types/models';
import {
  HARDWARE_CATALOG_DESCRIPTION,
  HARDWARE_DEVICES_DESCRIPTION,
  SponsorNameById,
  type HardwareCatalogSectionConfig,
  type HardwareDevicesSectionConfig,
} from './HardwareCatalogDeviceSections';

export function buildHardwareById(
  catalog: HardwareCount[] | undefined,
): Record<string, HardwareCount> {
  const m: Record<string, HardwareCount> = {};
  for (const h of catalog ?? []) {
    if (h.id) m[h.id] = h;
  }
  return m;
}

type UseHardwareCatalogDeviceAdminArgs = {
  sponsors: Sponsor[] | undefined;
  /** Catalog entries scoped to this view (all events, or sponsor-filtered). */
  hardwareCatalog: HardwareCount[] | undefined;
  /** Device entries scoped to this view. */
  devices: HardwareDevice[] | undefined;
  loading: boolean;
  /** Override the id→HardwareCount map (e.g. event-wide map from context). Defaults to one built from `hardwareCatalog`. */
  hardwareById?: Record<string, HardwareCount>;
  /** When set, the catalog table filters rows by this sponsor. */
  sponsorCompanyId?: string | null;
  /** When set, the devices table shows only devices belonging to this catalog slice. */
  deviceTableSponsorCatalog?: HardwareCount[];
};

type UseHardwareCatalogDeviceAdminResult = {
  catalogSectionConfig: HardwareCatalogSectionConfig;
  devicesSectionConfig: HardwareDevicesSectionConfig;
  showHardwareForm: boolean;
  hardwareRowForForm: HardwareCount | null;
  closeHardwareForm: () => void;
  showDeviceForm: boolean;
  deviceForForm: HardwareDevice | null;
  closeDeviceForm: () => void;
  deviceHardwareOptions: { value: string; label: string }[];
  defaultHardwareId: string | null;
  /** When set, the create-device dialog locks hardware to this catalog id. */
  deviceCreateLockedHardwareId: string | null;
};

export function useHardwareCatalogDeviceAdmin({
  sponsors,
  hardwareCatalog,
  devices,
  loading,
  hardwareById: hardwareByIdOverride,
  sponsorCompanyId,
  deviceTableSponsorCatalog,
}: UseHardwareCatalogDeviceAdminArgs): UseHardwareCatalogDeviceAdminResult {
  const hardwareDialog = useAdminFormDialog<HardwareCount>();
  const deviceDialog = useAdminFormDialog<HardwareDevice>();
  const [deviceCreateLockedHardwareId, setDeviceCreateLockedHardwareId] = useState<string | null>(
    null,
  );

  const sponsorNameById = useMemo(
    () => SponsorNameById(sponsors ?? []),
    [sponsors],
  );

  const hardwareById = useMemo(
    () => hardwareByIdOverride ?? buildHardwareById(hardwareCatalog),
    [hardwareByIdOverride, hardwareCatalog],
  );

  const deviceHardwareOptions = useMemo(
    () =>
      (hardwareCatalog ?? [])
        .filter((h) => h.id)
        .map((h) => ({ value: h.id!, label: h.name })),
    [hardwareCatalog],
  );

  const defaultHardwareId = hardwareCatalog?.[0]?.id ?? null;

  const closeDeviceForm = useCallback((): void => {
    deviceDialog.closeForm();
    setDeviceCreateLockedHardwareId(null);
  }, [deviceDialog]);

  const catalogSectionConfig = useMemo(
    (): HardwareCatalogSectionConfig => ({
      title: 'Hardware catalog',
      description: HARDWARE_CATALOG_DESCRIPTION,
      addLabel: 'Add hardware',
      onAdd: hardwareDialog.openCreate,
      tableProps: {
        data: hardwareCatalog ?? [],
        loading,
        sponsorNameById,
        sponsorCompanyId,
        onEdit: hardwareDialog.openEdit,
        onCreateDevices: (row) => {
          if (!row.id) return;
          setDeviceCreateLockedHardwareId(row.id);
          deviceDialog.openCreate();
        },
        search: true,
        pagination: true,
      },
    }),
    [
      hardwareCatalog,
      hardwareDialog.openCreate,
      hardwareDialog.openEdit,
      loading,
      sponsorCompanyId,
      sponsorNameById,
      deviceDialog.openCreate,
    ],
  );

  const devicesSectionConfig = useMemo(
    (): HardwareDevicesSectionConfig => ({
      title: 'Hardware devices',
      description: HARDWARE_DEVICES_DESCRIPTION,
      addLabel: 'Add device',
      onAdd: () => {
        setDeviceCreateLockedHardwareId(null);
        deviceDialog.openCreate();
      },
      tableProps: {
        data: devices ?? [],
        hardwareById,
        loading,
        sponsorCatalog: deviceTableSponsorCatalog,
        onEdit: deviceDialog.openEdit,
        search: true,
        pagination: true,
      },
    }),
    [
      deviceDialog.openCreate,
      deviceDialog.openEdit,
      deviceTableSponsorCatalog,
      devices,
      hardwareById,
      loading,
    ],
  );

  return {
    catalogSectionConfig,
    devicesSectionConfig,
    showHardwareForm: hardwareDialog.showForm,
    hardwareRowForForm: hardwareDialog.itemForForm,
    closeHardwareForm: hardwareDialog.closeForm,
    showDeviceForm: deviceDialog.showForm,
    deviceForForm: deviceDialog.itemForForm,
    closeDeviceForm,
    deviceHardwareOptions,
    defaultHardwareId,
    deviceCreateLockedHardwareId,
  };
}
