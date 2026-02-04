'use client';
import HardwareRequestTable from '@/components/HardwareRequestTable/HardwareRequestTable';
import AdminHardwareRequestDialog from '@/components/admin/hardware/AdminHardwareRequestDialog';
import { useState, useMemo } from 'react';
import { HardwareWithType } from '@/types/types2';
import { AttendeeWithCheckIn } from '@/contexts/EventParticipantsContext';
import { useHardwareContext } from '@/contexts/HardwareContext';
import HardwareDeviceScanner from './HardwareDeviceScanner';
import UserScanner from './UserScanner';
import { toast } from 'sonner';
import { HardwareRequestList } from '@/types/models';

type ScanMode = 'user' | 'hardware';

type LastDeviceByType = {
  hardwareTypeId: string;
  hardwareTypeName: string;
  device: HardwareWithType;
  request: HardwareRequestList;
};

export default function HardwareCheckout({
  attendees,
  hardware
}: {
  attendees: AttendeeWithCheckIn[];
  hardware: HardwareWithType[];
}) {
  const [user, setUser] = useState<AttendeeWithCheckIn | null>(null);
  const [hardwareDevice, setHardwareDevice] = useState<HardwareWithType | null>(null);
  const [scanMode, setScanMode] = useState<ScanMode>('user');
  const [createRequestDialogOpen, setCreateRequestDialogOpen] = useState(false);

  // Get hardware requests from context
  const { hardwareRequests, hardwareDeviceTypeMap } = useHardwareContext();

  // Group hardware requests by type and get the last device associated with each type
  const lastDevicesByType = useMemo((): LastDeviceByType[] => {
    if (!hardwareRequests || hardwareRequests.length === 0) return [];

    // Filter to requests that have a device assigned and sort by updated_at descending
    const requestsWithDevices = hardwareRequests
      .filter(req => req.hardware_device)
      .sort((a, b) => {
        const dateA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
        const dateB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
        return dateB - dateA;
      });

    const byType = new Map<string, LastDeviceByType>();

    for (const request of requestsWithDevices) {
      const hardwareTypeId = request.hardware;
      
      // Only keep the first (most recent) request for each hardware type
      if (byType.has(hardwareTypeId)) continue;

      // Find the matching device in hardware list
      const matchingDevice = hardware.find(h => h.id === request.hardware_device);
      if (!matchingDevice) continue;

      const hardwareTypeName = hardwareDeviceTypeMap[hardwareTypeId]?.name || 'Unknown';

      byType.set(hardwareTypeId, {
        hardwareTypeId,
        hardwareTypeName,
        device: matchingDevice,
        request,
      });
    }

    return Array.from(byType.values());
  }, [hardwareRequests, hardware, hardwareDeviceTypeMap]);

  const selectDevice = (device: HardwareWithType) => {
    setHardwareDevice(device);
    toast.success(`Selected device: ${device.serial}`);
  };

  return (
    <div className="h-screen p-6">
      {/* Scan Mode Toggle */}
      <div className="flex mb-6 border-b border-gray-200">
        <button
          className={`px-6 py-3 font-medium transition-colors ${
            scanMode === 'user'
              ? 'text-[#493B8A] border-b-2 border-[#493B8A]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setScanMode('user')}
        >
          Scan User
        </button>
        <button
          className={`px-6 py-3 font-medium transition-colors ${
            scanMode === 'hardware'
              ? 'text-[#493B8A] border-b-2 border-[#493B8A]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setScanMode('hardware')}
        >
          Scan Device
        </button>
      </div>

      {/* User Section */}
      {scanMode === 'user' && (
        <>
          <h1 className="ml-2 text-xl m-4">Find or scan user</h1>
          {user == null ? (
            <UserScanner
              user={user}
              setUser={setUser}
              attendees={attendees}
            />
          ) : (
            <>
              <div className="m-4 p-4 bg-gray-100 rounded-lg">
                <p className="font-medium">
                  Selected: {user.first_name} {user.last_name}
                </p>
              </div>
              <HardwareRequestTable
                requester={user.id}
                userSelectedHardwareDevice={hardwareDevice}
                setCheckedOutTo={request =>
                  setHardwareDevice({
                    ...hardwareDevice!,
                    checked_out_to: request?.id || null,
                    hardwareType: hardwareDevice!.hardwareType
                  })
                }
                statusEditable={true}
              />
              <button
                className="cursor-pointer text-white bg-[#493B8A] p-4 m-4 rounded-full disabled:opacity-50 transition-all h-15 self-end"
                onClick={() => setUser(null)}
              >
                Close user
              </button>
              <button
                className="cursor-pointer text-white bg-[#493B8A] p-4 m-4 rounded-full disabled:opacity-50 transition-all h-15 self-end"
                onClick={() => setCreateRequestDialogOpen(true)}
              >
                Create new request
              </button>
              <AdminHardwareRequestDialog
                open={createRequestDialogOpen}
                onClose={() => setCreateRequestDialogOpen(false)}
                preselectedAttendee={user}
              />
            </>
          )}
        </>
      )}

      {/* Hardware Section */}
      {scanMode === 'hardware' && (
        <>
          <h1 className="ml-2 text-xl m-4">Scan device</h1>
          {hardwareDevice ? (
            <>
              <div className="m-4 p-4 bg-gray-100 rounded-lg">
                <p className="font-medium">
                  Device scanned: {hardwareDevice.hardwareType.name}, {hardwareDevice.serial}
                </p>
              </div>
              {user && (
                <HardwareRequestTable
                  requester={user.id}
                  userSelectedHardwareDevice={hardwareDevice}
                  setCheckedOutTo={request =>
                    setHardwareDevice({
                      ...hardwareDevice!,
                      checked_out_to: request?.id || null,
                      hardwareType: hardwareDevice!.hardwareType
                    })
                  }
                  statusEditable={true}
                />
              )}
              <button
                className="cursor-pointer text-white bg-[#493B8A] p-4 m-4 rounded-full disabled:opacity-50 transition-all h-15 self-end"
                onClick={() => setHardwareDevice(null)}
              >
                Close device
              </button>
            </>
          ) : (
            <>
              <HardwareDeviceScanner
                device={hardwareDevice}
                setDevice={setHardwareDevice}
                hardware={hardware}
              />
              {/* Last registered device buttons by hardware type */}
              {lastDevicesByType.length > 0 && (
                <div className="m-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Quick select last registered:</h3>
                  <div className="flex flex-wrap gap-2">
                    {lastDevicesByType.map((item) => (
                      <button
                        key={item.hardwareTypeId}
                        className="cursor-pointer text-white bg-[#493B8A] px-4 py-2 rounded-full disabled:opacity-50 transition-all text-sm hover:bg-[#5a4a9e]"
                        onClick={() => selectDevice(item.device)}
                        title={`Serial: ${item.device.serial}`}
                      >
                        Last {item.hardwareTypeName}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Status indicators */}
      <div className="fixed bottom-4 right-4 flex gap-2">
        {user && (
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            User: {user.first_name} {user.last_name}
          </div>
        )}
        {hardwareDevice && (
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            Device: {hardwareDevice.serial}
          </div>
        )}
      </div>
    </div>
  );
}
