import { getAllHardware, getHardwareCategories } from '@/app/api/hardware';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import FilteredHardwareRequestViewer from '../../../../components/FilteredHardwareRequestViewer';

export default async function HardwareRequest() {
  const session: any = await getServerSession(authOptions);

  if (session) {
    // && ['default-roles-master', 'default-roles-rh2024'].some(role => session?.roles?.includes(role))) {
    try {
      const hardware: any = await getAllHardware(session.access_token);
      const hardwareCategories: any = await getHardwareCategories(
        session.access_token
      );

      return (
        <FilteredHardwareRequestViewer
          hardware={hardware}
          hardwareCategories={hardwareCategories}
        ></FilteredHardwareRequestViewer>
      );
    } catch (err) {
      console.error(err);

      return (
        <>
          <p className="text-lg text-center text-red-600">
            Sorry, an error happened. Check the server logs.
          </p>
        </>
      );
    }
  }

  redirect('/unauthorized');
}
