import { useState } from 'react';
import { toast } from 'sonner';
import AppDialog from '@/components/common/AppDialog';
import HardwareImageUpload from '@/components/admin/hardware/HardwareImageUpload';
import CustomSelect, { CustomMultiSelect } from '@/components/CustomSelect';
import { hardwareCreate, hardwarePartialUpdate, useEventdestinyhardwareList } from '@/types/endpoints';
import { createUploadedFile } from '@/lib/uploaded-files-client';
import {
  EventDestinyHardware,
  HardwareCreate,
  HardwareCreateRequest,
  PatchedHardwareCreateRequest,
  Sponsor,
  TagsEnum,
} from '@/types/models';
import { hardware_categories } from '@/types/types2';
import { useEvents } from '@/contexts/EventContext';
import { TextInput } from '@/components/Inputs';
import AppLoader from '@/components/Loader';
import { normalizeRelatesToEventDestinyHardwareIds } from '@/components/TeamForm/utils';

type HardwareFormHardware = HardwareCreate & {
  relates_to_event_destiny_hardware?: string[] | EventDestinyHardware[];
};

type HardwareFormProps = {
  showDialog: boolean;
  onClose: () => void;
  onSuccess: () => void;
  /**
   * null for create mode; populated HardwareCreate for edit mode.
   * Pass existingImageUrl separately when the full image URL is available.
   */
  hardware: HardwareFormHardware | null;
  sponsors: Sponsor[];
  existingImageUrl?: string | null;
  initialSponsorCompanyId?: string | null;
};

const TAG_OPTIONS = Object.entries(hardware_categories).map(([value, label]) => ({
  value: value as TagsEnum,
  label,
}));

export default function HardwareForm({
  showDialog,
  onClose,
  onSuccess,
  hardware,
  sponsors,
  existingImageUrl = null,
  initialSponsorCompanyId = null,
}: HardwareFormProps) {
  const [name, setName] = useState(hardware?.name ?? '');
  const [description, setDescription] = useState(hardware?.description ?? '');
  const [tags, setTags] = useState<TagsEnum[]>(hardware?.tags ?? []);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [sponsorCompanyId, setSponsorCompanyId] = useState(
    hardware?.sponsor_company ?? initialSponsorCompanyId ?? '',
  );
  const [relatesToEventDestinyHardware, setRelatesToEventDestinyHardware] = useState<string[]>(() =>
    normalizeRelatesToEventDestinyHardwareIds(hardware?.relates_to_event_destiny_hardware),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { selectedEvent } = useEvents();
  const { data: eventDestinyHardwareOptions, isLoading: isLoadingEventDestinyHardwareOptions } = useEventdestinyhardwareList(
    { event: selectedEvent?.id },
    { swr: { enabled: !!selectedEvent?.id } },
  );


  const isEdit = !!hardware?.id;

  async function uploadPendingImage(): Promise<string | undefined> {
    if (!pendingImageFile) return undefined;
    const uploaded = await createUploadedFile({ file: pendingImageFile });
    return uploaded.id;
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      if (isEdit) {
        const imageId = await uploadPendingImage();
        const payload: PatchedHardwareCreateRequest = {
          name,
          description,
          tags,
          image: imageId ?? hardware.image,
          sponsor_company: sponsorCompanyId || null,
          relates_to_event_destiny_hardware: relatesToEventDestinyHardware,
        };
        await hardwarePartialUpdate(hardware.id!, payload);
        toast.success('Hardware updated');
      } else {
        const createPayload: HardwareCreateRequest = {
          name,
          description,
          tags,
          sponsor_company: sponsorCompanyId || null,
          relates_to_event_destiny_hardware: relatesToEventDestinyHardware,
        };
        const created = await hardwareCreate(createPayload);
        if (pendingImageFile && created.id) {
          const imageId = await uploadPendingImage();
          await hardwarePartialUpdate(created.id, { image: imageId });
        }
        toast.success('Hardware created');
      }
      onSuccess();
      onClose();
    } catch {
      toast.error(isEdit ? 'Failed to update hardware' : 'Failed to create hardware');
    } finally {
      setIsSubmitting(false);
    }
  }

  const displayImageUrl = pendingImageFile ? null : existingImageUrl;

  return (
    <AppDialog
      showDialog={showDialog}
      onClose={onClose}
      title={isEdit ? 'Edit Hardware' : 'Add Hardware'}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    >
      <div className="flex flex-col gap-4 pt-1">
        <HardwareImageUpload
          pendingFile={pendingImageFile}
          existingImageUrl={displayImageUrl}
          onFileChange={setPendingImageFile}
        />

        <TextInput
          name="name"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        >Name</TextInput>

        <TextInput
          name="description"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        >Description</TextInput>

        <div className="text-sm font-medium text-gray-700 -mb-4">Tags</div>
        <CustomMultiSelect
          label="Tags"
          options={TAG_OPTIONS}
          value={tags}
          onChange={(v) => setTags(v as TagsEnum[])}
          width="100%"
        />
        <div className="text-sm font-medium text-gray-700 -mb-4">Sponsor Company</div>
        <CustomSelect
          label="Sponsor Company"
          options={[
            ...sponsors.map((s) => ({ value: s.id ?? '', label: s.name })),
          ]}
          value={sponsorCompanyId}
          onChange={(v) => setSponsorCompanyId(v as string)}
          disabled={!!initialSponsorCompanyId}
          search
          width="100%"
        />
        {isLoadingEventDestinyHardwareOptions ? (
          <AppLoader loadingText="Loading hardware tracks..." size="h-12" />
        ) : (
          <>
          <div className="text-sm font-medium text-gray-700 -mb-4">Hardware Tracks</div>
          <CustomMultiSelect
            label="Hardware Tracks"
            options={[
              ...(eventDestinyHardwareOptions ?? []).map((edh: EventDestinyHardware) => ({
                value: edh.id ?? '',
                label: edh.name,
              })),
            ]}
            value={relatesToEventDestinyHardware}
            onChange={(v) => setRelatesToEventDestinyHardware(v as string[])}
            search
              width="100%"
            />
          </>
        )}
      </div>
    </AppDialog>
  );
}
