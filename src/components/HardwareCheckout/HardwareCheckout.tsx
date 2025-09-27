'use client';
import HardwareRequestTable from '@/components/HardwareRequestTable/HardwareRequestTable';
import { useState } from 'react';
import { AttendeeList } from '@/types/models';
import { HardwareWithType } from '@/types/types2';
import HardwareDeviceScanner from './HardwareDeviceScanner';
import UserScanner from './UserScanner';

export default function HardwareCheckout({
  attendees,
  hardware
}: {
  attendees: AttendeeList[];
  hardware: HardwareWithType[];
}) {
  const [user, setUser] = useState<AttendeeList | null>(null);
  const [hardwareDevice, setHardwareDevice] = useState<HardwareWithType | null>(
    null
  );
  return (
    <div className="h-screen p-6">
      <h1 className="ml-2 text-xl m-4">Find or scan user</h1>
      {user == null ? (
        <>
          <UserScanner
            user={user}
            setUser={setUser}
            attendees={attendees}
          ></UserScanner>
        </>
      ) : (
        <>
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
      <h1 className="ml-2 text-xl m-4">Scan device</h1>
      {hardwareDevice ? (
        <>
          <p>
            Device scanned: {hardwareDevice.hardwareType.name},{' '}
            {hardwareDevice.serial}
          </p>
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
        ></HardwareDeviceScanner>
      )}
    </div>
  );
}

