'use client';
import HardwareRequestTable from '@/components/HardwareRequestTable/HardwareRequestTable';
import { useState } from 'react';
import { HardwareWithType } from '@/types/types2';
import { AttendeeWithCheckIn } from '@/hooks/useEventRsvps';
import HardwareDeviceScanner from './HardwareDeviceScanner';
import UserScanner from './UserScanner';

type ScanMode = 'user' | 'hardware';

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
            <HardwareDeviceScanner
              device={hardwareDevice}
              setDevice={setHardwareDevice}
              hardware={hardware}
            />
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
