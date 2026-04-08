import { useEffect, useState } from 'react';
import Chip from '@mui/material/Chip';
import { toast } from 'sonner';
import AppDialog from '@/components/common/AppDialog';
import CustomSelect from '@/components/CustomSelect';
import { TextInput } from '@/components/Inputs';
import { hardwaredevicesPartialUpdate, useHardwarerequestsRetrieve } from '@/types/endpoints';
import type { HardwareDevice } from '@/types/models';
import HardwareDeviceTimeline from './HardwareDeviceTimeline';
import Loader from '@/components/Loader';
import type { Option } from '@/components/CustomSelect';

type HardwareDeviceEditFormProps = {
  showDialog: boolean;
  onClose: () => void;
  onSuccess: () => void;
  device: HardwareDevice & { id: string };
  hardwareOptions: Option[];
};

export default function HardwareDeviceEditForm({
  showDialog,
  onClose,
  onSuccess,
  device,
  hardwareOptions,
}: HardwareDeviceEditFormProps): JSX.Element {
  const [hardwareId, setHardwareId] = useState('');
  const [serial, setSerial] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: checkedOutHardwareRequest, isLoading: isLoadingCheckedOutHardwareRequest } =
    useHardwarerequestsRetrieve(device.checked_out_to ?? '', {
      swr: {
        enabled: Boolean(showDialog && device.checked_out_to),
      },
    });

  useEffect(() => {
    if (!showDialog) return;
    setHardwareId(device.hardware);
    setSerial(device.serial);
  }, [showDialog, device.hardware, device.serial]);

  async function handleSubmit(): Promise<void> {
    if (!hardwareId.trim()) {
      toast.error('Select a hardware type');
      return;
    }
    if (!serial.trim()) {
      toast.error('Serial is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const checkout = device.checked_out_to?.trim() || null;
      await hardwaredevicesPartialUpdate(device.id, {
        hardware: hardwareId,
        serial: serial.trim(),
        checked_out_to: checkout,
      });
      toast.success('Device updated');
      onSuccess();
      onClose();
    } catch {
      toast.error('Failed to update device');
    } finally {
      setIsSubmitting(false);
    }
  }

  const showCheckoutLoader = Boolean(device.checked_out_to) && isLoadingCheckedOutHardwareRequest;

  return (
    <AppDialog
      showDialog={showDialog}
      onClose={onClose}
      title="Edit hardware device"
      onSubmit={() => void handleSubmit()}
      isSubmitting={isSubmitting}
    >
      <div className="flex flex-col gap-2 pt-1 min-h-[350px] z-100">
        <div className="-mb-2">Hardware type</div>
        <CustomSelect
          label="Hardware type"
          options={hardwareOptions}
          value={hardwareId}
          onChange={(v) => setHardwareId(v as string)}
          search
          width="100%"
          disabled={true}
        />

        <TextInput
          name="serial"
          placeholder="Serial"
          value={serial}
          onChange={(e) => setSerial(e.target.value)}
          required
        >
          Serial number
        </TextInput>

        {showCheckoutLoader ? (
          <Loader loadingText="Loading options..." size="h-12" direction="flex-row" />
        ) : null}

        <div className="flex flex-col md:flex-row w-full justify-between items-center gap-1 -mt-2">
          <div className="text-sm font-medium text-gray-700">Status</div>
          {device.checked_out_to ? (
            <Chip label="Checked out" size="medium" color="warning" />
          ) : (
            <Chip label="Available" size="medium" color="success" />
          )}
        </div>

        {device.checked_out_to && !isLoadingCheckedOutHardwareRequest ? (
          <div className="flex flex-col gap-1 text-sm text-gray-600">
            <div className="flex flex-row gap-1">
              <div className="text-gray-800">Participant:</div>
              <div className="font-bold text-gray-600">
                {[checkedOutHardwareRequest?.requester?.first_name, checkedOutHardwareRequest?.requester?.last_name]
                  .filter(Boolean)
                  .join(' ') || '—'}
              </div>
            </div>
            <div className="">
              {checkedOutHardwareRequest?.requester?.communications_platform_username ? (
                <div className="flex flex-row gap-1">
                  <div className="text-gray-800">Discord:</div>
                  <div className="font-bold text-gray-600">
                    {checkedOutHardwareRequest?.requester?.communications_platform_username}
                  </div>
                </div>
              ) : null}
            </div>
            <div className="flex flex-row gap-1">
              <span className="text-gray-800">Team: </span>
              <div className="font-bold text-gray-600">{checkedOutHardwareRequest?.team?.name ?? '—'}</div>
              { checkedOutHardwareRequest?.team?.number ? (
                <span className="text-gray-800">
                  (#{checkedOutHardwareRequest?.team?.number.toString()})
                </span>
              ) : null}
            </div>
          </div>
        ) : null}

        <HardwareDeviceTimeline device={device} />
      </div>
    </AppDialog>
  );
}
