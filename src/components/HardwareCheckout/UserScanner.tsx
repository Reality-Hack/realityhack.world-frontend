import { useState, useMemo } from "react";
import CustomSelect from "@/components/CustomSelect";
import QRCodeReader from '@/components/admin/QRCodeReader';
import { AttendeeWithCheckIn } from '@/hooks/useEventRsvps';

export default function UserScanner({
    user,
    setUser,
    attendees
  }: {
    user: AttendeeWithCheckIn | null;
    setUser: (user: AttendeeWithCheckIn | null) => void;
    attendees: AttendeeWithCheckIn[];
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
            const attendee = attendees.find(a => a.id === id);
            if (attendee) {
              setUser(attendee);
            }
          }}
        ></QRCodeReader>
      </div>
    );
  }
  