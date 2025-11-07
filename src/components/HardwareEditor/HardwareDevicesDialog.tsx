import { useHardwaredevicesList } from "@/types/endpoints";
import { CreateHardware } from "@/types/types2";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { HardwareDevice } from "@/types/models";
import { CircularProgress } from "@mui/material";
import HardwareDeviceEditor from "./HardwareDeviceEditor";

export default function HardwareDevicesEditor({ hardware }: { hardware: CreateHardware }) {
    const { data: session } = useSession();
    const {
      data: hardwareDevices,
      isLoading: isLoadingHardwareDevices,
      error: hardwareDevicesError,
      mutate: mutateHardwareDevices
    } = useHardwaredevicesList({
      hardware: hardware.id
    }, {
      swr: { enabled: !!session?.access_token}, 
      request: {
        headers: {
          'Authorization': `JWT ${session?.access_token}`
        }
      }
    });
    const [devices, setDevices] = useState<Partial<HardwareDevice>[]>([]);
    useEffect(() => {
      if (hardwareDevices) {
        setDevices(hardwareDevices);
      }
    }, [hardwareDevices]);
  
    // TODO: fix broken add new on new hardware type
    function addNew() {
      setDevices([
        ...devices,
        {
          id: '',
          serial: Math.random().toString(36).substring(7),
          checked_out_to: null,
          hardware: hardware.id
        }
      ]);
    }
  
    return (
      <div className="w-56 px-5 py-4 my-4 mr-4">
        <p>{isLoadingHardwareDevices ? 'Loading...' : `${devices?.length || 0} devices.`}</p>
        <p className="mt-1">
          <button
            className="cursor-pointer text-white bg-[#493B8A] py-1 px-2 rounded-full disabled:opacity-50 transition-all h-15"
            onClick={() => addNew()}
          >
            + add new
          </button>
        </p>
        <div className="content flex flex-col max-h-64 overflow-scroll mt-4">
          {isLoadingHardwareDevices ? (
            <CircularProgress />
          ) : (
            devices && devices.length > 0 ?
            devices
              .reverse()
              .map((device, i) => (
                <HardwareDeviceEditor
                  key={`item-${hardware.id}-device-${i}-${device.id}-${device.serial}`}
                  device={device}
                  access_token={session?.access_token}
                  deleteDevice={() =>
                    setDevices(
                      devices.filter(
                        (dev, ind) =>
                          dev.id + dev.serial! !==
                          (dev.id ? device.id : '') + device.serial!
                      )
                    )
                  }
                  setDevice={device =>
                    setDevices(
                      devices.map((dev, ind) =>
                        dev.id + dev.serial! !==
                        (dev.id ? device.id : '') + device.serial!
                          ? dev
                          : device
                      )
                    )
                  }
                  index={i + 1}
                />
              ))
            :
            <p>No devices found</p>
          )}
        </div>
      </div>
    );
  }
  