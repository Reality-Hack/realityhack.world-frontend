import { useMemo, useState } from 'react';
import { useAppParams } from "@/routing";
import Loader from "@/components/Loader";
import { EngagementDialog } from "@/components/admin/sponsors/SponsorTierDialog";
import { TIER_LABELS } from "@/components/admin/sponsors/SponsorTierSelect";
import { useSponsors } from '@/contexts/SponsorsContext';
import AppButton from '@/components/common/AppButton';
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
import AppLoader from '@/components/Loader';

export default function AdminSponsorDetailPage() {
  const { id } = useAppParams();
  const {
    sponsors,
    engagements,
    hardwareDevicesBySponsor,
    hardwareBySponsor,
    hardwareById,
    isLoadingSponsors,
    isLoadingSponsorHardware,
    isLoadingHardwareCatalog,
    isMappingSponsorHardware,
    isMappingSponsorHardwareDevices,
    isLoadingEngagements,
    mutateEngagements,
    mutateHardware,
    mutateSponsorHardware,
  } = useSponsors();
  const [dialogOpen, setDialogOpen] = useState(false);

  const sponsor = useMemo(
    () => sponsors?.find((s) => s.id === id),
    [sponsors, id]
  );

  const engagement = useMemo(
    () => engagements?.find((e) => e.sponsor === id),
    [engagements, id]
  );

  const displayTier = useMemo(() => {
    return engagement?.tier ? TIER_LABELS[engagement.tier] : '-';
  }, [engagement]);

  const catalogForSponsor = useMemo(
    () => hardwareBySponsor[id ?? ''] ?? [],
    [hardwareBySponsor, id],
  );

  const devices = useMemo(
    () => hardwareDevicesBySponsor[id ?? ''] ?? [],
    [hardwareDevicesBySponsor, id],
  );

  const hardwareLoading = isLoadingHardwareCatalog || isLoadingSponsorHardware;

  const deviceTableSponsorCatalog = isLoadingHardwareCatalog
    ? undefined
    : catalogForSponsor;

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
    sponsors: sponsors ?? undefined,
    hardwareCatalog: catalogForSponsor,
    devices,
    loading: hardwareLoading,
    hardwareById,
    sponsorCompanyId: id ?? null,
    deviceTableSponsorCatalog,
  });

  const renderLoadingState = useMemo(() => {
    let loadingText = ''
    if (isLoadingEngagements) {
      loadingText = 'Loading engagements...';
    } else if (isMappingSponsorHardware) {
      loadingText = 'Mapping sponsor hardware...';
    } else if (isMappingSponsorHardwareDevices) {
      loadingText = 'Mapping sponsor hardware devices...';
    }
    if (isLoadingEngagements || isMappingSponsorHardware || isMappingSponsorHardwareDevices) {
      return <AppLoader loadingText={loadingText} size="h-12" direction="flex-row" />;
    }
    return null;
  }, [isLoadingSponsors, isLoadingSponsorHardware, isLoadingHardwareCatalog, isLoadingEngagements]);
  
  if (isLoadingSponsors) {
    return <Loader loadingText="Loading sponsor data..." />;
  }

  return (
    <main className="pt-8 h-vh">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-4 items-center">
          <h1 className="text-2xl font-bold">{sponsor?.name}</h1>
          {renderLoadingState}
        </div>
        <div className="flex flex-row gap-4 justify-between items-center">
          <div className="flex flex-col w-full">
            <div className="text-sm font-medium">Current Sponsorship Level: </div>
            <div className="text-lg font-bold">{displayTier}</div>
          </div>
          <AppButton onClick={() => setDialogOpen(true)}>
            {engagement ? 'Update Tier' : 'Add to Event'}
          </AppButton>
        </div>
        {dialogOpen && (
          <EngagementDialog
            showDialog={dialogOpen}
            sponsor={sponsor!}
            engagement={engagement ?? null}
            onClose={() => setDialogOpen(false)}
            onSuccess={() => mutateEngagements()}
          />
        )}

        <div className="mt-4">
          <HardwareCatalogDeviceSections
            catalog={catalogSectionConfig}
            devices={devicesSectionConfig}
          />
        </div>
      </div>
      {showHardwareForm && (
        <HardwareForm
          hardware={hardwareRowForForm ? hardwareCountToHardwareCreate(hardwareRowForForm) : null}
          existingImageUrl={
            hardwareRowForForm ? hardwareCountImageUrl(hardwareRowForForm) : null
          }
          initialSponsorCompanyId={id ?? null}
          sponsors={sponsors ?? []}
          showDialog={showHardwareForm}
          onClose={closeHardwareForm}
          onSuccess={() => {
            void mutateHardware();
            void mutateSponsorHardware();
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
            void mutateSponsorHardware();
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
            void mutateSponsorHardware();
          }}
        />
      ) : null}
    </main>
  );
}
