import { useSession } from "next-auth/react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { HardwareWithType } from "@/types/types2";
import { HardwareCountDetail } from "@/types/models";
import { hardwaredevicesRetrieve, hardwaredevicesList } from "@/types/endpoints";
import CustomSelect from "@/components/CustomSelect";
import QRCodeReader from '@/components/admin/QRCodeReader';
import { hardwareRetrieve } from "@/types/endpoints";

export default function HardwareDeviceScanner({
    device,
    setDevice,
    hardware
  }: {
    device: HardwareWithType | null;
    setDevice: (device: HardwareWithType | null) => void;
    hardware: HardwareWithType[];
  }) {
    const { data: session, status } = useSession();
    const [selectedValue, setSelectedValue] = useState<string>('');
    const hardwareOptions = useMemo(
      () =>
        hardware.map((hardware, i) => ({
          value: i.toString(),
          label: (
            <div className="flex flex-row items-center justify-start gap-2">
              {hardware.checked_out_to != null && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 64 64"
                  className="w-4 h-4 min-w-4 min-h-4 max-w-4 max-h-4"
                >
                  <path
                    fill="#43a047"
                    d="M32 2C15.431 2 2 15.432 2 32c0 16.568 13.432 30 30 30 16.568 0 30-13.432 30-30C62 15.432 48.568 2 32 2zm-6.975 48-.02-.02-.017.02L11 35.6l7.029-7.164 6.977 7.184 21-21.619L53 21.199 25.025 50z"
                  />
                </svg>
              )}
              {`${hardware.hardwareType.name}: ${hardware.serial}`}
            </div>
          ),
          searchLabel: `${hardware.hardwareType.name}: ${hardware.serial}`
        })),
      [hardware]
    );
  
    const fetchHardwareType = async (hardwareTypeId: string | null): Promise<HardwareCountDetail | null> => {
      if (!hardwareTypeId) {
        toast.error('Hardware Device is missing hardware type ID');
        return null;
      }
      const hardwareType = await hardwareRetrieve(hardwareTypeId, {
        headers: {
          Authorization: `Bearer ${session!.access_token}`
        }
      });
      if (!hardwareType) {
        toast.error('Hardware Type not found for device');
        return null;
      }
      return hardwareType;
    }
    const handleScanSuccess = async (id: string | null, serial: string | null) => {
      let device: HardwareWithType | null = null;
      let hardwareType: HardwareCountDetail | null = null;
      if (id) {
        const deviceRetrieveResponse = await hardwaredevicesRetrieve(id, {
          headers: {
            Authorization: `Bearer ${session!.access_token}`
          }
        });
        if (!deviceRetrieveResponse.hardware) {
          toast.error('Hardware Type not found for device');
          return;
        }
        hardwareType = await fetchHardwareType(deviceRetrieveResponse.hardware.id || null);
        if (!hardwareType || !deviceRetrieveResponse.hardware.id) {
          toast.error('Hardware Type not found for device');
          return;
        }
        device = {
          ...deviceRetrieveResponse,
          hardware: deviceRetrieveResponse.hardware.id!,
          checked_out_to: deviceRetrieveResponse.checked_out_to?.id || null,
          hardwareType: hardwareType
        }
      } else if (serial) {
        const deviceListResponse = await hardwaredevicesList({ serial: serial }, {
          headers: {
            Authorization: `Bearer ${session!.access_token}`
          }
        });
        if (deviceListResponse.length > 1) {
          toast.error('Multiple devices found for serial');
          return;
        }
        const firstDevice = deviceListResponse[0];
        hardwareType = await fetchHardwareType(firstDevice.hardware || null);
        if (!hardwareType) {
          toast.error('Hardware Type not found for device');
          return;
        }
        device = {
          ...firstDevice,
          hardwareType: hardwareType
        }
      }
      setDevice(device);
    }
    return (
      <div>
        <div className="m-4 flex flex-row space-x-2">
          <CustomSelect
            label="Search by"
            options={hardwareOptions}
            value={selectedValue}
            onChange={setSelectedValue}
            search={true}
          />
          {selectedValue && (
            <button
              className="bg-[#493B8A] px-2 py-0 rounded-full text-white"
              onClick={() => setDevice(hardware[Number.parseInt(selectedValue)])}
            >
              Select
            </button>
          )}
        </div>
        <QRCodeReader
          uniquifier="hardware"
          extraConfig={{
            rememberLastUsedCamera: false,
            qrbox: 500
          }}
          onScanSuccess={async (id: string) => {
            const identifier = id.slice(1);
            const isSerial = id.startsWith('S');
            const idParam = !isSerial ? id : null;
            const serialParam = isSerial ? identifier : null;
            await handleScanSuccess(idParam, serialParam);
          }}
        ></QRCodeReader>
      </div>
    );
  }
  