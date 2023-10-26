import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { SetDynamicRoute } from '../../utils/setDynamicRoute';
import { getAllHardware } from '@/app/api/hardware';

export default async function Hardware() {
  const session: any = await getServerSession(authOptions);

  if (session && session?.roles?.includes('default-roles-rh2024')) {
    try {
      const hardware: any = await getAllHardware(session.access_token);

      return (
        <main>
          <SetDynamicRoute />
          <h1 className="text-4xl text-center">Hardware</h1>
          <table className="mt-6 ml-auto mr-auto text-lg border border-gray-500">
            <thead>
              <tr>
                <th className="p-2 bg-blue-900 border border-gray-500">Id</th>
                <th className="p-2 bg-blue-900 border border-gray-500">Name</th>
                <th className="p-2 bg-blue-900 border border-gray-500">
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {hardware.map((item: any) => (
                <tr key={item?.id}>
                  <td className="p-1 border border-gray-500">{item?.id}</td>
                  <td className="p-1 border border-gray-500">{item?.name}</td>
                  <td className="p-1 border border-gray-500">{item?.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      );
    } catch (err) {
      console.error(err);

      return (
        <main>
          <h1 className="text-4xl text-center">Hardware</h1>
          <p className="text-lg text-center text-red-600">
            Sorry, an error happened. Check the server logs.
          </p>
        </main>
      );
    }
  }

  redirect('/unauthorized');
}
