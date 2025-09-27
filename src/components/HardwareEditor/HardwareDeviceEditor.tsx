import { useState } from "react";
import { HardwareDevice, PatchedHardwareDeviceRequest, HardwareDeviceRequest } from "@/types/models";
import { toast } from "sonner";
import {
    hardwaredevicesCreate,
    hardwaredevicesPartialUpdate,
    hardwaredevicesDestroy,
} from "@/types/endpoints";
import CloseIcon from '@mui/icons-material/Close';
import { Save } from '@mui/icons-material';

export default function HardwareDeviceEditor({
    device,
    access_token,
    deleteDevice,
    setDevice,
    index
  }: {
    device: Partial<HardwareDevice>;
    access_token?: string;
    deleteDevice: () => void;
    setDevice: (device: Partial<HardwareDevice>) => void;
    index?: number;
  }) {
    const [loading, setLoading] = useState(false);
    const isPersistedToDB = device.id;
    const [serial, setSerial] = useState(device.serial || '');
    const [lastSavedSerial, setLastSavedSerial] = useState(device.serial || '');
    const hasChanged = serial !== lastSavedSerial;
  
    function save() {
      if (!device.hardware || !access_token) {
        toast.error('Failed to save hardware device');
        return
      };
      
      const deviceData = { serial: serial, hardware: device.hardware };
      
      setDevice({
        ...device,
        serial: serial
      });
      
      if (!isPersistedToDB) {
        const payload: HardwareDeviceRequest = { ...deviceData };
        setLoading(true);
        hardwaredevicesCreate(payload, {
          headers: { Authorization: `Bearer ${access_token}` }
        })
        .then(res => {
          setDevice({
            id: res.id,
            serial: res.serial,
            hardware: device.hardware
          });
          setSerial(res.serial);
          setLastSavedSerial(res.serial);
          toast.success('Hardware device created successfully');
        })
        .catch(err => {
          setDevice({
            ...device,
            serial: device.serial
          });
          setSerial(device.serial || '');
          toast.error('Failed to create hardware device');
        })
        .finally(() => setLoading(false));
      } else {
        setLoading(true);
        const payload: PatchedHardwareDeviceRequest = {
          ...deviceData,
        }
        hardwaredevicesPartialUpdate(device.id, payload, {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        })
          .then(res => {
            setDevice({
              ...device,
              serial: res.serial
            });
            setSerial(res.serial);
            setLastSavedSerial(res.serial);
            toast.success('Hardware device updated successfully');
          })
          .catch(err => {
            toast.error('Failed to update hardware device');
          })
          .finally(() => setLoading(false));
      }
    }
  
    function remove() {
      if (!isPersistedToDB) {
        deleteDevice();
      } else if (access_token) {
        setLoading(true);
        hardwaredevicesDestroy(device.id, {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        })
          .then(() => {
            deleteDevice();
          })
          .finally(() => setLoading(false));
      }
    }
  
    return (
      <div className="flex">
        {index}.
        <button className="text-[#CC2F34]" onClick={remove} disabled={loading}>
          <CloseIcon />
        </button>
        {hasChanged || !isPersistedToDB ? (
          <button className="text-[#493B8A]" onClick={save} disabled={loading}>
            <Save />
          </button>
        ) : null}
        <input
          value={serial}
          onChange={e => setSerial(e.target.value)}
          disabled={loading}
          className="m-0.5 shadow-md rounded-md px-1 border"
        ></input>
      </div>
    );
  }
  