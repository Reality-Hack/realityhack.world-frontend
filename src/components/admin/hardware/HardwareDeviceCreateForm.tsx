import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import IconButton from '@mui/material/IconButton';
import { toast } from 'sonner';
import AppDialog from '@/components/common/AppDialog';
import CustomSelect from '@/components/CustomSelect';
import { TextInput } from '@/components/Inputs';
import { hardwaredevicesCreate } from '@/types/endpoints';
import type { Option } from '@/components/CustomSelect';

type HardwareDeviceCreateFormProps = {
  showDialog: boolean;
  onClose: () => void;
  onSuccess: () => void;
  hardwareOptions: Option[];
  /** Pre-selected catalog row when creating (e.g. sponsor’s first type). */
  defaultHardwareId?: string | null;
  /** When set, hardware type is fixed to this id and the selector is disabled. */
  lockedHardwareId?: string | null;
};

export default function HardwareDeviceCreateForm({
  showDialog,
  onClose,
  onSuccess,
  hardwareOptions,
  defaultHardwareId = null,
  lockedHardwareId = null,
}: HardwareDeviceCreateFormProps): JSX.Element {
  const [hardwareId, setHardwareId] = useState('');
  const [serials, setSerials] = useState<string[]>(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [failedSerials, setFailedSerials] = useState<Set<number>>(new Set());

  const firstHardwareOption = hardwareOptions[0]?.value ?? '';

  useEffect(() => {
    if (!showDialog) return;
    setHardwareId(lockedHardwareId ?? defaultHardwareId ?? firstHardwareOption);
    setSerials(['']);
    setFailedSerials(new Set());
  }, [showDialog, lockedHardwareId, defaultHardwareId, firstHardwareOption]);

  function setSerialAt(index: number, value: string): void {
    setSerials((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    setFailedSerials((prev) => {
      if (!prev.has(index)) return prev;
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
  }

  function addSerialRow(): void {
    setSerials((prev) => [...prev, '']);
  }

  function removeSerialRow(index: number): void {
    setSerials((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  }

  async function handleSubmit(): Promise<void> {
    if (!hardwareId.trim()) {
      toast.error('Select a hardware type');
      return;
    }
    const trimmedSerials = serials.map((s) => s.trim()).filter(Boolean);
    if (trimmedSerials.length === 0) {
      toast.error('Serial is required');
      return;
    }

    setIsSubmitting(true);
    setFailedSerials(new Set());
    try {
      const results = await Promise.allSettled(
        trimmedSerials.map((serial) =>
          hardwaredevicesCreate({
            hardware: hardwareId,
            serial,
            checked_out_to: null,
          }),
        ),
      );

      const failedIndices = new Set(
        results
          .map((r, i) => (r.status === 'rejected' ? i : -1))
          .filter((i) => i !== -1),
      );

      if (failedIndices.size === 0) {
        toast.success(
          trimmedSerials.length === 1
            ? 'Device created'
            : `Created ${trimmedSerials.length} devices`,
        );
        onSuccess();
        onClose();
      } else {
        setFailedSerials(failedIndices);
        const successCount = trimmedSerials.length - failedIndices.size;
        if (successCount > 0) {
          toast.warning(`Created ${successCount} of ${trimmedSerials.length} devices`);
          onSuccess();
        } else {
          toast.error('Failed to create devices');
        }
      }
    } catch {
      toast.error('Failed to create devices');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AppDialog
      showDialog={showDialog}
      onClose={onClose}
      title="Add hardware device(s)"
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
          disabled={Boolean(lockedHardwareId)}
          search
          width="100%"
        />

        {serials.map((serial, index) => (
          <div key={index} className="flex flex-row items-center gap-1 w-full">
            <div className="flex-1 min-w-0">
              <TextInput
                name={`serial-${index}`}
                placeholder="Serial"
                value={serial}
                onChange={(e) => setSerialAt(index, e.target.value)}
                required
                valid={!failedSerials.has(index)}
                error={failedSerials.has(index) ? 'Failed to create' : undefined}
              >
                Serial number
              </TextInput>
            </div>
            <div className="flex flex-row items-center shrink-0 pb-0.5">
              {serials.length > 1 ? (
                <IconButton
                  type="button"
                  aria-label="Remove serial row"
                  onClick={() => removeSerialRow(index)}
                  size="small"
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
              ) : null}
              <IconButton
                type="button"
                aria-label="Add another serial"
                onClick={addSerialRow}
                size="small"
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    </AppDialog>
  );
}
