'use client';
import { getAttendee } from '@/app/api/attendee';
import { getHardware, getHardwareDevice } from '@/app/api/hardware';
import CustomSelect from '@/components/CustomSelect';
import HardwareRequestView from '@/components/HardwareRequestView';
import QRCodeReader from '@/components/admin/QRCodeReader';
import { Attendee, HardwareDevice } from '@/types/types';
import { useSession } from 'next-auth/react';
import { useMemo, useState } from 'react';

export default function HardwareCheckout({
  attendees,
  hardware
}: {
  attendees: Attendee[];
  hardware: HardwareDevice[];
}) {
  const [user, setUser] = useState<Attendee | null>(null);
  const [hardwareDevice, setHardwareDevice] = useState<HardwareDevice | null>(
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
          <HardwareRequestView
            requester={user.id}
            hardwareDevice={hardwareDevice}
            setCheckedOutTo={request =>
              setHardwareDevice({
                ...hardwareDevice!,
                checked_out_to: request
              })
            }
            statusEditable={true}
          ></HardwareRequestView>
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
            Device scanned: {hardwareDevice.hardware.name},{' '}
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

function UserScanner({
  user,
  setUser,
  attendees
}: {
  user: Attendee | null;
  setUser: (user: Attendee | null) => void;
  attendees: Attendee[];
}) {
  const [selectedValue, setSelectedValue] = useState<string>('');
  const attendeeOptions = useMemo(
    () =>
      attendees.map((attendee, i) => ({
        value: i.toString(),
        label: (
          <div className="flex flex-row items-center justify-start gap-2">
            {attendee.checked_in_at && (
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
            {`${attendee.first_name} ${attendee.last_name}`}
          </div>
        ),
        searchLabel: `${attendee.first_name} ${attendee.last_name}`
      })),
    [attendees]
  );
  const { data: session, status } = useSession();
  return (
    <div>
      <div className="m-4 flex flex-row space-x-2">
        <CustomSelect
          label="Search by"
          options={attendeeOptions}
          value={selectedValue}
          onChange={setSelectedValue}
          search={true}
        />
        {selectedValue && (
          <button
            className="bg-[#493B8A] px-2 py-0 rounded-full text-white"
            onClick={() => setUser(attendees[Number.parseInt(selectedValue)])}
          >
            Select
          </button>
        )}
      </div>
      <QRCodeReader
        uniquifier="user"
        extraConfig={{
          rememberLastUsedCamera: false,
          qrbox: 500
        }}
        onScanSuccess={(id: string) => {
          getAttendee(session!.access_token, id).then(attendee => {
            setUser(attendee);
          });
        }}
      ></QRCodeReader>
    </div>
  );
}

function HardwareDeviceScanner({
  device,
  setDevice,
  hardware
}: {
  device: HardwareDevice | null;
  setDevice: (device: HardwareDevice | null) => void;
  hardware: HardwareDevice[];
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
            {`${hardware.hardware.name}: ${hardware.serial}`}
          </div>
        ),
        searchLabel: `${hardware.hardware.name}: ${hardware.serial}`
      })),
    [hardware]
  );
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
        onScanSuccess={(id: string) => {
          const identifier = id.slice(1);
          const isSerial = id.startsWith('S');
          const query = isSerial ? { serial: identifier } : { id: identifier };
          getHardwareDevice(session!.access_token, query).then(device => {
            if (isSerial) {
              device = device[0];
            }
            if (
              typeof device.hardware == 'string' ||
              device.hardware instanceof String
            ) {
              getHardware(session!.access_token, device.hardware).then(
                hardware => {
                  device.hardware = hardware;
                  setDevice(device);
                }
              );
            } else {
              setDevice(device);
            }
          });
        }}
      ></QRCodeReader>
    </div>
  );
}
