import HardwareCheckout from '@/components/admin/hardware/HardwareCheckout';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import {
  getAllHardware,
  getAllHardwareDevices,
  getHardware
} from '@/app/api/hardware';
import { getAllAttendees } from '@/app/api/attendee';
import { Hardware } from '@/types/types';

export default async function Checkout() {
  const session: any = await getServerSession(authOptions);
  if (
    session &&
    ['admin', 'organizer'].some(role => session?.roles?.includes(role))
  ) {
    const attendees = await getAllAttendees(session.access_token);
    const hardware = await getAllHardwareDevices(session.access_token);
    const hardwareTypes = Object.fromEntries(
      (await getAllHardware(session.access_token)).map((hardware: Hardware) => [
        hardware.id,
        hardware
      ])
    );
    const hardwareWithType = hardware.map((item: any) => ({
      ...item,
      hardware: hardwareTypes[item.hardware]
    }));
    return (
      <HardwareCheckout
        attendees={attendees}
        hardware={hardwareWithType}
      ></HardwareCheckout>
    );
  }
}
